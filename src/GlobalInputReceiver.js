import React, {Component} from 'react'

import {createMessageConnector} from "global-input-message";
import QRCode from "qrcode.react";


export  default class GlobalInputReceiver extends Component {
  getGlobalInputConfig(){
    return  {};
  }


onInput(inputMessage){
    this.getGlobalInputConfig().metadata[inputMessage.data.index].onInput(inputMessage.data.value);
}
  connectToMessenger(){
          this.connector=createMessageConnector();
          var config=this.getGlobalInputConfig();
          var options={onInput:this.onInput.bind(this)};
          if(this.props.onRegistered){
              options.onRegistered=this.props.onRegistered;
          }
          if(config.metadata){
              options.metadata=config.metadata.map(function(m){
                  var metadata=Object.assign({},m);
                  if(metadata.onInput){
                      delete metadata.onInput
                  }
                  return metadata;
              });
          }
          console.log("new metadata:"+options.metadata);
          if(config.url){
            options.url=config.url;
          }
          if(config.onInput){
            options.onInput=config.onInput;
          }

          this.connector.connect(options);
}
displayInputCode(){
      const codedata=JSON.stringify(this.connector.buildInputCodeData());
      return(
         <QRCode value={codedata}/>
      );
}
displayApiCode(){
      const codeData=JSON.stringify(this.connector.buildInputCodeData());
      return(
         <QRCode value={codeData}/>
      );
}
displaySessionGroupCode(){
      const codeData=JSON.stringify(this.connector.buildSessionGroupCodeData());      
      return(
         <QRCode value={codeData}/>
      );
}
displayAESCodeData(){
      const codeData=JSON.stringify(this.connector.buildCodeAESCodeData());
      return(
         <QRCode value={codeData}/>
      );
}

disconnectFromMessenger(){
  this.connector.disconnect();
}
componentWillMount(){
    this.connectToMessenger();
}

componentWillUnmount(){
    this.disconnectFromMessenger();
}

  render() {
    return null;
  }
}
