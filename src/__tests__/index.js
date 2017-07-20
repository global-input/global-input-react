import {GlobalInputReceiver,GlobalInputSender} from "../index";
import React, {Component} from 'react';

import renderer from 'react-test-renderer';

test("sender and receiver communication", function(done){
      var receiver=null;
      var sender=null;
      var inputData="dilshat hewzulla";
      class TestGlobalInputReceiver extends GlobalInputReceiver {
          render(){
            return null;
          }
          getGlobalInputConfig(){
            return {
              url:"http://192.168.0.5:1337",
              metadata:[
                {
                  name:"Content",
                  value:"dilshat",
                  onInput:function(message){
                      expect(message).toBe(inputData);
                      receiver.componentWillUnmount();
                      sender.componentWillUnmount();
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
            }
          }


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
      }

      var onReceiverReady=function(done, registeredMessage,options){
        done();
        console.log("**********receiver is ready******");
        var codedata=receiver.connector.buildInputCodeData();

        const senderRenderer = renderer.create(
            <TestGlobalInputSender codedata={codedata} ref={(input) =>{sender=input}}/>
          );


      }
      const receiverRenderer = renderer.create(
          <TestGlobalInputReceiver onRegistered={onReceiverReady} ref={(input) =>{receiver=input}}/>
      );




});
