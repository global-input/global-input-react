This is a [Global Input App](https://globalinput.co.uk) React JS library for applications that are running on computers, SmartTV, IoT and other smart devices to have mobile integration. With the mobile integration, users can use their mobile to operate on the applications and enjoy many mobile-related features such as 
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

You just need to pass the configuration to the ```useGlobalInputApp```, so that the [Global Input App](https://globalinput.co.uk/) knows what user interface element it needs to display to the user. The content of the user input will be passed over to the mobile to the application via a secure communication powered by end-to-end encryption.

For example, following will display a Sign In form on the connected mobile device:

```JavaScript

import {useGlobalInputApp} from 'global-input-react';
import React  from 'react';


export default ({login}){  
  
  const onLogin=()=>{
    login(username,password);
  }
  const initData={                              
     form:{
       title:"Sign In",
       id:"###username###@mycompany.com",  
       fields:[{
         label:"Username",
         id:"username"         
       },{
         label:"Password",
         id:"password"         
      },{
        label:"Sign In",
        type:"button",            
        operations:{onInput:onLogin}
     }]
    }  
 };
 const {connectionMessage, values}=useGlobalInputApp({initData});    
 const [username,password]=values;

    return (
        <div>
           {connectionMessage}
          <div>             
              <label htmlFor='username'>Username:</label>
             <input  id='username' type='text'
             readOnly={true} value={username}/>            
          </div>
          <div>             
              <label htmlFor='password'>Username:</label>
             <input  id='password' type='password'
             readOnly={true} value={password}/>            
          </div>
          <div>                           
             <button  id='login' onClick={onLogin}></button>
             
          </div>
        </div>
    );
  };


```
For more information, please visit [Global Input Website](https://globalinput.co.uk/)

