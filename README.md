This is a [Global Input App](https://globalinput.co.uk) React JS module for applications running devices like computers, SmartTV, IoT devices to have mobile integration. It allows users to use their mobiles to operate on applications, enjoying mobile-related features like
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

You just need to pass a configuration to the ```useGlobalInputApp``` function, specifying the user interface elements that the mobile app should display to the user. The device application receives the mobile events as the user interacts with the user interface elements and the communication takes place with end-to-end encryption.

For example, following will display a Sign In form on the connected mobile device, and the application will receive the mobile events:

```JavaScript

import {useGlobalInputApp} from 'global-input-react';
import React, {useState} from 'react';

export default ({login}){  
  const [username,setUser] = useState('');
  const [password,setPassword] = useState('');

  const initData={                              
     form:{
       title: 'Sign In',
       id: '###username###@mycompany.com',  
       fields: [{         
         label: 'Username',
         id: 'username'         
       },{
         label: 'Password',
         id: 'password',                  
      },{
        id: 'login',
        label: 'Sign In',
        type: 'button'        
      }]
    }  
 };
 const globalInputApp=useGlobalInputApp({initData});
    
    useEffect(()=>{
      const {field}=globalInputApp;
      if(!field){
        return;
      }
      switch(field.id){
          case 'username': setUsername(field.value); break;
          case 'password': setPassword(field.value); break;
          case 'login': login(username,password);
      }
    },[globalInputApp.field])

    const {connectionMessage,WhenConnected} = globalInputApp;
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
The application displays an encrypted QR code in the place of ```{connectionMessage}``` while it is waiting for a mobile user to connect. Having connected, the mobile app displays the user interface that is defined by ```initData```. As the user interacts with the user interface elements on the mobile app, the application receives the events timely via the  ```field``` variable that is returned as part of object returned by ```useGlobalInputApp```.  The ```id``` attribute of the form is useful for the mobile app to locate an existing data in its encrypted storage to facilitate autofill operations.

The type of a field defines the related operation as well as the type of the corresponding user interface element. For example, if the type is "encrypt"/"decrypt", the mobile app initiates the encrypt/decrypt workflow. This is remarkably useful if you would like to secure data without worrying about how to secure the master encryption keys themselves. For more information, please visit [Global Input Website](https://globalinput.co.uk/).

Some of the useful attribute values returned by  ```useGlobalInputApp``` are listed in the table below:

| Attributes | Description |
| ------ | ------ |
| connectionMessage | The connection information that the mobile app scans to establish a secure connection to the application |
| values | An array of values that corresponds to the fields in the form |
|setters | An array of functions that you can use it set the value of the matching field |
|setFieldValueById | this function is mostly useful if you have a large number of fields in form and you would like set value by field id. The first parameter is the id of the field, and the second parameter is the value that you would like to |
|field |  The field that contains the id and value of the field corresponding to last event received from the mobile app |
| WhenWaiting | A container React component that you can use it to wrap content that you would like to display only when the application waiting for the user to connect |
| WhenConnected |  A container React component that you can use it to wrap content that you would like to display only when a user has connected to the application  |
| WhenDisconnected | A container React component that you can use it to wrap content that you would like to display only when a user has connected and then disconnected |
| WhenError | A container React component that you can use it to wrap content that you would like to display when there is an error, you can use {errorMessage} to find out what has happened, for example ```<WhenError>{errorMessage}</WhenError>``` |
| errorMessage | This value wil be populated when an error is raised by the library |

