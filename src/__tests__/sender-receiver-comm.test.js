import {CodeDataRenderer} from "../index";
import React, {Component} from 'react';

import renderer from 'react-test-renderer';
import {createMessageConnector} from "global-input-message";


test("sender and receiver communication", function(done){
  var receiver=null;
  var sender=null;
  var inputData="dilshat hewzulla";
  var props={
    service:{
      globalInput:{}
    }
  };

var n=new CodeDataRenderer(props);
done();


});
