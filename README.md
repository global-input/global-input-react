# global-input-react

global-input-react is a ReactJS library that wraps the global-input-message JavaScript library into a React component, so that you can easily power your Rect web application with the Global Input software, so that the Global Input user can securely connect to your services to carry out operation via mobile.

###Installation

To install the stable version:

npm install --save global-input-react

You can find working example that you can try with the Global Input mobile app.

     https://globalinput.co.uk

###Usage
Do the import on the top of your javascript file:
```javascript
import {CodeDataRenderer} from "global-input-react";
```

And then write a function to return the metadata describing the form that you would like the Global Input mobile app to display it on the mobile screen  and the callback function when the mobile user interact with the form on the mobile.

For example, if you would lile the mobile app to display a Login form.



```javascript
  buildGlobalInputConfig(){
        return {
              initData:{
                action:"input",
                dataType:"login",
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
                      }
             }
          };

      }

```
Note that operations.onInput specifies the callback function when the corresponding form element is operated by the user. In the above example, obviously you need to define the functionb "setUsername" and"setPassword" functions to receive username and password as user entering the username and password.

And then place the CodeDataRenderer component in your render method:


```javascript

render() {

          return (
              ....
                  <CodeDataRenderer service={this}  config={this.buildGlobalInputConfig()} level="H" size="300" showControl={true}/>
              ....
          );
        }
      }

```

that is it. In place of the component, a QR code will be displayed, which user can scan with the Global Input App to connect to your service securely. The encruption key is generated within your service app and transferred to the mobile app via the QR code displayed to effectively implement the end-to-end encryption for each session.





