import {CodeDataRenderer} from "../index";
import React from 'react';
import GlobalInputConnect from '../index';

import renderer from 'react-test-renderer';

test("sender and receiver communication", function(done){
        var globalinputComponent=renderer.create(
              <GlobalInputConnect/>
        );
        //console.log(globalinputComponent.toJSON());
      done();
});
