import React, {Component} from 'react'

import {createMessageConnector} from "global-input-message";
import QRCode from "qrcode.react";


export  default class GlobalInputReceiver extends Component {
  getGlobalInputConfig(){
    var config=  {
      options:{
          onInput:this.onInput.bind(this)
      }
    };
    if(this.props.onRegistered){
        config.options.onRegistered=this.props.onRegistered;
    }
    return config;
  }
  constructor(props){
    super(props);
    this.connector=createMessageConnector();
  }

onInput(inputMessage){
    this.getGlobalInputConfig().metadata[inputMessage.data.index].onInput(inputMessage.data.value);
}
  connectToMessenger(){
          var config=this.getGlobalInputConfig();
          if(!config.options){
            config.options={};
          }
          var options=Object.assign({},config.options);
          if(config.metadata){
              options.metadata=config.metadata.map(function(m){
                  var metadata=Object.assign({},m);
                  if(metadata.onInput){
                      delete metadata.onInput
                  }
                  return metadata;
              });
          }
          this.connector.connect(options);
}
displayInputCode(){
      const codedata=this.connector.buildInputCodeData();
      console.log("**codedata to be displayed:[["+codedata+"]]");
      return(
         <QRCode value={codedata}/>
      );
}
displayApiCode(){
      const codeData=this.connector.buildInputCodeData();
      return(
         <QRCode value={codeData}/>
      );
}
displaySessionGroupCode(){
      const codeData=this.connector.buildSessionGroupCodeData();
      return(
         <QRCode value={codeData}/>
      );
}
displayAESCodeData(){
      const codeData=this.connector.buildCodeAESCodeData();
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
