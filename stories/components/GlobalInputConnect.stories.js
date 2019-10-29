import React, {useState,useRef} from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {GlobalInputConnect} from '../../src/index';


const SingleFieldFormTest= ()=>{  
    const [content,setContent]=useState('');
    
    const globalInput=useRef(null);

    const mobileConfig={
      initData:{
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
    },
       url: "https://globalinput.co.uk"
    };
    
    return (
        <GlobalInputConnect mobileConfig={mobileConfig}  
        connectedMessage="Scan with your Global Input App"  
        ref={globalInput}
        renderSenderDisconnected={(sender, senders)=>(<div>Disconnected</div>)}>
        <div>When you type on your mobile, the content will appear below</div>
              <textarea style={{width:500, height:500}} value={content} onChange={evt => {
                  setContent(evt.target.value);
                  globalInput.current.sendInputMessage(evt.target.value,0);
                  }}/>
        </GlobalInputConnect>
    );
}






storiesOf('GlobalInputConnect', module)
  .addDecorator(story => <div style={{ textAlign: 'center', marginTop:0 }}>{story()}</div>)     
  .add("Single Field Form",()=><SingleFieldFormTest/>)

