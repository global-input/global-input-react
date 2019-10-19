import React from "react";
import {tracker} from 'qrcode.react';
import {createMessageConnector} from "global-input-message";
import { GlobalInputConnect } from "../index";

import { render, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { JestEnvironment } from "@jest/environment";



   /*
   The device app/|(Receiver app) display a QR Code, the sender app scans the qr code to object the connection information.
   And then the sender app (Global Input App) uses the connection information connects to the device app and then receives the form fields defined by the device app.   
   And then the GIA sencd a content to the device app.
   And then device sends an content to the GIA
   */

  it("bidirectional communication between receiver/device app and the sender (GIA)", async function (){    
  
          var formFieldContentPromiseResolver=null;
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
                      onInput: content => formFieldContentPromiseResolver(content)
                    }
                  }
                ]
              }
            },
            url: "https://globalinput.co.uk"
          };
          var globalInputController=React.createRef();

          async function  getCodeFromReceiver(){
              const {getByTestId} = render(
                <GlobalInputConnect
                ref={globalInputController}
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
            
          function createMessageReceiverForGIA(){          
                var messageReceiverProxy=null;
                var onInput= message =>{
                      messageReceiverProxy(message);
                }; 

                var promise =new Promise((resolve,reject)=>{
                   messageReceiverProxy=message=>{
                        resolve(message);
                   }                    
                });
                var getMessage= async function(){
                      return promise;
                }
            return {onInput,getMessage};
          };
          var messageReceiverForGIA=createMessageReceiverForGIA();



              
          async function senderReceivedConnectedRequestResult(connectionInformation, sender,onInputFromReceiver){
            return new Promise(resolve=>{
                var senderMobileConfig={
                    connectSession:connectionInformation.session,
                    url:connectionInformation.url,
                    aes:connectionInformation.aes,
                    apikey:connectionInformation.apikey,
                    securityGroup:connectionInformation.securityGroup,
                    onInputPermissionResult: function(message){
                        resolve(message);            
                    },
                    onInput: messageReceiverForGIA.onInput
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
          async function userFillsAFieldInTheForm(targetFieldIndex, fieldContent){                
            sender.sendInputMessage({
                    content:fieldContent
            },targetFieldIndex );  //0 is index of the field in the target form that the content is going to be sent over.
            return new Promise(resolve=>{
                formFieldContentPromiseResolver=resolve;
            });     
          }
          var code=await getCodeFromReceiver();                        
          var connectionInformation=await obtainConnectionInformationFromCode(sender,code);     
          
          var messageReceivedFromSender=await senderReceivedConnectedRequestResult(connectionInformation, sender);
          
          var sampleText="User filled this content on the Global Input App";
          var recivedContentByReceiver=await userFillsAFieldInTheForm(0,sampleText);
          
          expect(recivedContentByReceiver).toEqual({
              content:sampleText
          });
          

          
          var sampleMessageSentByDevice={
                id:"content",
                content:"message by device app",
                index:0
          };

          

          globalInputController.current.sendInputMessage(sampleMessageSentByDevice.content, sampleMessageSentByDevice.index);

          var messageReicevedByGIA=await messageReceiverForGIA.getMessage();
           expect(messageReicevedByGIA.data.value).toBe(sampleMessageSentByDevice.content);
           expect(messageReicevedByGIA.data.index).toBe(sampleMessageSentByDevice.index);

          console.log("==============:"+JSON.stringify(messageReicevedByGIA));          
  });

