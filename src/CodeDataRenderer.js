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
            state:{sender:{}, senders:[], connected:false},
            componentWillUnmount:this.service.componentWillUnmount
          };
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


  render() {
      if(!this.state.connected){
          return null;
      }
      var codeClassName="globalInputCodeContainer senderNotConnected";
      if(this.state.senders && this.state.senders.length>0){
          codeClassName="globalInputCodeContainer senderConnected";
      }

      var {connector,type, level, size}=this.props;
      var codedata=null;
      if((!type) || type==="input"){
          codedata=this.service.globalInput.connector.buildInputCodeData();
      }
      else if(type==="pairing"){
          codedata=this.service.globalInput.connector.buildPairingData();
      }
      else{
        console.error("unrecognized type is CodeDataRenderer, input/pairing expected");
        return null;
      }
      if(!size){
        size=300;
      }
      size=parseInt(size);

      console.log("*****"+type+" code[["+codedata+"]]");
      return(
        <div className={codeClassName}>
              <div className="adjustableCodeData">
                <div className="adjustableCodeDataContainer">
                     <QRCode value={codedata} level={level} size={size}/>
                </div>
                <QRCodeAdjustControl render={this.props.showControl}/>
              </div>
              <div>
                 <SendersConnected senders={this.state.senders}/>
              </div>
          </div>
      );
  }


}
