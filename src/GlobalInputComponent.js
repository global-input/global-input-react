import React, {Component} from 'react'

import {createMessageConnector} from "global-input-message";
import QRCode from "qrcode.react";


export  default class GlobalInputComponent extends Component {
  getGlobalInputConfig(){
    var config=  {
      options:{
          onInput:this.onInput.bind(this),
          onInputPermissionResult:this.onInputPermissionResult.bind(this),
          onSettingsCodeData:this.onSettingsCodeData.bind(this),
          onInputCodeData:this.onInputCodeData.bind(this)
      }
    };
    if(this.props && this.props.onRegistered){
        config.options.onRegistered=this.props.onRegistered;
    }
    return config;
  }
  onInputCodeData(codedata, next){
    console.log("default onInputCodeData is called:"+JSON.stringify(codedata));
    next();
  }
  onSettingsCodeData(codedata, next){
    console.log("default onSettingsCodeData is called:"+JSON.stringify(codedata));
    next();
  }
  buildConnectionOptions(){
    var config=this.getGlobalInputConfig();
    var options={};

    if(config.options){
          options=Object.assign({},config.options);
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
    return options;
  }
  constructor(props){
    super(props);
    this.connector=createMessageConnector();
  }

onInput(inputMessage){
    console.log("received the input message:"+inputMessage);
    if(this.getGlobalInputConfig().metadata){
          this.getGlobalInputConfig().metadata[inputMessage.data.index].onInput(inputMessage.data.value);
    }
}

  connectToMessenger(){
          var options=this.buildConnectionOptions();
          this.connector.connect(options);
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
componentDidMount(){
  if(this.props.codedata){
    this.processCodeData(this.props.codedata);
  }
 }


  render() {
    return null;
  }

  onInputPermissionResult(message){
    console.log("*******sender received the onInputPermissionResult****:"+message);
    var globalInputdata=message.metadata;
    globalInputdata.forEach(dataitem=>{
      if(!dataitem.value){
        dataitem.value="";
      }
    });
    this.setState(Object.assign({}, this.state,{globalInputdata}));
  }

  processCodeData(codedata){
      this.connector.processCodeData(this.buildConnectionOptions(),codedata);
  }
  setGlobalInputData(index, value){
      if(!this.state.globalInputdata){
           console.log("ignored:"+index+":"+value);
           return;
      }
       var globalInputdata=this.state.globalInputdata.slice(0);
        console.log("setting index:"+index+"value:"+value);
        globalInputdata[index].value=value;
        var message={
            id:this.connector.generatateRandomString(10),
            value,
            index
          };
     this.connector.sendInputMessage(message);
     this.setState(Object.assign({}, this.state,{globalInputdata}));
 }


}
