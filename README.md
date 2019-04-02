
## global-input-react

This is a [Global Input App](https://globalinput.co.uk) React Component for React applications to implement mobile integrations.

The [Global Input App](https://globalinput.co.uk) with its extensions provides a universal mobile integration solution for web and device applications, allowing users to use mobiles to operate on those applications. It provides applications with mobile input, mobile control, and portable encrypted storage functionalities without the need to develop separate mobile apps. Applications can implement mobile integration logic within its application context.

Some of its use cases are:
* [Mobile Authentication](https://globalinput.co.uk/global-input-app/about-mobile-authentication)
* [Mobile Input & Control](https://globalinput.co.uk/global-input-app/about-mobile-control)
* [Second Screen Experience](https://globalinput.co.uk/global-input-app/about-second-screen)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/about-print-scan-qrcodes)

## Setup

The following command installs the ```npm``` module:

```shell
npm i global-input-react
```

## Usage

Let's say that you would like to display a text field, labelled as ```Content```, on the user's mobile screen after the user has connected to your application by scanning an encrypted QR code. And you would like to receive the content when the user is typing on his/her mobile:

```JavaScript
import {GlobalInputConnect} from 'global-input-react';
import React, { useState } from 'react';


const [content, setContent]=useState("");  
 let mobileConfig={        
                          initData:{                              
                              form:{
                                	title:"Content Transfer",   
                                fields:[{
                                  label:"Content",            
                                  operations:{
                                      onInput:value=>setContent(value);
                                  }
                                }]
                              }
                          },
             };
return(<GlobalInputConnect mobileConfig={mobileConfig}/>);
```

Above code is from the [Content Transfer Example Demo](https://globalinput.co.uk/global-input-app/content-transfer).

On scanning the Encrypted QR Code using the [Global Input App](https://globalinput.co.uk/), a form titles as "Content Transfer" will be displayed on the mobile screen. The form contains a single field labelled as "Content". If you type on the content field on your mobile, the application will receive the content in real-time. The GlobalInputConnect component is responsible for displaying an encrypted QR code that contains a one-time-use encryption key among other communication channel parameters.

The 'GlobalInputConnect' component is responsible for displaying an encrypted QR code that contains a one-time-use encryption key among other communication channel parameters.


If you would like to display a button, labelled as ```Play```, on the user's mobile screen, and you would like to invoke ```play()``` function when the user has pressed the button on his/her mobile. you just need to add the following to the ```fields```
array of the above example:


```JavaScript
  {
        label:"Play",
        type:'button'           
        operations:{onInput:()=>play();}
  }
```

### Sign In Example
Let's say that you would like to display a ```Username``` and a ```Password``` fields, and a ```Sign In``` button, on
the user's mobile screen after the user has connected to your application by scanning an encrypted QR code.
You can achieve the requirement by including the following in the render function of your component:


```JavaScript
 const [username, setUsername]=useState("");  
 const [password, setPassword]=useState("");  
 let mobileConfig={        
                          initData:{                              
                              form:{
                                	title:"Sign In",
                                  id:"###username###@mycompany.com",  
                                fields:[{
                                  label:"Username",            
                                  operations:{
                                      onInput:username=>setUsername(username);
                                  }
                                },{
                                  label:"Password",            
                                  operations:{
                                      onInput:password=>setPassword(password);
                                  }
                                },{
                                  label:"Sign In",
                                  type:"button",            
                                  operations:{
                                      onInput:()=>signIn(username,password);
                                  }
                                }]
                              }
                          },
             };
return(<GlobalInputConnect mobileConfig={mobileConfig}/>);
```
In the above example, you need to replace ```signIn()``` with whatever function that you have implemented to accept username and password to validate user credential.

The value of the ```id``` of the form in the above example identifies the form data when the user stores/loads it from/to the encrypted storage on his/her mobile device. using place holder ```###username###``` allows to store multiple accounts on the same domain.

This means that users can sign in to your application by pushing stored credentials from the mobile devices to your application. This speeds up the sign process allowing users to set up complicated passwords without the need to remember them. Also it increases security when security when signing in to your application using shared devices in public view.

## More Examples
* [Content Transfer Example](https://globalinput.co.uk/global-input-app/content-transfer)
* [Second Screen Application](https://globalinput.co.uk/global-input-app/video-player)
* [Game Control Application](https://globalinput.co.uk/global-input-app/game-example)
* [Mobile Form Automation](https://globalinput.co.uk/global-input-app/send-message)
* [Mobile Form Transfer](https://globalinput.co.uk/global-input-app/form-data-transfer)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/qr-printing)
