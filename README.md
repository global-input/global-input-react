
This React JS library allows you to introduce mobile app interoperability into your React applications that are running on smart devices like smart TVs, set-top boxes, game consoles, and devices in IoT. It allows you to define mobile interfaces and receive mobile events from connected mobiles, implementing device interoperability while keeping the mobile app as a universal mobile app that works for all kinds of device applications with different business logic. It also allows you to leverage a set of functionalities provided by the mobile app like [mobile encryption](https://globalinput.co.uk/global-input-app/mobile-content-encryption), [mobile authentication](https://globalinput.co.uk/global-input-app/mobile-authentication), [mobile input & control](https://globalinput.co.uk/global-input-app/mobile-input-control), [second screen experience](https://globalinput.co.uk/global-input-app/second-screen-experience), [mobile secure storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage), [mobile encryption & signing](https://globalinput.co.uk/global-input-app/mobile-content-encryption), [mobile content transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer). The communication between mobile app and the device application is secured using the end-to-end encryption that are established through scanning an Encrypted QR Code. This library is particularly useful in the new normal established by the current COVID-19 pandemic, where businesses require visiting customers to communicate accurately and collaborate with customer representatives right within the business software while enforcing rules of wearing masks and social distancing. This library allow you establish secure and instant communication and collaboration right within your business software, and each session, which starts by customer scanning an encrypted QR code, is secured using end-to-end encryption technology. Also, you do not have to collect users' personal data thanks to the ability to request data on-demand from the mobile apps at the point of service, freeing you from the pains of privacy regulations. You may also choose to allow your customers to encrypt their own data using their mobiles, giving users full control over their personal data.

## Setup

```shell
npm i global-input-react
```
## Usage
```JavaScript

import {useGlobalInputApp} from  'global-input-react';

```
The React hook ```useGlobalInputApp``` accepts a data object defining a mobile interface that the connected mobile app  presents to the user upon connection.

For example, if you would like to display a login screen on the connected user's mobile:
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
       id:  '###username###@mycompany.com',
       fields: [usernameField,passwordField,loginButton]
     }
}});
```
In the above code, ```initData``` is the name of the variable that is holding data describing mobile user interface. It specifies a ```form```, containing a set of fields: ```usernameField```,```passwordField```,```loginButton```.

The ```useGlobalInputApp``` hook returns a ```mobile``` object.  You can place the following JSX tag to display an encrypted QR Code that thet user can scan to connect to your application securely:

```JavaScript
<mobile.ConnectQR/>
```
When a mobile app has connected to your application, the QR code will disappear, and the connected mobile app will presents user with the form that you have defined above. When the user interacts with any of the fields in the form, the ```field``` containing  ```id``` and  ```value```   will be sent over to your application to notify that which field user has interacted with and which value that the user has entered. You can pass your callback function into ```mobile.setOnchange()```   to receive those mobile events:
```JavaScript
mobile.setOnchange(({field})=>{
	switch(field.id){
	case usernameField.id: 
	     setUsername(field.value); 
	     break;
	case passwordField.id: 
	     setPassword(field.value); 
	     break;
	case loginButton.id: 
	     login(username,password);
	     break;
    }
});
```
In the above code, ```setUsername``` and ```setPassword``` refer those returned by the [State Hook](https://reactjs.org/docs/hooks-state.html):
```JavaScript
import React, { useState } from 'react';
...
const [username, setUsername]=useState('');
const [password, setPassword]=useState('');

```
And the ```login()``` function is for calling the actual authentication logic. This way of you can turn a simple password-based authentication into a one-click mobile authentication.[mobile authentication](https://globalinput.co.uk/global-input-app/mobile-authentication).

If you prefer to use your own mobile app as the universal mobile app instead of the [Global Input App](https://globalinput.co.uk), you can have a look the integration tests included in the  [the test project](https://github.com/global-input/test-global-input-app-libs/blob/master/src/test-global-input-react/mobile-and-device-app.test.tsx) to see how you can include the necessary component in your mobile app.