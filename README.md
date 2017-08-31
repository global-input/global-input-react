# global-input-react

The global-input-react library wraps the global-input-message JavaScript library into a React component to make it easier for making a Rect web application Global Input ready.  So that a Global Input mobile app user can just point the phone camera to the QR code displayed and connect to your app and carry out operation on your app. 

### Installation

To install the stable version:

npm install --save global-input-react

### Usage
Put the importing state in your javascript file to input the component that can display the QR code.

```javascript
import {CodeDataRenderer} from "global-input-react";
```

and then just place it where you would like to display the QR code:

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

You can see that the onlything you need to define is the globalInputConfig variable.

you can use this variable to define the form that you would like to display on the user's mobile screen, and the callback function that you would like to be invokved when the user interfact with the form.


For example, if you would lile the mobile app to display a Login form.


```javascript
var globalInputConfig={      
             initData:{               
               form:{
                 "title":"Sign In",
                 fields:[{
                           label:"Email address",
                           value:this.state.username,
                           operations:{
                               onInput:this.setUsername.bind(this)
                           }

                         },{
                            label:"Password",
                            type:"secret",
                            operations:{
                              onInput:this.setPassword.bind(this)
                            }

                         },{
                            label:"Login",
                            type:"button",
                            operations:{
                               onInput:this.login.bind(this)
                            }

                         }]
                     },
                     action:"input",
                     dataType:"login"
            }
  };

```
In the above JSON structure, operations.onInput specifies the callback function to be invokoke when the corresponding form element is operated by the user. 

In the above example, obviously you need to define the functionb "setUsername" and"setPassword" functions to receive username and password and call setState to pass the username and password to the state of your component to force it to re-render it.

That is all you need to do to make it your React JS application to support the Global Input mobile app. 




