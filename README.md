
A [Global Input App](https://globalinput.co.uk) React Component for implementing mobile integrations.

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

Let's say you have a content that is attached to [React Hook](https://reactjs.org/docs/hooks-intro.html), and you would like to
allow users to use mobile to set its content, you just need to place
the following into the render function of your component:

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
Above example is from the [Content Transfer Live Demo] (https://globalinput.co.uk/global-input-app/content-transfer), you can download the source code from its [GitHub repository](https://github.com/global-input/content-transfer-example).

Let's say you have another application that you would like to allow users to use mobiles to invoke its ```play()``` function. You can put the following into the render function of your component:


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

If you have a Sign In Component that uses password authentication, and you would like your users to use mobiles to sign in speedily. You just need to include the following in the render function of your component:

```JavaScript
 const [username, setUsername]=useState("");  
 const [password, setPassword]=useState("");  
 let mobileConfig={        
                          initData:{                              
                              form:{
                                	title:"Sign In",
                                  id:"###usernane###@mycompany.com",  
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
                                      onInput:()=>this.signIn(username,password);
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
In the above example, you just need to implement 'this.signIn()' function that accepts username and password that are push into your application from the [Global Input App](https://globalinput.co.uk/) user



### More Examples
* [Content Transfer Example](https://globalinput.co.uk/global-input-app/content-transfer)
* [Second Screen Application](https://globalinput.co.uk/global-input-app/video-player)
* [Game Control Application](https://globalinput.co.uk/global-input-app/game-example)
* [Mobile Form Automation](https://globalinput.co.uk/global-input-app/send-message)
* [Mobile Form Transfer](https://globalinput.co.uk/global-input-app/form-data-transfer)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/qr-printing)
