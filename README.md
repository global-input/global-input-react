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
export default ({login}){  
  const [username,setUser] = useState('');
  const [password,setPassword] = useState('');

  const onFieldChanged=({field})=>{
      const fds=initData.form.fields;
      switch(field.id){
          case fds[0].id: setUsername(field.value); break;
          case fds[1].id: setPassword(field.value); break;
          case fds[2].id: login(username,password);
      }
  };
 
 const {connectionMessage}=useGlobalInputApp({initData,onFieldChanged});    
    return (
        <>
           {connectionMessage}                    
        </>
    );
  };
```
The content of  ```{connectionMessage}```  returned by the hook contains an encrypted QR Code that you can scan to connect to the application. Having connected, your mobile displays the user interface specified in the ```initData``` variable, allowing you to operate on the application. The ```onFieldChanged``` parameter is for callback function to receive the form events through the ```field``` variable.  

The ```initData``` specifies a form, in which  ```id``` is used for autofill operation inside the connected mobile app through filtering the existing data in its encrypted storage. The form contain a set of fields, representing data that device application and the connected mobile need to collaborate on composing. The type of each field defines the related data operation. For example, if the type is "encrypt"/"decrypt", the mobile app initiates the encrypt/decrypt workflow inside the mobile app. This is useful when you would like to secure data stored on other devices or cloud.



Other values returned by  the ```useGlobalInputApp``` function are listed in the table below:

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

## TypeScript support

The type definition file is included within the module. You can obtain more information from [this](https://github.com/global-input/test-global-input-app-libs/blob/master/src/test-global-input-react/mobile-and-device-app.test.tsx) end-to-end test example on how to use this library within a TypeScript application. 
