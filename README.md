
##global-input-react

This is a [Global Input App](https://globalinput.co.uk) React Component for React applications to implement mobile integrations.

The [Global Input App](https://globalinput.co.uk) with its extensions provides a universal mobile integration solution for web and device applications, allowing users to use mobiles to operate on those applications. It provides applications with mobile input, mobile control, and portable encrypted storage functionalities without the need to develop separate mobile apps. Applications can implement mobile integration logic within its application context.

Some of its use cases:
* [Mobile Authentication](https://globalinput.co.uk/global-input-app/about-mobile-authentication)
* [Mobile Input & Control](https://globalinput.co.uk/global-input-app/about-mobile-control)
* [Second Screen Experience](https://globalinput.co.uk/global-input-app/about-second-screen)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/about-print-scan-qrcodes)

### Setup

Install the global-input-react JavaScript library:

```shell
npm i global-input-react
```

### Usage
```JavaScript
import {GlobalInputConnect} from 'global-input-react';
```

Let's say that you would like to display a text field, labelled with ```Content```, on the user's mobile screen after the user has connected to your application by scanning the encrypted QR code. And you would like to receive the typed content when the user is typing on his/her mobile. You can achieve your requirement by including the following code that uses [React Hook](https://reactjs.org/docs/hooks-intro.html) in the render function of your component:

```JavaScript
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
return(
<GlobalInputConnect mobileConfig={mobileConfig}
                        </GlobalInputConnect>
);
```



Above example is from the [Content Transfer Example](https://globalinput.co.uk/global-input-app/content-transfer), you can download the source code from its [GitHub repository](https://github.com/global-input/content-transfer-example).

The 'GlobalInputConnect' component is responsible for displaying an encrypted QR code that contains a one-time-use encryption key among other communication channel parameters. When a user scans the QR Code with his/her [Global Input App](https://globalinput.co.uk/), it initiates an end-to-end encrypted communication across devices and use the configuration you have specified to construct the mobile user interface and your application is able to receives mobile events via callbacks.

### Another Example

Let's say that you would like to display a button, labelled with ```Play```, on the user's mobile screen after the user has connected to your application by scanning the encrypted QR code. And you would like to invoke ```play()``` function when the user has press the button on his/her mobile. You can include the following code in the render function of your component:


```JavaScript
 let mobileConfig={        
                          initData:{                              
                              form:{
                                	title:"Play",   
                                fields:[{
                                  label:"Play",
                                  type:'button'           
                                  operations:{
                                      onInput:()=>play();
                                  }
                                }]
                              }
                          },
             };
return(
<GlobalInputConnect mobileConfig={mobileConfig}
                        </GlobalInputConnect>
);
```

### Sign In Example
Let's say that you would like to display a ```Username``` and a ```Password``` fields, and a ```Sign In``` button, on
the user's mobile screen after the user has connected to your application by scanning the encrypted QR code. And you would like to receive user inputs when the user are filling their credentials. And you would like to invoke ```signIn()``` function when the user has pressed the ```Sign In``` button on
his/her button. You can include the following code in the render function of your component to achieve that:


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

### More Examples
* [Content Transfer Example](https://globalinput.co.uk/global-input-app/content-transfer)
* [Second Screen Application](https://globalinput.co.uk/global-input-app/video-player)
* [Game Control Application](https://globalinput.co.uk/global-input-app/game-example)
* [Mobile Form Automation](https://globalinput.co.uk/global-input-app/send-message)
* [Mobile Form Transfer](https://globalinput.co.uk/global-input-app/form-data-transfer)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/qr-printing)
