import React, {useState,useRef, useEffect} from 'react';

import QRCode from "qrcode.react";

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {useGlobalInputApp} from '../../src/index';


const LoginTest = ()=>{  
       
    const initData={
        action:"input",
        dataType:"form",
        form:{            
          title:"Sign In", 
          id:"###username###@global-input-app-story-test",           
          fields:[{
            label:"Username",
            id:"username",
            value:"test",
            nLines:1,
            
        },{
            label:"Password",
            id:"password",
            value:"test",
            nLines:1,            
        },{
          label:"Login",
          type:"button",
          id:"login"           
        }]
    }
 };  
 
 
   const {connectionMessage,WhenConnected, WhenDisconnected,field,values,setInitData}=useGlobalInputApp({initData});
   const [username, password]=values;
   
   
    useEffect(()=>{
        if(field && field.id=='login'){
            const initData={
                action:"input",
                dataType:"form",
            form:{            
              title:"Sign In Complete",            
              fields:[{
                type:"info",            
                value:"Test Completed",                        
            }]
            }
          };
          setInitData(initData);
        }
    },[field]);
   

            return(
                <>
                    <div>Multiple Steps</div>
                    <div>{connectionMessage}
                    <WhenConnected>
                        <div>Username:{username}</div>
                        <div>Password:{password}</div>
                    </WhenConnected>
                    <WhenDisconnected>
                        Reload the page to try again
                    </WhenDisconnected>

                    
                    </div>
                </>
                );
        
    
};


const ContentTransferTest = ()=>{  

    const initData={
        action:"input",
        dataType:"form",
        form:{            
          title:"Content Transfer",            
          fields:[{
            label:"Content",
            id:"content",
            value:"",
            nLines:10            
        }]
        }
    };  
    let {connectionMessage,WhenConnected, WhenDisconnected,field,values,setters}=useGlobalInputApp({initData});
    const [content]=values;
    const [setContent]=setters;

    return(
        <div>
           <div>{connectionMessage}</div>
                    <WhenConnected>
                            <textarea style={{width:500, height:500}} value={content} onChange={evt => {
                                setContent(evt.target.value);                                   
                            }}/>
                    </WhenConnected>
                    <WhenDisconnected>
                     {content}
                    </WhenDisconnected>
    </div>
    );


}



storiesOf('UseGlobalInputApp2', module)
  .addDecorator(story => <div style={{ textAlign: 'center', marginTop:0 }}>{story()}</div>)     
  .add("Login",()=><LoginTest/>)
  .add("ContentTransferTest",()=><ContentTransferTest/>);
  
  
  

