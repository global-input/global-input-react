
This React library allows you to introduce a mobile interoperability into your React applications on smart devices like smart TVs, set-top boxes, game consoles, and devices in IoT, so that users can use their mobiles to operate on them. It allows you to define mobile interfaces and receive mobile events from within your device applications, while keeping the mobile app as a general and universal mobile app that works across all types of device applications with different business logic: meaning that there is no need to switch to different mobile app for operating on different devices and no need to develop different mobile apps for different business or device applications. It also allows you to enrich your device applications with a set of mobile functionalities like [mobile encryption](https://globalinput.co.uk/global-input-app/mobile-content-encryption), [mobile authentication](https://globalinput.co.uk/global-input-app/mobile-authentication), [mobile input & control](https://globalinput.co.uk/global-input-app/mobile-input-control), [second screen experience](https://globalinput.co.uk/global-input-app/second-screen-experience), [mobile secure storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage), [mobile encryption & signing](https://globalinput.co.uk/global-input-app/mobile-content-encryption), and [mobile content transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer). The communication between a mobile app and a device application is often established through scanning an Encrypted QR Code that contains a set of communication parameters that includes one-time-use encryption key for starting an end-to-end encryption process.


This library is particularly useful in the new normal established by the current COVID-19 pandemic, where businesses require visiting customers to communicate accurately with customer representatives while enforcing the rules of wearing masks and social distancing. Thanks to this library, you will be able to establish an instant and secure communication right within your business software, allowing your customers to collaborate effectively, securely and safely. For example, you may provide one-click subscriptions through user mobiles by leveraging the [mobile secure storage](https://globalinput.co.uk/global-input-app/mobile-authentication).   Alternative, you do not even have to collect users' personal data thanks to the ability to request data on-demand from the mobile app at the point of service, freeing yourself from the pains of privacy regulations. You may also choose to allow your customers to encrypt their own data using their mobiles, giving users full control over the security and privacy of their personal data. 

## Setup

```shell
npm i global-input-react
```
## Usage
```JavaScript

import {useGlobalInputApp} from  'global-input-react';

```
The React hook ```useGlobalInputApp``` accepts a data object that defines a mobile interface for the connected mobile app  to present to the user upon connection.

For example, if you would like to display a login screen on the connected user's mobile screen:
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
In the above code, the ```initData``` parameter holds data describing the mobile user interface. It specifies a ```form``` with a set of fields that are  ```usernameField```,```passwordField```, and ```loginButton```.

The ```mobile``` object returned by the  ```useGlobalInputApp``` hook contains a React component called  ```ConnectQR```, which allows you to display an encrypted QR Code for an user to scan to connect to your application.

```JavaScript
<mobile.ConnectQR/>
```
When a mobile app has connected to your application, the QR code will disappear, and the connected mobile app will presents user with the form that you have defined in the ```initData``` parameter above. When the user interacts with any of the fields in the form on the mobile screen, your application will receive a ```mobile.field``` object with enclosing  ```id``` and  ```value```  attributes. The  ```id``` attribute tells you which form field that the user has interacted with, and the ```value``` attribute tells you the current value of the field after the user has interacted with it. Instead of implement logic to monitor the changes in the ```mobile.field```  object, you can simply pass your callback function into the ```mobile.setOnchange()```  function to receive those mobile events:
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
In the above code, ```setUsername``` and ```setPassword``` are coming from the [State Hook](https://reactjs.org/docs/hooks-state.html) used for maintaining state in a functional component:
```JavaScript
import React, { useState } from 'react';
...
const [username, setUsername]=useState('');
const [password, setPassword]=useState('');

```
The  ```login()``` function is where you can implement actual authentication logic. Using this approach, you can turn a simple password-based authentication into a one-click mobile authentication [mobile authentication](https://globalinput.co.uk/global-input-app/mobile-authentication).

When the user enters content in your application directly instead of operating on the connected mobile app, you may like to send the updated value to the mobile app to keep the remote and local values in sync. You can do so by calling the ```mobile.sendValue()``` function:
```JavaScript
Username: 
<input type="text" value={username} onChange={event=>{
	setUsername(event.target.value);
	mobile.sendValue(usernameField.id,event.target.value);
}/>
```
The code snippet  ```setUsername(event.target.value)``` is for updating the local state, while ```mobile.sendValue(usernameField.id,event.target.value)``` is for updating the remote form element identified with  ```usernameField.id``` on the mobile app with the value  ```event.target.value```. 
Similarly, we can do the same for the password field:
```JavaScript
Password: 
<input type="password" value={username} onChange={event=>{
	setPassword(event.target.value);
	mobile.sendValue(passwordField.id,event.target.value);
}/>
```

With the above code in place, the content can be updated on both devices while keeping the local and remote values in sync.

In order to switch to a different mobile user interface responding to some events, you can can pass an user interface data to the ```mobile.sendInitData()``` function:
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
Alternatively, you can replace the current React component with a new React component that in turn replace the current  ```useGlobalInputApp```  with a new one. 

## Advanced Concept 
Calling  ```useGlobalInputApp``` hook may start an initialisation process if the library is not initialized yet. During the initialization phase,  the  ```<mobile.ConnectQR/>``` component displays a loading symbol, and the  ```mobile.isLoading``` variable is set to true until this phase is completed.  After that, if no mobile has yet connected to the application, it enters the "Ready" phase, meaning that it is ready to accept connection. In this phase, the  ```mobile.isReady``` variable is set to true, and  ```<mobile.ConnectQR/>``` displays an encrypted QR Code. The encrypted QR code is simply an QR code generated from an encrypted content in the  ```mobile.connectionCode``` variable. It provides a set of parameters for establishing communication with your application, including an encryption key for initiating an end-to-end encryption process. In order to increase the security further, a brand new encryption key is generated for each session. When a mobile app is connected to your application, the component ```<mobile.ConnectQR/>```  returns null, and the  ```mobile.isConnected``` variable is set to true.  By levegaring these variables, you can control what to display in different phases:
```JavaScript
{mobile.isConnected && (<>
<h1>Mobile Connected</h1>
<div>Please operate on your mobile to provide your crendetial!</div>
</>)}
```
If you would like to disconnect and disable the ability to allow mobile apps to connect to your application responding to some events, you can call ```mobile.disconnect()```. This brings the library into the "disconnected" phase, and set the ```mobile.isDisconnected``` variable to true.  If there is a connection error, it enters the "error" phase, and set the ```mobile.isError``` variable to true, while the ```mobile.errorMessage``` variable contains the error message.

The (Typescript Declaration file)[https://github.com/global-input/global-input-react/blob/master/index.d.ts] contains more information on the structure of the data used and functions that are exposed by the library.

Note that you can use your own mobile app as the universal mobile app instead of using the [Global Input App](https://globalinput.co.uk), you can find the information how to do that from the code inside the integration tests included in the  [test project](https://github.com/global-input/test-global-input-app-libs/blob/master/src/test-global-input-react/mobile-and-device-app.test.tsx).


## More about Form Element

When you go through the previous example, you might have noticed that the ```type``` attribute of a form element defines what component the mobile app uses to process the data contained in it. For example, if it is set to ```button```, the mobile app uses the ```Button``` UI component to process the data:
```JavaScript
const  loginButton={
	id:  'login',
	label:  'Sign In',
	type:  'button'
};
```
As a result, it displays a button on the mobile screen. 

If the ```type``` attribute is missing, it takes its default value, which is "text". In this case, it display either a text field or text box (textarea) depending the values of another attribute, called  ```nLines```, which takes ```1``` as its the default value. The ```nLines``` specifies the number of lines visible in the text field/box.  

For example, when you would like to display a content with a text box with fix visible text rows:

```JavaScript
const  contentField={
    id:  'content',
    label:  'Content',
    type: "text",
    nLines:5    
};
```
You can also send the actual value with the form element to pre-populate the text box:

```JavaScript
const  contentField={
    id:  'content',
    label:  'Content',
    type: "text",
    nLines:5,
    value:"This is a content in the text box"    
};
```

## Mobile Encryption
To instruct the mobile app to encrypt the content and send the result back to your application, simply set the ```type``` attribute of the corresponding element to "encrypt".
```JavaScript
	const  contentField={
	    id:  'content',
	    label:  'Content',
	    type: "encrypt",
	    value:"Content that requires encryption"    
	};
	const  mobile=useGlobalInputApp({initData:{
    id:"encrypting content",
    form:{
       title:  'Encrypt Content',
       fields: [contentField]
     }
}});
```
This prompts the user to encrypt the content specified in the value attribute, and the result will be sent back to your application. You can receive the  content through your callback function:

```JavaScript
mobile.setOnchange(({field})=>{
	switch(field.id){
	case contentField.id: 
	     setEncryptedContent(field.value); 
	     break;
    }
});
```
In the similar way, you can send an encrypted content to the mobile app for decryption by setting the type of an element to ```decrypt```. The following React component will ask the mobile user to decrypt the content passed in and passes the decrypted content to the ```onDecrypted()``` function:

```JavaScript
import {useGlobalInputApp} from  'global-input-react';
export default ({contentToDecrypt,onDecrypted}) =>{
	const  contentField={
	    id:  'content',
	    label:  'Content',
	    type: "descrypt",
	    value:encryptedContent
	};
	const  mobile=useGlobalInputApp({initData:{
			form:{
				title:"Mobile Decryption",
				fields:[contentField,
				{
					type:"info",
					value:"This content will be displayed when the decryption has completed and the connected application has received the result"
				}]
     }});
     setOnFieldChanged(({field})=>{
	     switch(field.id){
	         case contentField.id:
			         onDecrypted(field.value);
	     }
     });
     return (<div>Please operate on your mobile</div>);
  };
	
```




