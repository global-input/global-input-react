import React from 'react';
import {getQRCodeValues} from "qrcode.react";
import { useGlobalInputApp } from '../index';

import { render,screen, waitFor,findByTestId, findAllByTestId } from "@testing-library/react";
import {createMessageConnector} from 'global-input-message';
import {setCallbacksOnInitData,setCodeDataCallbacks,setCallbacksOnMobileConfig} from '../testUtil';



/**
 * 
 *  The device app/|(Receiver app) display a QR Code, the sender app scans the qr code to object 
 *  the connection information.And then the sender app (Global Input App) uses the connection information 
 *  connects to the device app and then receives the form fields defined by the device app. And then the GIA 
 *  send a content to the device app. And then device sends an content to the GIA
 * 
 */

const DeviceApplication = ({ initData, device }) => {
  const { connectionMessage,setInitData, setFieldValueById } = useGlobalInputApp({ initData });
  device.setFieldValueById = setFieldValueById;
  device.setInitData=setInitData;
  return (
      <div data-testid="testing">
          {connectionMessage}
      </div>);
};

it("Device App and Mobile App should be able to communicate", async function () {

 const initData1={
   action: "input",
   dataType: "form",
   form: {
     id: "test@globalinput.co.uk",
     title: "Global Input App Test",
     label: "Global Input Test",
     fields: [
       {
         label: "Content",
         id: "content",
         value: "",
         nLines: 10,                
       }
     ]
   }
  };
  
  const device={    
    receiveFieldInputMessages:[],//each return promise for receiving message corresponding to each form field
    setFieldValueById:null, //used for sending field messages to mobile
    setInitData:null //used for sending InitData
  };

  setCallbacksOnInitData(initData1,device); //set callbacks in the config
  
  const {findByTestId}=render(<DeviceApplication initData={initData1} device={device}/>);
  //should display a QR Code for mobile to scan to obtain the connection information
  const {code, level,size}=await getQRCodeValues({findByTestId}); //qrcode.react module is mocked

  expect(parseInt(size)).toBeGreaterThanOrEqual(300);//qrcode should be greater than 400
  expect(['H','L','M']).toContain(level);

  
  expect(code.length).toBeGreaterThan(100); //The QR Code should contain some encrypted content
  const mobile={
      connector:createMessageConnector(),
      onInputCodeData:null,
      onError:null,
      onPairing:null,
      getConnectionCode:null,
      getPermissionMessage:null,
      getInputMessage:null
  }
  
  
  setCodeDataCallbacks(mobile); //callbacks for decrypted connection code 
  mobile.connector.processCodeData(code,mobile); //decrypt connection code

  const collectionCode=await mobile.getConnectionCode(); //get decrypted connection code
  
  const senderConnectionConfig=mobile.connector.buildOptionsFromInputCodedata(collectionCode); //build connection config from the connection code
  setCallbacksOnMobileConfig(mobile,senderConnectionConfig);

  mobile.connector.connect(senderConnectionConfig); //start connection
  const permissionMessage=await mobile.getPermissionMessage(); //wait for permission message send by the target device

  if(!permissionMessage.allow){ //device not allowed to connect
    throw new Error("Device app denied the request to connect:"+permissionMessage.reason);          
  }  
  
  if(!permissionMessage.initData){ //device did not send back required information
      throw new Error("received empty initData");          
  }
  
  //Verify permission message contains the initData set by the device application
  expect(permissionMessage.initData.form.id).toBe(initData1.form.id);
  expect(permissionMessage.initData.form.title).toBe(initData1.form.title);
  expect(permissionMessage.initData.form.label).toBe(initData1.form.label);
  expect(permissionMessage.initData.form.fields[0].id).toBe(initData1.form.fields[0].id);
  expect(permissionMessage.initData.form.fields[0].label).toBe(initData1.form.fields[0].label);
  expect(permissionMessage.initData.form.fields[0].value).toBe(initData1.form.fields[0].value);
  expect(permissionMessage.initData.form.fields[0].nLines).toBe(initData1.form.fields[0].nLines);
  
  const sampleMessage={ 
          content:"User filled this content on the Global Input App",
          something:"222",
          colorCode:33
  }; 
  mobile.connector.sendInputMessage(sampleMessage, 0); //mobile sends information to the device
  const messageReceived= await device.receiveFieldInputMessages[0]();

  expect(messageReceived).toEqual(sampleMessage);
  const contentSendByDevice="send by device app";

  device.setFieldValueById(initData1.form.fields[0].id,contentSendByDevice);

  const inputMessageOnMobile=await mobile.getInputMessage();
  console.log(":::input--message:"+JSON.stringify(inputMessageOnMobile));
  expect(inputMessageOnMobile.data.value).toEqual(contentSendByDevice);
  expect(inputMessageOnMobile.data.index).toEqual(0);

  const initData2={
        action: "input",
        dataType: "form",
        form: {
        id: "test2@globalinput.co.uk",
        title: "Global Input App Test 2",
        label: "Global Input Test 2",
        fields: [
            {
                label: "First Name",
                id: "firstName",
                value: "",
                nLines: 10,
                operations: {onInput:message => firstName.resolve(message)}
            },{
                label: "Last Name",
                id: "lastName",
                value: "",
                nLines: 10,
                operations: {onInput:message => lastName.resolve(message)}
            },
        ]
        }
    }
    setCallbacksOnMobileConfig(mobile,senderConnectionConfig);
    setCallbacksOnInitData(initData2,device);
    device.setInitData(initData2);
    const initDataMessage=await mobile.getInputMessage();
    console.log("-----initDataMessage::::"+JSON.stringify(initDataMessage));    
    
    expect(initDataMessage.initData.action).toBe(initData2.action);
    expect(initDataMessage.initData.dataType).toBe(initData2.dataType);
    expect(initDataMessage.initData.form.id).toBe(initData2.form.id);
    expect(initDataMessage.initData.form.title).toBe(initData2.form.title);
    expect(initDataMessage.initData.form.label).toBe(initData2.form.label);

    initDataMessage.initData.form.fields.forEach((field,index)=>{
        expect(initData2.form.fields[index].label).toEqual(field.label);     
        expect(initData2.form.fields[index].id).toEqual(field.id);
        expect(initData2.form.fields[index].value).toEqual(field.value);     
        expect(initData2.form.fields[index].nLines).toBe(field.nLines);     
      });


 //verifies device receives what mobile sends.
    const firstName="dilshat";
    const lastName="hewzulla";
    
  mobile.connector.sendInputMessage(firstName, 0); //mobile sends information to the device
  const firstNameReceived= await device.receiveFieldInputMessages[0]();
  expect(firstNameReceived).toEqual(firstName);

  mobile.connector.sendInputMessage(lastName, 1); //mobile sends information to the device
  const lastNameReceived= await device.receiveFieldInputMessages[1]();
  expect(lastNameReceived).toEqual(lastName);

  mobile.connector.disconnect();
  
   
      
        
 
      


});





