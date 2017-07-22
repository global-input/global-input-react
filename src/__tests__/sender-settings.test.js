import {GlobalInputComponent,GlobalInputReceiver} from "../index";
import React, {Component} from 'react';

import renderer from 'react-test-renderer';

test("sender get settings", function(done){


  var apikey="dilshatapikey";
  var receiver=new GlobalInputReceiver();
  var sender=new GlobalInputComponent();
  receiver.connector.apikey=apikey;
  var codedata=receiver.connector.buildAPIKeyCodeData();
  console.log("codedata to display:::::"+codedata);
  sender.processCodeData(codedata);
  expect(sender.connector.apikey).toBe(apikey);
  done();


});
