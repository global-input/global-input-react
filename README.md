This is a [Global Input App](https://globalinput.co.uk) React JS library for applications that are running on computers, SmartTV, IoT and other smart devices to have mobile integration. With the mobile integration, users will be able to use their mobiles to operate on the applications to enjoy many mobile-related features such as 
[Mobile Encryption](https://globalinput.co.uk/global-input-app/mobile-content-encryption), 
[Mobile Authentication](https://globalinput.co.uk/global-input-app/mobile-authentication), 
[Mobile Input & Control](https://globalinput.co.uk/global-input-app/mobile-input-control), 
[Second Screen Experience](https://globalinput.co.uk/global-input-app/second-screen-experience), 
 [Mobile Personal Storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage), 
 [Mobile Encryption & Signing](https://globalinput.co.uk/global-input-app/mobile-content-encryption), 
[Mobile Content Transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer) etc. 


## Setup

```shell
npm i global-input-react
```

## Usage

You just need to pass a configuration to the ```useGlobalInputApp``` function, specifying the user interface elements that the [Global Input App](https://globalinput.co.uk/) should display to the user. The mobile application transfers the result of the user interactions with those elements via a secure communication powered by end-to-end encryption.

For example, following will display a Sign In form on the connected mobile device, and the application will receive the events as the user interacts with it:

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
         id:"username",
         type:"text"        
       },{
         label:"Password",
         type:"text",        
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
When the above application runs, it displays an encrypted QR code in the place of ```connectionMessage``` that a user would use the [Global Input App](https://globalinput.co.uk/) to scan to establish a  communication that is secured with end-to-end encryption. The ```values``` variable that is returned by ```useGlobalInputApp``` will contains the up-to-date values of the form elements. The ```id``` of the form is used by the mobile app to locate an existing data in its encrypted storage.

If a field in a form has the type attribute with "encrypt", its content will be encrypted and sent to the application. In the same way, if the type "decrypt", the content will be decrypted. You may employ this to secure the data stored on the cloud. For more information, please visit [Global Input Website](https://globalinput.co.uk/)

