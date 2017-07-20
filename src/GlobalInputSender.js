import React, {Component} from 'react'

import {createMessageConnector} from "global-input-message";
import QRCode from "qrcode.react";





export  default class GlobalInputSender extends Component{

     constructor(props){
        super(props);
       this.connector=createMessageConnector();
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
             id:this.connector.generatateRandomString(10),
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
