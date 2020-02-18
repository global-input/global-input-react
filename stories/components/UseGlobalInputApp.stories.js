import React, {useState,useRef, useEffect} from 'react';

import QRCode from "qrcode.react";

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {useGlobalInputApp,MobileState} from '../../src/index';

const SimpleTest= ()=>{  
    const [content,setContent]=useState('');    
      const initData={
          action:"input",
          dataType:"form",
          form:{            
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
   const {mobile, connectionMessage, disconnect}=useGlobalInputApp({initData});
   
            return(
                <>
                    <div>{connectionMessage}
                    <textarea style={{width:500, height:500}} value={content} onChange={evt => {
                        setContent(evt.target.value);
                            mobile.sendInputMessage(evt.target.value,0);
                    }}/>
                    </div>
                </>
                );
        
    
};




const TwoUITest = ()=>{  
    const [data,setData]=useState({username:'',password:''});
    const [initData,setInitData]=useState(null);

    const setUsername=username=>{
        setData(data=>{
            return {...data,username};
        });
    };
    const setPassword=password=>{
        setData(data=>{
            return{...data,password};
        });
    };
    const toPassword=()=>{
        setInitData(passwordInitData);
    };
    const toLogin=()=>{
        setData(data=>{
            setInitData({
                action:"input",
                dataType:"form",
                form:{
                        title:"Completed",
                        fields:[{
                            label:'',
                            type:"info",
                            value:"You antered the following information"
                        },{
                            label:"Username",
                            type:"info",
                            value:data.username
                        },{
                            label:"Password",
                            type:"info",
                            value:data.password
                        }

                    ]
    
                }   
            });
            return data;

        })
          
    }
    const userNameInitData={
        action:"input",
        dataType:"form",
        form:{            
          title:"Username",            
          fields:[{
            label:"Username",
            id:"username",
            value:"",
            nLines:1,
            operations:{
                onInput:setUsername
            }
        },{
          label:"Continue",
          type:"button",
          id:"toPassword",                        
          operations:{
              onInput:toPassword
          } 
        }]
    }
 };  
 const passwordInitData={
    action:"input",
    dataType:"form",
    form:{            
      title:"Password",            
      fields:[{
        label:"password",
        id:"password",
        value:"",
        nLines:1,
        operations:{
            onInput:setPassword
        }
    },{
      label:"Login",
      type:"button",
      id:"toLogin",                        
      operations:{
          onInput:toLogin
      } 
    }]
}
};   
      
    
   useEffect(()=>{
       setInitData(userNameInitData);
   },[]);

   const {mobile, connectionMessage, disconnect}=useGlobalInputApp({initData},[initData]);
   
            return(
                <>
                    <div>{connectionMessage}
                    <div>Username:{data.username}</div>
                    <div>Password:{data.password}</div>
                    </div>
                </>
                );
        
    
};





storiesOf('UseGlobalInputApp', module)
  .addDecorator(story => <div style={{ textAlign: 'center', marginTop:0 }}>{story()}</div>)     
  .add("Simple Test",()=><SimpleTest/>)
  .add("Two UIs Test",()=><TwoUITest/>);
  

