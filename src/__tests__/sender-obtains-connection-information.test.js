import React from "react";
import {tracker} from 'qrcode.react';
import {createMessageConnector} from "global-input-message";
import { GlobalInputConnect } from "../index";

import { render, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { JestEnvironment } from "@jest/environment";
import { exportAllDeclaration } from "@babel/types";



    

  it("Sender Receives Connection Information From QR CODE", async () => {              
          const mobileConfig = {
            initData: {
              action: "input",
              dataType: "form",
              form: {}
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
              const resolvedSpan = await waitForElement(() =>
                getByTestId("globalinput-qr-code-label")
              );              
              return tracker.lastCall.value; //code to scan              
          }
          const sender=createMessageConnector();
          async function obtainConnectionInformationFromCode(sender, code){
            return new Promise(resolve=>{
                sender.processCodeData(code, {onInputCodeData:connectionCode=>{
                  resolve(connectionCode);                  
              }}); 
            });            
          }
          var code=await getCodeFromReceiver();          
          var connectionInformation=await obtainConnectionInformationFromCode(sender,code);
          expect(connectionInformation.url).toEqual(expect.stringMatching(/http.+/));
          expect(connectionInformation.apikey.length).toBeGreaterThan(10);
          expect(connectionInformation.aes.length).toBeGreaterThan(10);
        
  });

