This is a [Global Input App](https://globalinput.co.uk) React JS library, which allows applications that are running on computers, SmartTV, IoT and other smart devices to have mobile integration, so that users can use their mobile to operate on the applications and enjoy many mobile-related features such as 
[Mobile Encryption](https://globalinput.co.uk/global-input-app/mobile-content-encryption), 
[Mobile Authentication](https://globalinput.co.uk/global-input-app/mobile-authentication), 
[Mobile Input & Control](https://globalinput.co.uk/global-input-app/mobile-input-control), 
[Second Screen Experience](https://globalinput.co.uk/global-input-app/second-screen-experience), 
 [Mobile Personal Storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage), 
 [Mobile Encryption & Signing](https://globalinput.co.uk/global-input-app/mobile-content-encryption), 
[Mobile Content Transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer) etc. Since this is a React JS wrapper build on top of [the JavaScript library](https://github.com/global-input/global-input-message), you may opt to use the JavaScript library directly if you want.

## Setup

```shell
npm i global-input-react
```

## Usage

You need to specify a configuration data that request data from the Global Input App.

For example, if you would like your application request a ```Content``` data item:

```JavaScript
import {useGlobalInputApp} from 'global-input-react';
import React, {useState}  from 'react';


export default ()=>{  
    const [content,setContent]=useState('');
    
    const initData = {
            action: "input",
            dataType: "form",
            form: {
              title: "Content Transfer",
              fields: [{
                label: "Content",
                id: "content",
                value: "",
                nLines: 10,
                operations: {
                  onInput: setContent
                }
              }]
            }
        };
    
    const {connectionMessage}=useGlobalInputApp({initData},[]);
    
    return (
          <div>
            <div>{connectionMessage}</div>
            <div>{content}</div>            
          </div>
    );         
};


```
The complete code for [Content Transfer Application](https://globalinput.co.uk/global-input-app/content-transfer) is available on [GutHub](https://github.com/global-input/content-transfer-example)
Or you mat experiment with on [JSFiddle](https://jsfiddle.net/dilshat/ubakg74e/)

### Sign In Example

Another example is to display a Sign In form on the connected mobile. The form comprises of a  ```Username``` text field, a ```Password``` text field, and a ```Sign In``` button:

```JavaScript

import {useGlobalInputApp} from 'global-input-react';
import React, {useState}  from 'react';


export default ({login}){  
  
  const [data,setData]=useState({username:'',password:''});

  const setUsername = username =>{
        setData(data=>{
          return {...data,username};
        });
  };
  const setPassword = password =>{
        setData(data=>{
          return {...data,password};
        });
  };
  const onLogin = ()=>{
      setData(data=>{
          login(data.username,data.password);          
      });
  };

  

  let initData={                              
     form:{
       title:"Sign In",
       id:"###username###@mycompany.com",  
       fields:[{
         label:"Username",
         id:"username",            
         operations:{onInput:setUsername}
       },{
         label:"Password",
         id:"password",
         operations:{onInput:setPassword}
      },{
        label:"Sign In",
        type:"button",            
        operations:{onInput:onLogin}
     }]
    }  
 };
 const {connectionMessage}=useGlobalInputApp({initData},[]);    
    return (
        <div>
           {connectionMessage}
          <div>             
              <label htmlFor='username'>Username:</label>
             <input  id='username' type='text'
             readOnly={true} value={data.username}/>            
          </div>
          <div>             
              <label htmlFor='password'>Username:</label>
             <input  id='password' type='password'
             readOnly={true} value={data.password}/>            
          </div>
          <div>                           
             <button  id='login' onClick={onLogin}></button>
             
          </div>
        </div>
    );
  };

 

```


## More Examples
* [Content Transfer Example](https://globalinput.co.uk/global-input-app/content-transfer)
* [Second Screen Application](https://globalinput.co.uk/global-input-app/video-player)
* [Game Control Application](https://globalinput.co.uk/global-input-app/game-example)
* [Mobile Form Automation](https://globalinput.co.uk/global-input-app/send-message)
* [Mobile Form Transfer](https://globalinput.co.uk/global-input-app/form-data-transfer)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/qr-printing)
