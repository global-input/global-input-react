import React, {useState,useRef} from 'react';

import QRCode from "qrcode.react";

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {useGlobalInputApp,MobileState} from '../../src/index';


const SingleFieldFormTest= ()=>{  
    const [content,setContent]=useState('');    
      const initData={
          action:"input",
          dataType:"form",
          form:{
            id:"test@globalinput.co.uk",
            title:"Global Input App Test",
            label:"Global Input Test",
            fields:[{
              label:"Content",
              id:"content",
              value:"",
              nLines:10,
              operations:{
                  onInput:setContent
              }
          }]
      }
   };
   const {mobile, connectionCode,mobileState,errorMessage}=useGlobalInputApp({initData});
   switch(mobileState){
        case MobileState.INITIALIZING:return (<div>Initialising....</div>);
        case MobileState.ERROR:return (<div>{errorMessage}</div>);
        case MobileState.WAITING_FOR_MOBILE:return(
            <div>
                <div>
                <QRCode value={connectionCode} level={'H'} size={400}/>
                </div>
                <div>
                Scan with Global Input App
                </div>                                
            </div>            
        );
        case MobileState.MOBILE_CONNECTED:
            return(<textarea style={{width:500, height:500}} value={content} onChange={evt => {
                setContent(evt.target.value);
                            mobile.sendInputMessage(evt.target.value,0);
                }}/>);
        case MobileState.MOBILE_DISCONNECTED:
            return <div>Disconnected</div>


   }    
    
}






storiesOf('GlobalInputConnect', module)
  .addDecorator(story => <div style={{ textAlign: 'center', marginTop:0 }}>{story()}</div>)     
  .add("Single Field Form",()=><SingleFieldFormTest/>)

