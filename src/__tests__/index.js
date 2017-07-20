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


/*

test("encrypt and decrypt should work", function(done){
  const testInput=new TestGlobalInputReceiver();
  const sender=new TestGlobalInputSender();

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
  class TestGlobalInputReceiver extends GlobalInputReceiver {
      getGlobalInputConfig(){
        return this.config;
      }
    render() {
      return null;
    }
  }

  class TestGlobalInputSender extends GlobalInputSender {
    render() {
      return null;
    }
    onInputPermissionResult: function(message){
      super.onInputPermissionResult(message);
      expect(message.metadata[0].name).toBe(config.metadata[0].name);
      expect(message.metadata[0].value).toBe(config.metadata[0].value);
      expect(message.metadata[1].name).toBe(config.metadata[1].name);
    }
  }

  testInput.config=config;
  testInput.componentWillMount();
  testInput.render();
  const codeData=testInput.connector.buildInputCodeData();








});
*/
