# global-input-react


The global-input-react library enables your React JS application to display a Global Input QR Code so that your users can connect their Global Input mobile app (available in [iOS](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4) and [Android](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4)) to your application just by poing the phone camera to the QR code displayed. Your users can operate securely on your application via their phone. For example you can allow your users to sign in via their mobile and much more!

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

In the above code the ```globalInputConfig```  variable is passed in to the component. The variable defines the form that you would like to display on the mobile phone screen. It also contains the callback function that you would like to be invoked when the user interact with the form.

This can be explained very easily with the following requirements:

* Suppose you would like to display a ```Sign In``` form on the mobile screen.
* You would like the form to contain ```Email Address``` input field,  a ```Password``` input field and a ```Login``` button.
* When a user enters something in the ```Email Address``` field on the mobile screen, you would like your function  ```setUsername(username)``` invoked.
* When a user enters something in the ```Password``` field on the mobile screen, you would like your function called ```setPassword(password)``` invoked with the text entered.
* When a user clicks on the ```Login``` button on the mobile screen, you would like your function ```login()``` invoked, so that you can do the login operation within your ```login()``` function

The following ```globalInputConfig``` variable defines the above requirement requirements clearly as you can see.

```javascript

var globaInputConfig = {
        initData:{                
               form:{
                      title:"Sign In",
                      fields:[{
                                   label:"Email address",
                                   operations:{
                                       onInput:setUsername
                                   }

                             },{
                                 label:"Password",
                                 type:"secret",
                                 operations:{
                                     onInput:setPassword
                                 }

                             },{
                                 label:"Login",
                                 type:"button",
                                 operations:{
                                 onInput:login
                                }
                             }]
                     },
                     action:"input",
		                 dataType:"login"
               }               

 };
```

You may find the above self-explanatory, but still I would like to explain line by line to make it absoltey clear:

(1)
```
var globaInputConfig = {
        initData:{                
```
defines the ```globaInputConfig``` variable, it has the ```initData``` object, which contain all the data for initialising the Global Input Mobile app on the other end.

(2)

```
form:{
       title:"Sign In",
```
defines the form that is to be displayed on the mobile screen. Obviously, ```Sign In``` will be displayed on the mobile screen as the title.


(3)
```
fields:[{
```
defines an array containing the form elements.

(4)
```
{
             label:"Email address",
             operations:{
                 onInput:this.setUsername
             }

}
```
Instructs the mobile app to display a ```text``` field on the mobile screen with the label ```Email Address```. Because the ```type``` is not defined, and the default value of the ```type``` is ```text```, the mobile display the text field.  
The ```operations``` contains  contains all the callback functions. The ```onInput``` callback function will be invoked when user is entering text on the field. In this case, ```setUsername(username)``` will be invoked for each user typing in the ```Email Address``` field. The function ```setUsername(username)``` will passed in with the current value in the ```Email Address``` field.


(5)

```
{
     label:"Password",
     type:"secret",
     operations:{
           onInput:setPassword
     }
 }
```                             
Instructs the mobile app to display a ```secret``` field on the mobile screen with the label ```Password```. The ```type``` defines the types of form field, it can be ```button```, ```secret```, ```range```, ```text```, ```list``` etc. If it is not defined, it take the default value ```text```.

The ```operations``` contains  contains all the callback functions.

The ```onInput``` callback function will be invoked when user is entering text on the field. In this case, ```setPassword(password)``` will be invoked for each user typing in the ```Email Address``` field. The function ```setUsername(username)``` will passed in with the current value in the ```Email Address``` field.

(6)
```
{
      label:"Login",
      type:"button",
      operations:{
             onInput:login
      }
 }
```                             

```                             
Instructs the mobile app to display a ```Login``` button on the mobile screen`. The ```type``` defines the types of form field, it can be ```button```, ```secret```, ```range```, ```text```, ```list``` etc.

The ```operations``` contains  contains all the callback functions.

The ```onInput``` callback function will be invoked when user has clicked on the button. In this case, ```login()``` will be invoked.

(7)
```
 action:"input",
```
This make the QR code displayed instruct the Global Input App to display input form.


(8)

```
 dataType:"login",
```
tells the Global Input App it is the login operation, this helps the auo-filling operation within the Global Input app. The variable ```dataType``` can take any value, when it take specific values, the Global Input may add some extra functionalities to make it more interesting.


As you can see see it is so simple to to make your applicaiton display a QR code, that can be instruct the Global Input mobile app to display any form you like and calls back your funnction on your choice.

The communication between your application and the Global Input app is absolutely secure. An encryption key will be generated for each session and will be part of the QR code to be transferred to the mobile app to establish a secure end-to-end encryption. Nothing between your application and the Global Input App will know what users is typing. Furthermore, you can control the authentication and authorisation from within your app when the mobile app tries to connect to your phone.


Please try it out this free js library and the free mobile app, and you will see you can use Global Input app on your mobile to operate on your application like a magic. Try it out and if you like it let us know so we will be more inspired to make it better.

You can find the applications in action in

         https://globalinput.co.uk/

If your application is not React JS application, you can use the core ```global-input-message``` javascript library. You can found the Javascript library from the following URL:

         https://github.com/global-input/global-input-message
