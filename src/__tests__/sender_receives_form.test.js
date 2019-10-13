import React from "react";
import {tracker} from 'qrcode.react';
import {createMessageConnector} from "global-input-message";
import { GlobalInputConnect } from "../index";

import { render, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { JestEnvironment } from "@jest/environment";



   /*
   The device app/|(Receiver app) display a QR Code, the sender app scans the qr code to object the connection information.
   And then the server app uses the connection information connects to the device app and then receives the form fields defined by the device app.   
   */

  it("sender receives the form sent by the receiver", async function (){    
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
                    operations: {
                      onInput: content => {}
                    }
                  }
                ]
              }
            },
            url: "https://globalinput.co.uk"
          };
          
          async function  getCodeFromReceiver(){
              const {getByTestId} = render(
                <GlobalInputConnect
                  mobileConfig={mobileConfig}        
                  connectedMessage="Scan with your Global Input App"
                />
              );
              //wait for QR Code show up
              const resolvedDiv = await waitForElement(() =>
                getByTestId("globalinput-qr-code-label")
              );
                      
              return tracker.lastCall.value; //code to scan              
          }

          async function senderReceivedConnectedRequestResult(connectionInformation, sender){
            return new Promise(resolve=>{
                var senderMobileConfig={
                    connectSession:connectionInformation.session,
                    url:connectionInformation.url,
                    aes:connectionInformation.aes,
                    apikey:connectionInformation.apikey,
                    securityGroup:connectionInformation.securityGroup,
                    onInputPermissionResult: function(message){
                        resolve(message);            
                    }
                };
                sender.connect(senderMobileConfig);
            });                    
          }

          const sender=createMessageConnector();
          sender.client="testsender";
          async function obtainConnectionInformationFromCode(sender, code){
            return new Promise(resolve=>{
                sender.processCodeData(code, {onInputCodeData:connectionCode=>{
                  resolve(connectionCode);                  
              }}); 
            });            
          }                      
        var code=await getCodeFromReceiver();                        
        var connectionInformation=await obtainConnectionInformationFromCode(sender,code);              
        var messageReceivedFromSender=await senderReceivedConnectedRequestResult(connectionInformation, sender);

        expect(messageReceivedFromSender.allow).toBeTruthy();
        expect(messageReceivedFromSender.initData.action).toEqual(mobileConfig.initData.action);
        expect(messageReceivedFromSender.initData.dataType).toEqual(mobileConfig.initData.dataType);
        expect(messageReceivedFromSender.initData.form.id).toEqual(mobileConfig.initData.form.id);
        expect(messageReceivedFromSender.initData.form.title).toEqual(mobileConfig.initData.form.title);
        expect(messageReceivedFromSender.initData.form.label).toEqual(mobileConfig.initData.form.label);
        mobileConfig.initData.form.fields.forEach((field,index)=>{
            expect(messageReceivedFromSender.initData.form.fields[index].label).toEqual(field.label);     
            expect(messageReceivedFromSender.initData.form.fields[index].id).toEqual(field.id);
            expect(messageReceivedFromSender.initData.form.fields[index].value).toEqual(field.value);     
            expect(messageReceivedFromSender.initData.form.fields[index].nLines).toBe(field.nLines);     
        });
       
          
  });

