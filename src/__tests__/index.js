import {GlobalInputReceiver} from "../index"
import React, {Component} from 'react'
import {createMessageConnector} from "global-input-message";



test("encrypt and decrypt should work", function(done){
  const testInput=new TestGlobalInputReceiver();
  const sender=createMessageConnector();
  var inputData={
            id:"11222",
            value:"dilshat hewzulla",
            index:0
          };


  var config={
      url:"http://192.168.0.5:1337",
      metadata:[
        {
          name:"Content",
          value:"dilshat",
          onInput:function(message){
              expect(message).toBe(inputData.value);
              sender.disconnect();
              testInput.componentWillUnmount();
              done();
          }
        },
         {
           name:"Submit",
           type:"action",
           onInput:function(message){
             console.log("**** Submit message received"+JSON.stringify(message));
           }
         }
      ]
  };

  testInput.config=config;
  testInput.componentWillMount();
  testInput.render();
  const codeData=testInput.connector.buildInputCodeData();

  console.log("receiver client:"+testInput.connector.client);
  console.log("receiver session:"+testInput.connector.session);
  console.log("sender client:"+sender.client);
  console.log("codedata:"+JSON.stringify(codeData));
  var senderOptions={
      onInputPermissionResult: function(message){
        expect(message.metadata[0].name).toBe(config.metadata[0].name);
        expect(message.metadata[0].value).toBe(config.metadata[0].value);
        expect(message.metadata[1].name).toBe(config.metadata[1].name);
        console.log("sender sending the input message:"+JSON.stringify(inputData));
        sender.sendInputMessage(inputData);
      }
    };
    sender.processCodeData(senderOptions,codeData);






});



class TestGlobalInputReceiver extends GlobalInputReceiver {
    getGlobalInputConfig(){
      return this.config;
    }
  render() {
    return null;
  }
}
