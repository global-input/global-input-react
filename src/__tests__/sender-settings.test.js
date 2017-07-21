import {GlobalInputReceiver,GlobalInputSender} from "../index";
import React, {Component} from 'react';

import renderer from 'react-test-renderer';

test("sender get settings", function(done){
  var receiver=null;
  var sender=null;
  var apikey="dilshatapikey";
  class TestGlobalInputReceiver extends GlobalInputReceiver {

  }


  class TestGlobalInputSender extends GlobalInputSender {
    render(){
      return (<div/>);
    }
    onInputPermissionResult(message){
      super.onInputPermissionResult(message);
      console.log("********sender is ready");
      this.setGlobalInputData(0, inputData);
    }
    onSettings(codedata, next){
           console.log("datadata received:"+JSON.stringify(codedata));
           next();
           expect(sender.apikey).toBe(apikey);
           done();
    }
  }

  var onReceiverReady=function(done, registeredMessage,options){

    console.log("**********receiver is ready******");
    receiver.connector.apikey=apikey;
    var codedata=receiver.connector.buildAPIKeyCodeData();

    const senderRenderer = renderer.create(
        <TestGlobalInputSender codedata={codedata} ref={(input) =>{sender=input}}/>
      );
  }

  const receiverRenderer = renderer.create(
      <TestGlobalInputReceiver onRegistered={onReceiverReady} ref={(input) =>{receiver=input}}/>
      );



});
