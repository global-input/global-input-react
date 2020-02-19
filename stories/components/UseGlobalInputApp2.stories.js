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
          fields:[{
            label:"Username",
            id:"username",
            value:"",
            nLines:1,
            
        },{
            label:"Password",
            id:"password",
            value:"",
            nLines:1,            
        },{
          label:"Login",
          type:"button",
          id:"login"           
        }]
    }
 };  
 
 
   let {connectionMessage,WhenConnected, WhenDisconnected,field,values,setInitData}=useGlobalInputApp({initData});
   const [username,password]=values;
   
    useEffect(()=>{
        if(field && field.id=='login'){
            const initData={
                action:"input",
                dataType:"form",
            form:{            
              title:"Sign In Complete",            
              fields:[{
                type:"info",            
                value:"You have entered",                        
            },{
                label:"Username",
                type:"info",                        
                value:username,                        
            },{
                label:"Password",
                type:"info",                        
                value:password,                        
            }]
            }
          }
          setInitData(initData);

        }
    },[field])
   

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





storiesOf('UseGlobalInputApp2', module)
  .addDecorator(story => <div style={{ textAlign: 'center', marginTop:0 }}>{story()}</div>)     
  .add("Login",()=><LoginTest/>);
  
  

