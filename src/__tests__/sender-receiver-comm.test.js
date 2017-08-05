import {GlobalInputComponent} from "../index";
import React, {Component} from 'react';

import renderer from 'react-test-renderer';
import {createMessageConnector} from "global-input-message";


test("sender and receiver communication", function(done){
  var receiver=null;
  var sender=null;
  var inputData="dilshat hewzulla";
      class TestGlobalInputReceiver extends GlobalInputComponent {
          render(){
            return null;
          }
          buildInitData(){
        return {
                action:"input",
                form:{
                  "title":"Sign In",
                  fields:[{
                            label:"Email address",

                            operations:{
                                onInput:function(username){
                                    console.log("******"+username);
                                    expect(username).toBe(inputData);
                                    sender.disconnect();
                                    receiver.componentWillUnmount();
                                    done();
                                }
                            }

                          },{
                             label:"Password",
                             type:"secret",
                             operations:{
                               onInput:function(password){

                               }
                             }

                          },{
                             label:"Login",
                             type:"button",
                             operations:{
                                onInput:function(){

                                }
                             }

                          }]
                      }
                }
    }

    buildConnectionOptions(){
      var options=super.buildConnectionOptions();
      options.onRegistered=function(next){

            next();
            var inputcodedata=receiver.connector.buildInputCodeData();
            sender=createMessageConnector();
            sender.processCodeData(inputcodedata, {
                    onInputCodeData:function(codedata){

                  var options=sender.buildOptionsFromInputCodedata(codedata, {
                      onInputPermissionResult:function(message){
                            console.log("***** received permission");
                            sender.sendInputMessage(inputData,0);

                      }

                    });
                    sender.connect(options);

                }

             });


      }
      return options;
    }


      }
      receiver=new TestGlobalInputReceiver();
      receiver.componentDidMount();



});
