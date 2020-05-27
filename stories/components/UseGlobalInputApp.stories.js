import React, {useState,useRef, useEffect} from 'react';

import QRCode from "qrcode.react";

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {useGlobalInputApp} from '../../src/index';


const MobileToDeviceOnly = ()=>{  
       
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
 const loginInitData={
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
 
 const onFieldChanged=({field,setInitData})=>{
    if(field.id==='login'){
        setInitData(loginInitData);
    }
 }
 
   const {connectionMessage,WhenConnected, WhenDisconnected,values}=useGlobalInputApp({initData, onFieldChanged});
   const [username, password]=values;    
   
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


const UseSetters = ()=>{  

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





const UseSetFieldValueById = ()=>{  
    const [username,setUsername]=useState('uu');
    const [password,setPassword]=useState('pp');
 
    const initData={
        action:"input",
        dataType:"form",
        form:{            
          title:"Sign In", 
          id:"###username###@global-input-app-story-test",           
          fields:[{
            label:"Username",
            id:"username",
            value:username,
            nLines:1,
            
        },{
            label:"Password",
            id:"password",
            value:password,
            nLines:1,            
        },{
          label:"Login",
          type:"button",
          id:"login"           
        }]
    }
 };  
 
   
   const {connectionMessage,WhenConnected, WhenDisconnected,field,setInitData, setFieldValueById}=useGlobalInputApp({initData});
   
   
   
    useEffect(()=>{
        if(!field){
            return;
        }
        switch(field.id){
             case 'login':
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
              break;
            case 'username':
                setUsername(field.value);
                break;
            case 'password':
                setPassword(field.value);
                break;    

        }
        
    },[field]);
   

            return(
                <>
                    <div>Multiple Steps</div>
                    <div>{connectionMessage}
                    <WhenConnected>
                        <div>Username:<input value={username} onChange={evt=>{
                            setUsername(evt.target.value);
                            setFieldValueById('username',evt.target.value);
                        }}/> </div>
                        <div>Password:<input value={password} onChange={evt=>{
                            setPassword(evt.target.value);
                            setFieldValueById('password', evt.target.value);
                        }}/> </div>
                        <div>Password:{password}</div>
                    </WhenConnected>
                    <WhenDisconnected>
                        Reload the page to try again
                    </WhenDisconnected>

                    
                    </div>
                </>
                );
        
    
};


storiesOf('UseGlobalInputApp', module)
  .addDecorator(story => <div style={{ textAlign: 'center', marginTop:0 }}>{story()}</div>)     
  .add("Mobile To Device Only",()=><MobileToDeviceOnly/>)
  .add("Use Setters",()=><UseSetters/>)
  .add('Use setFieldValueById',()=><UseSetFieldValueById/>);
  
  
  

