/* istanbul ignore file */
import React from "react";
import { getDisplayedQRCodeProperties } from 'qrcode.react';
import { createMessageConnector } from "global-input-message";
import { GlobalInputConnect } from "../../index";

import { render, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { JestEnvironment } from "@jest/environment";


/**
   * This is for creating promise object that are to be resolved outside of the construct of Promise.    * 
   */
  const createMessagePromise=()=>{
    let resultResolve=null;
    let promise=new Promise(resolve => resultResolve=resolve);
    return {promise, resolve:resultResolve};
  }


/**
 * 
 * @typedef {Object} DeviceAppMobileConfig 
 * @property {Object} mobileConfig - config that is used for connecting to GIA  (Global Input App)
 * @property {function} getContentReceivedFromGIA - returns Promise holding the content received from GIA
 * 
 */

/**
 * Creates the mobile config for the device application
 * return {DeviceAppMobileConfig} 
 */
const createDeviceAppMobileConfig= () => {  
    var contentMessage = createMessagePromise();
    
    const mobileConfig = {
      initData: {
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
              operations: {onInput:message => contentMessage.resolve(message)}
            }
          ]
        }
      },
      url: "https://globalinput.co.uk"
    };
    const getContentReceivedFromGIA=async ()=>contentMessage.promise;  
    return { mobileConfig, getContentReceivedFromGIA} 
  };
  /**
   * 
   * @type {Object} DeviceApp
   * @property {function} getDisplayedQRCodeValue - {size, level, value} properties of the QR Code, which is obtained by mocking the package.
   * @property {function} sendMessageToGIA - the function can can be used to send message content to the GIA
   * @property {function} getContentReceivedFromGIA - the function that returns promise for receiving the content received from GIA. The content is just one field in the form specified in the config
   * @property {Object} mobileConfig - config that is used for the device application
   */
  /**
   *Creates an DeviceApp so it first display a QR Code using the GlobalInputApp component, passing the mobileConfig 
   * 
   * @return {DeviceApp}
   */
  const createDeviceApp = () => {
        const {mobileConfig, getContentReceivedFromGIA}=createDeviceAppMobileConfig();        
        var globalInputController = React.createRef();        
        const { getByTestId } = render(
            <GlobalInputConnect
              ref={globalInputController}
              mobileConfig={mobileConfig}
              connectedMessage="Scan with your Global Input App"
            />
        );
        var sendMessageToGIA = (content,index) =>{
              globalInputController.current.sendInputMessage(content, index);
        };

        var changeInitData = initData =>{
            globalInputController.current.changeInitData(initData);
        };
        

        return {getDisplayedQRCodeProperties, sendMessageToGIA,getContentReceivedFromGIA, mobileConfig, changeInitData};
  }

  

  /**
   * This function will be invoked when the connection information is extracted from the QR code successfully.
   * @param {*} sender - the GIA connector 
   * @param {*} connectionInformation - the connection information extracted from the QR code,
   * @return {Object} - the connectToDeviceApp function property can be invoked after this to connect to the device application
   */
  
  const buildGIAConnectorFromConnectionInformation= (sender, connectionInformation) => {
                                        
        let connectionResult=createMessagePromise();    
        let messageFromDeviceApp=createMessagePromise();


        let mobileConfig = {
                connectSession: connectionInformation.session,
                url: connectionInformation.url,
                aes: connectionInformation.aes,
                apikey: connectionInformation.apikey,
                securityGroup: connectionInformation.securityGroup,
                onInputPermissionResult: function (message) {
                    connectionResult.resolve(message);
                },
                onInput: message=>messageFromDeviceApp.resolve(message)
        };
        let connectToDeviceApp=async ()=>{
            sender.connect(mobileConfig);
            return connectionResult.promise; 
        }
        let getMessageFromDeviceApp=async ()=>messageFromDeviceApp.promise; 
        let sendMessageToDeviceApplication = (content,index) => sender.sendInputMessage(content,index);   
        let resetMessageFromDeviceApp = ()=> messageFromDeviceApp=createMessagePromise();            

        return {mobileConfig,connectToDeviceApp,sendMessageToDeviceApplication,getMessageFromDeviceApp, resetMessageFromDeviceApp};
  };
  
 
  


  /**
   * 
   * @type {Object} GlobalInputApp   
   * @property {Object} mobileConfig - the configuration obtained from the QR Code for connecting to the device application
   * @property {function} connectToDeviceApp - the function for initiating the process of connecting to the device application
   * @property {function} sendMessageToDeviceApplication - the function for sending messages to the connected device application
   * @property {function} getMessageFromDeviceApp - the function for obtaining the information received from the device app
   */
  /**
   *Creates Global Input App instance using the connectionCode obtained from the QR Code, so that we can use it to connect to the device application securely
   * 
   * @return {GlobalInputApp}
   */

  const createGlobalInputApp = async connectionCode=>{
        const sender = createMessageConnector();
        sender.client = "testsender";
        return new Promise(resolve => {
            sender.processCodeData(connectionCode, {
                onInputCodeData:connectionInformation => {
                const result=buildGIAConnectorFromConnectionInformation(sender,connectionInformation);                            
                resolve(result);
              }});
          });
  };   

  
  
       
        
    const createNextInitData = ()=>{
            var firstName = createMessagePromise();                
            var lastName = createMessagePromise();                
            const  initData = {
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
            const waitForFirstName=async ()=>firstName.promise;  
            const waitForLastName=async ()=>lastName.promise;  
            return { initData, waitForFirstName,waitForLastName};
        };
  

  export {createDeviceApp,createGlobalInputApp,createNextInitData};