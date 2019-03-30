
This a [Global Input App](https://globalinput.co.uk) extension library for React applications.

[Global Input App](https://globalinput.co.uk) with its extensions provides a universal mobile integration solution for web and device applications, allowing users to use mobiles to operate on those applications. It provides applications with mobile input, mobile control, and portable encrypted storage functionalities without the need to develop separate mobile apps. Applications can implement mobile integration logic within the local application context.

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

 * [Live Demo] (https://globalinput.co.uk/global-input-app/content-transfer)
 * [Github Repo](https://github.com/global-input/content-transfer-example)

### More Examples
* [Second Screen Application](https://globalinput.co.uk/global-input-app/video-player)
* [Game Control Application](https://globalinput.co.uk/global-input-app/game-example)
* [Mobile Form Automation](https://globalinput.co.uk/global-input-app/send-message)
* [Mobile Form Transfer](https://globalinput.co.uk/global-input-app/form-data-transfer)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/qr-printing)
*
