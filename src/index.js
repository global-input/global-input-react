import React, {Component} from 'react'

import {createMessageConnector} from "global-input-message";
import QRCode from "qrcode.react";


export   class GlobalInputReceiver extends Component {
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
      const inputCodeData=JSON.stringify(this.connector.buildInputCodeData());
      return(
         <QRCode value={inputCodeData}/>
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





export  class GlobalInputSender extends Component{

     constructor(props){
        super(props);
       this.connector=createMessageConnector();
     }
     createUUID() {
       function s4() {
         return Math.floor((1 + Math.random()) * 0x10000)
           .toString(16)
           .substring(1);
       }
       function getTimeValue(){
         return new Date().getTime();
       }
       return s4()+'-'+getTimeValue();
     }
     disconnect(){
       this.connector.disconnect();
     }

     componentWillUnmount(){
          this.disconnect();
    }
     componentWillMount(){
        const codedata=this.props.codedata;
        this.processCodeData(codedata);
      }
     processCodeData(codedata){
             var that=this;
             var options={
                onInputPermissionResult:this.onInputPermissionResult.bind(this)
             };
             this.connector.processCodeData(options,codedata);
   }
   onInputPermissionResult(message){
     console.log("*******sender received the onInputPermissionResult****");
     var globalInputdata=message.metadata;
     globalInputdata.forEach(dataitem=>{
       if(!dataitem.value){
         dataitem.value="";
       }
     });
     this.setState(Object.assign({}, this.state,{globalInputdata}));

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
             id:this.createUUID,
             value,
             index
           };
      this.connector.sendInputMessage(message);
      this.setState(Object.assign({}, this.state,{globalInputdata}));
  }
  

  render() {
    return null;
  }

}
