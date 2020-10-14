This React JS library allows you to introduce interoperability between your mobile app and your React applications. With this library, you will be able to receive mobile events from within your React applications, implementing interoperability logic in your device application instead of separating it across the  two interacting applications. This mechanism offers a range of features that include
[Mobile Encryption](https://globalinput.co.uk/global-input-app/mobile-content-encryption), 
[Mobile Authentication](https://globalinput.co.uk/global-input-app/mobile-authentication), 
[Mobile Input & Control](https://globalinput.co.uk/global-input-app/mobile-input-control), 
[Second Screen Experience](https://globalinput.co.uk/global-input-app/second-screen-experience), 
 [Mobile Personal Storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage), 
 [Mobile Encryption & Signing](https://globalinput.co.uk/global-input-app/mobile-content-encryption), 
[Mobile Content Transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer).  


## Setup

```shell
npm i global-input-react
```

## Usage

The custom React hook ```useGlobalInputApp``` allows a React component specify a mobile user interface declaratively.

The following example application defines a login screen allowing user to use their mobile to carry out login operation using their mobile.

```JavaScript

import {useGlobalInputApp} from 'global-input-react';
import React, {useState} from 'react';


const USERNAME="username";
const PASSWORD="Password";
const LOGIN="Login";

const initData={                              
     form:{
       title: 'Sign In',
       id: '###username###@mycompany.com',  
       fields: [{         
         id: USERNAME
         label: 'Username',         
       },{
         id:PASSWORD,
         label: 'Password'         
      },{
        id: LOGIN,
        label: 'Sign In',
        type: 'button'        
      }]
    }  
 };
export default ({login}){  
  
  const [username,setUser] = useState('');
  const [password,setPassword] = useState('');
  const {ConnectQR,mobile}=useGlobalInputApp({initData});     
  
  mobile.setOnchange(({field})=>{      
      switch(field.id){
          case USERNAME: setUsername(field.value); break;
          case PASSWORD: setPassword(field.value); break;
          case LOGIN: login(username,password);break;
      }    
  });
    return (
        <>
           <ConnectQR/>
        </>
    );
  };
```
The content of  ```<ConnectQR/>```  displays an encrypted QR Code that you can scan to connect to your application. Having connected, you will be able to use your mobile to operate on the application. 
You may use   ```mobile.setOnchange()``` to receive events sent by the connected mobile app.  

## TypeScript & Tests

More tests are provided in [a separate project](https://github.com/global-input/test-global-input-app-libs/blob/master/src/test-global-input-react/mobile-and-device-app.test.tsx), which demonstrates end-to-end interactions between a mobile app and a device application.
