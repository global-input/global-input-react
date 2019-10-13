import React from "react";
import {tracker} from 'qrcode.react';
import {createMessageConnector} from "global-input-message";
import { GlobalInputConnect } from "../index";

import { render, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { JestEnvironment } from "@jest/environment";
import { CustomConsole } from "@jest/console";

/*
  The receiver app is a device app which displays a  QR code to tell the Global Input App how to connect to it securely   
*/
  it("Receiver Should Display a QR Code for Sender to Scan", async () => {
        
    const mobileConfig = {
      initData: {
        action: "input",
        dataType: "form",
        form: {}
      },
      url: "https://globalinput.co.uk"
    };   
    var code=null;
    
    async function receiverShouldConnectAndDisplayQRCode(){
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
          expect(getByTestId("globalinput-qr-code-label")).toHaveTextContent("Scan with your Global Input App");                              
          code=tracker.lastCall.value; //code to scan
          expect(code.length).toBeGreaterThan(200);
    }    
    receiverShouldConnectAndDisplayQRCode();
    
        
  });

