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
        operations: {
          onInput:() => login(username, password)
        }
     }]
    }  
 };
 const globalInputApp=useGlobalInputApp({initData});    
    const {connectionMessage,WhenConnected, values}=globalInputApp;
    const [username,password]=values;

    return (
        <>
           {connectionMessage}
          <WhenConnected>
            Now operate on your mobile to login
          </WhenConnected>             
        </>
    );
  };
```
When the above application runs, it displays an encrypted QR code in the place of ```connectionMessage``` that a user would use the [Global Input App](https://globalinput.co.uk/) to scan to establish a  communication secured with end-to-end encryption. The ```values``` variable that is returned by ```useGlobalInputApp``` will contains the received values matching the form fields specified. The ```id``` of the form is used by the mobile app to locate an existing data in its encrypted storage for autofill operation.

If a field in a form has the type attribute with "encrypt", its content will be encrypted and sent to the application. In the same way, if the type "decrypt", the content will be decrypted. You may employ this to secure the data stored on the cloud. For more information, please visit [Global Input Website](https://globalinput.co.uk/).

The some of the useful attribute values  in the object that is returned by ```useGlobalInputApp``` are listed in the table below:

| Attributes | Description |
| ------ | ------ |
| connectionMessage | The connection information that the Global Input App scans to establish a secure connection to the application |
| values | An array of values that corresponds to the fields in the forms |
|setters | An array of functions, each corresponds to a field in the form, and you can use it set the value of the matching field |
| WhenWaiting | A container React component that you can use it to wrap content that you would like to display only when the application waiting for the user to connect |
| WhenConnected |  A container React component that you can use it to wrap content that you would like to display only when a user has connected to the application  |
| WhenDisconnected | A container React component that you can use it to wrap content that you would like to display only when a user has connected and then disconnected |
| WhenError | A container React component that you can use it to wrap content that you would like to display only when the library throws error, you can use {errorMessage} to find out what has happenned, for example ```<WhenError>{errorMessage}</WhenError>``` |
| errorMessage | this variable wil be populated when an error occurs within the library |
