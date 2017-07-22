import QRCode from "qrcode.react";
import GlobalInputComponent from "./GlobalInputComponent";

export  default class GlobalInputReceiver extends GlobalInputComponent {
  displayInputCode(){
        const codedata=this.connector.buildInputCodeData();
        console.log("*****input code[["+codedata+"]]");
        return(
           <QRCode value={codedata}/>
        );
  }
  displayApiCode(){
        const codeData=this.connector.buildInputCodeData();
        console.log("*****api code[["+codeData+"]]");
        return(
           <QRCode value={codeData}/>
        );
  }
  displaySessionGroupCode(){
        const codeData=this.connector.buildSessionGroupCodeData();
        console.log("*****sessionGroup code[["+codeData+"]]");
        return(
           <QRCode value={codeData}/>
        );
  }
  displayAESCodeData(){
        const codeData=this.connector.buildCodeAESCodeData();
        console.log("*****CodeAES[["+codeData+"]]");
        return(
           <QRCode value={codeData}/>
        );
  }

}
