### Global Input React
This React module allows you to introduce a mobile interoperability into React applications on smart devices like smart TVs, set-top boxes, game consoles, and devices in IoT, so that users can use their mobiles to operate on them. It allows you to define mobile interfaces and receive mobile events from within your device applications, while keeping the mobile app as a general and universal mobile app that works across all types of device applications with different business logic: meaning that there is no need to switch to different mobile app for operating on different devices and no need to develop different mobile apps for different business or device applications. It also allows you to enrich your device applications with a set of mobile functionalities like [mobile encryption](https://globalinput.co.uk/global-input-app/mobile-content-encryption), [mobile authentication](https://globalinput.co.uk/global-input-app/mobile-authentication), [mobile input & control](https://globalinput.co.uk/global-input-app/mobile-input-control), [second screen experience](https://globalinput.co.uk/global-input-app/second-screen-experience), [mobile secure storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage), [mobile encryption & signing](https://globalinput.co.uk/global-input-app/mobile-content-encryption), and [mobile content transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer). The communication between a mobile app and a device application is often established through scanning an Encrypted QR Code that contains a set of communication parameters that includes one-time-use encryption key for starting an end-to-end encryption process.

This module is particularly useful in the current new normal established by the COVID-19 pandemic, where businesses require visiting customers to communicate accurately with customer representatives while enforcing the rules of wearing masks and social distancing. Thanks to this library, you will be able to establish an instant and secure communication right within the business software you are using, allowing your customers to collaborate effectively, securely and safely. For example, you may provide one-click subscriptions through user mobiles by leveraging the [mobile secure storage](https://globalinput.co.uk/global-input-app/mobile-authentication). Alternative, you do not even have to collect users' personal data thanks to the ability to request data on-demand from the mobile app at the point of service, freeing yourself from the pains of privacy regulations. You may also choose to allow your customers to encrypt their own data using their mobiles, giving users full control over the security and privacy of their personal data.


## Setup

```shell
npm install global-input-react
```
## Usage
```JavaScript

import {useGlobalInputApp} from  'global-input-react';

```
Then, ```useGlobalInputApp()``` function (which is a React hook) can be called with a parameter, defining a mobile user interface. For example, the following code displays a login screen on the user's mobile screen when connected to your application:

```JavaScript
const  usernameField={
	id:  'username',
	label:  'Username',
};

const  passwordField={
	id:'password',
	label:  'Password'
};

const  loginButton={
	id:  'login',
	label:  'Sign In',
	type:  'button'
};

const  mobile=useGlobalInputApp({initData:{
    form:{
       title:  'Sign In',
       fields: [usernameField,passwordField,loginButton]
     }
}});
```
The ```initData``` contains a ```form``` with a set of fields: ```usernameField```,```passwordField```, and ```loginButton```.


The object returned by ```useGlobalInputApp()``` function is stored into the  ```mobile``` variable. It contains a set of data items and functions for receiving or sending data to the connected mobile app. To begin with, you can place the following code into the rendering part of your code:

```JavaScript
<mobile.ConnectQR/>
```
It displays an encrypted QR Code for mobile apps to scan to connect to your application. It contains the content of ```mobile.connectionCode```, which holds an encrypted string value. When decrypted, it provides information on how to connect to your application, including a one-time-use encryption key for initiating an end-to-end encryption process between your application and a mobile app. 

When connected to your application, the mobile app displays a ```form``` specified in ```initData```. Also, when the user interacts with elements in the ```form```, your application can receive mobile events through ```mobile.field``` variable, with the ```mobile.field.id``` identifying the element that the user has interacted with, and with ```mobile.field.value``` holding the value that the user has entered. Actually, you can simply pass your callback function into the ```mobile.setOnchange()```  function to receive those mobile events instead of implementing the logic for monitoring the changes in the  ```mobile.field``` variable:
```JavaScript
mobile.setOnchange(({field})=>{
    const {id, value}=field;
	switch(id){
	  case usernameField.id: 
	     setUsername(value); 
	     break;
	  case passwordField.id: 
	     setPassword(value); 
	     break;
	  case loginButton.id: 
	     login(username,password);
	     break;
    }
});
```
In the above code, You can implement the ```setUsername()``` and ```setPassword()``` functions to store the user entries, and the ```login()``` function to call an authentication mechanism:
```JavaScript
import React, { useState } from 'react';
...
const [username, setUsername]=useState('');
const [password, setPassword]=useState('');
```

You can also send values from your application to the mobile app responding to local or remote events:

```JavaScript
Username: 
<input onChange={event=>{
	setUsername(event.target.value);
	mobile.sendValue(usernameField.id,event.target.value);
} value={username} type="text"/>

<input onChange={event=>{
	setPassword(event.target.value);
	mobile.sendValue(passwordField.id,event.target.value);
} value={username} type="password"/>

```
 You can use ```mobile.sendValue()``` to send values to the connected mobile app. It accepts two parameters: the first parameter is for providing the id of the target element in the form, and the second parameter is for providing value to be sent.

Using this approach, you can turn a simple password-based authentication into a one-click mobile authentication or you can implement any other password-less authentication or add an extra security layer without affecting the usability of your application.

 When ```mobile.sendInitData()``` function is called with a ```InitData``` parameter, the connected mobile app will switch to the user interface specified:

```JavaScript
const login=(username,password)=>{
		const initData={					
         };
         mobile.sendInitData(initData:{
			form: {
							title:  "Welcome " +username,
							fields: [{type:  "info", value:  "Test Completed",}]
            }
         }); 
}
```
Another way is to place another instance of  ```useGlobalInputApp```  in a component, and then switch to that component.


When  ```useGlobalInputApp``` is invoked for the first time, the module will start to initialize itself. In this phase, ```mobile.isLoading``` is set to true, and ```<mobile.ConnectQR/>``` displays a loading symbol. After the initialization is completed, if the application is ready to accept connection, ```mobile.isReady``` is set to true, and ```<mobile.ConnectQR/>``` displays an encrypted QR Code. When a mobile app has connected to your application, ```mobile.isConnected``` is set to true, and ```<mobile.ConnectQR/>``` displays nothing. Those variables are useful if you would like to control what to display during different phases:
```JavaScript
{mobile.isConnected && (<>
<h1>Mobile Connected</h1>
<div>Please operate on your mobile to provide your credential!</div>
</>)}
```


For an element in a ```form```, ```type``` attribute defines how to process/display the data contained in it. For example, if it is set to ```button```, the mobile app display a ```Button```:

```JavaScript
  const  loginButton={
    id:  'login',
    label:  'Sign In',
    type:  'button'
  };
```

The default value of the ```type``` attribute is "text". In this case, it display either a text input or a text area, depending on the value of ```nLines```, which represents how many number of lines is visible:  

```JavaScript
  const  contentField={
      id:  'content',
      label:  'Content',
      type:  "text",
      nLines:5,
      value:"This is a content in the text box"
  };
```
If the ```value``` attribute is set, it will be sent along with the form to pre-populate the the field when being displayed on the mobile screen.
  



## Mobile Encryption
If you set the value of ```type``` of element in a ```form``` to ```"encrypt"```, the connected mobile app encrypts the ```value``` of the element and send back the result to your application:

```JavaScript
const  contentToEncrypt="...";
const  encryptField={
    id:  'content',
    label:  'Content',
    type:  "encrypt",
    value:contentToEncrypt
};
```

In a similar way, setting ```type``` to ```"decrypt"``` will lead to decryption:

```JavaScript
const  contentToDecrypt="...";
const  decryptField={
    id:  'content',
    label:  'Content',
    type:  "decrypt",
    value:contentToDecrypt
};

```

## Customizing Form Elements & Styled Values.

The value attribute in an element can also be an object containing some styling information:

```JavaScript
const infoField={
    id:   "title",    
    type: "info",
    value: {
      type: "text",
      content: "This is a Text",
      style: {
        fontSize: 18,
        marginTop: 20,
      }
    }
}
```
You can display a multi-line text using an array for ```content```:

```JavaScript
const informationField={
        id: "informationText",
        type: "info",
        value:  {
            type: "view",
            style: {
                borderColor: "#rgba(72,128,237,0.5)",
                backgroundColor: "#rgba(72,128,237,0.5)",
                borderWidth: 1,
                marginTop: 5,
                minWidth: "100%",
                minHeight: 80,
            },
            content: [{
                type: "text",
                content: title,
                style: {
                    fontSize: 18,
                    color: "white"
                }
            }, {
                type: "text",
                content: message,
                style: {
                  fontSize: 14,
                  color: "white"
                }
            }]
         }     
  }

````




Finally, the examples in the [website](https://globalinput.co.uk/), and tests in the [test project](https://github.com/global-input/test-global-input-app-libs) contain more information about various use cases that you can implement in your Typescript/JavaScript applications. 

## On Mobile App Side
 Although you can use [Global Input App](https://globalinput.co.uk/) to operate on your applications, You can certainly use this module to enable your own mobile app to have the ability to operate on various device applications that are powered with this module, assuming your mobile app is  implemented using one of the JavaScript-based frameworks like [React Native](https://reactnative.dev/).

As discussed previously, in order to connect to a device application, your mobile app needs to obtain the value of ```connectionCode``` through scanning a QR Code. Then, you can pass it to the ```connect()``` function to connect to your device application as its second parameter:

```JavaScript
      const  mobileConnector=createMessageConnector();
      const {initData} = await  mobileConnector.connect({
          onInput:(inputMessage)=>{
          ....
          }
      },connectionCode);
```
In the above code, ```initData``` contains a ```form``` provided by the connected device application, while ```onInput()``` function is called whenever a message is received from the device application.

You can also send messages to the device application, responding to the events generated when the user interacts with form elements:

```JavaScript
 const sendUsername=(username) => {
	mobileConnector.sendValue(initData.form.fields[0].id,username);
 }    
```
There are two input parameters required for calling  ```mobileConnector.sendValue()``` function: the first one identifies the target element that the value is being sent to, while the second parameter holds the value needs to be sent across.








