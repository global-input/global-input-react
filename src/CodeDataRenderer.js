import React, {Component} from 'react';
import QRCode from "qrcode.react";
import {createMessageConnector} from "global-input-message";
import SendersConnected from "./SendersConnected";
import QRCodeAdjustControl from "./QRCodeAdjustControl";

export   default class CodeDataRenderer extends Component {
    constructor(props){
    super(props);
    this.service=props.service;

    if(this.service.globalInput){
          this.state=this.service.globalInput.state;
    }
    else{
         var that=this;

          var globalInput={
            connector:createMessageConnector(),
            options:props.config,
            state:{sender:{}, senders:[], connected:false, level:this.props.level, size:this.props.size},
            componentWillUnmount:this.service.componentWillUnmount
          };
          if(!globalInput.state.size){
            globalInput.state.size=300;
          }
          globalInput.state.size=parseInt(globalInput.state.size);


          this.service.componentWillUnmount=function(){
            if(globalInput.componentWillUnmount){
                globalInput.componentWillUnmount();
            }

            globalInput.connector.disconnect();
          };
          globalInput.options.onSenderConnected=this.onSenderConnected.bind(this),
          globalInput.options.onSenderDisconnected=this.onSenderDisconnected.bind(this),
          globalInput.options.onRegistered=function(next){
              next();
              that.onConnected();
          },
          globalInput.options.onRegisterFailed=function(message){
                console.error("failed to register:"+JSON.stringify(message));
          }
          globalInput.connector.connect(globalInput.options);
          this.service.globalInput=globalInput;
          this.state=globalInput.state;
    }

  }
  onConnected(){

    var connected=true;
    var newState=Object.assign({},this.state,{connected});
    this.service.globalInput.state=newState;
    this.setState(newState);
  }
 onSenderConnected(sender, senders){
     var newState=Object.assign({},this.state,{sender, senders});
     this.service.globalInput.state=newState;
     this.setState(newState);
 }
 onSenderDisconnected(sender, senders){
    var newState=Object.assign({},this.state,{sender, senders});
    this.service.globalInput.state=newState;
    this.setState(newState);
 }
 onSetSize(size){
   var newState=Object.assign({},this.state,{size});
   this.service.globalInput.state=newState;
   this.setState(newState);
 }
 onSetLevel(level){
   var newState=Object.assign({},this.state,{level});
   this.service.globalInput.state=newState;
   this.setState(newState);
 }


  render() {
      if(!this.state.connected){
          return null;
      }
      var codeClassName="globalInputCodeContainer senderNotConnected";
      if(this.state.senders && this.state.senders.length>0){
          codeClassName="globalInputCodeContainer senderConnected";
      }


      var codedata=null;
      if((!this.props.type) || this.props.type==="input"){
          codedata=this.service.globalInput.connector.buildInputCodeData();
      }
      else if(this.props.type==="pairing"){
          codedata=this.service.globalInput.connector.buildPairingData();
      }
      else{
        console.error("unrecognized type is CodeDataRenderer, input/pairing expected");
        return null;
      }


      console.log("*** code[["+codedata+"]]");
      return(
        <div className={codeClassName}>
              <QRCode value={codedata} level={this.state.level} size={this.state.size}/>
              <QRCodeAdjustControl onSetSize={onSetSize} onSetLevel={onSetLevel}/>
              <SendersConnected senders={this.state.senders}/>
          </div>
      );
  }


}
