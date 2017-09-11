# global-input-react


The global-input-react library enables your React JS application to display a Global Input QR Code so that your users can connect their Global Input mobile app (available in [iOS](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4) and [Android](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4)) to your application just by poing the phone camera to the QR code displayed. Your users can operate securely on your application via their phone. For example you can allows your users sign in via their phone and much more!

### Installation

 ```npm install --save global-input-react```

### Usage

Import the ```CodeDataRender``` component:

```javascript
import {CodeDataRenderer} from "global-input-react";
```

And then reference it where you would like to display the QR Code in your renderer function:

```javascript

render() {

          return (
              ....
                  <CodeDataRenderer service={this}  config={globalInputConfig} level="H" size="300" showControl={true}/>
              ....
          );
        }
      }

```

In the above code the ```globalInputConfig```  variabled passed in to the component. The variable defines the form that you would like to display on the mobile phone screen. You should also specify the callback function to to be invoked when user interact with the form.

This can be explained very easily with an example:

Suppose you would like to display a ```Sign In``` form on the mobile screen. You would like the form to have two fields: ```Email Address``` and ```Password``` and a ```Login``` button.

When a user enters something in the ```Email Address``` field on the mobile screen, you would like your function  ```setUsername(username)``` invoked.

In the same way, when a user enters something in the ```Password``` field on the mobile screen, you would like your function called ```setPassword(password)``` invoked with the text entered.

When a user clicks on the ```Login``` button on the mobile screen, you would like your function ```login()``` invoked, so that you can do the login operation.

so you need to define the following to achive this:

```javascript

globaInputConfig = {
        initData:{                
               form:{
                      title:"Sign In",
                      fields:[{
                                   label:"Email address",
                                   operations:{
                                       onInput:this.setUsername
                                   }

                             },{
                                 label:"Password",
                                 type:"secret",
                                 operations:{
                                     onInput:this.setPassword
                                 }

                             },{
                                 label:"Login",
                                 type:"button",
                                 operations:{
                                 onInput:this.login
                                }
                             }]
                     }
               },
               action:"input",
               dataType:"login"
   };



```
You can see the callback function is provided for each field as the value of ```onInput```, which is in ```operations```
that is all you need to do. When you run your application, you will see that your applicaiton display a QR code, and you can use Global Input app on your mobile to operate on your application like a magic. Try it out and if you like it let us know so we will be more inspired to make it better.

The communication between your application and the Global Input app is absolutely secure. An encruyption key will be generated for each session and will be part of the QR code to be transferred to the mobile app to establish a secure end-to-end encryption. Nothing between your application and the Global Input App will know what users is typing.
