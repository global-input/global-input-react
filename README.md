# global-input-react


The global-input-react library enables your React JS application to display a Global Input QR Code so that your users can connect their Global Input mobile app (available in [iOS](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4) and [Android](https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4)) to your application just by poing the phone camera to the QR code displayed. Your users can operate securely on your application via their mobile. For example you can allow your users to sign in via their mobile and much more! Please visit [global-input-message library](https://github.com/global-input/global-input-message) for the javascript application that is not RectJS. More information is available on our [main website](https://globalinput.co.uk/)

### Installation

 ```npm install --save global-input-react```

### Usage

Import the ```CodeDataRender``` component:

```javascript
import {CodeDataRenderer} from "global-input-react";
```

Note that you can use 'require' if you are not using ES6 transpiler.

After that you need to reference it where you would like to display the QR Code in your renderer function:

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

In the above example code, ```CodeDataRenderer``` component is an Global Input Component responsible displaying a Global Input QR Code, which will be scanned by the Global Input App.

```service={this}``` sets the reference to the current containing component, so that the Global Input component can be notified of the life-cycle events generated within the containing element.

```config={globalInputConfig}``` passes the Global Input configuration to the component, this will be explained in detail in the next section.

```level="H"``` defines that the error correction level of the QR Code is ```High```. the complete list of values that the atribute can take:

>```H```: Correction level is ```High```, can take up to 30% damage

>```Q```: Correction level is ```Quality, can take up to 25% damage

>```M```: Correction level is ```Medium```, can take up to 15% datamage

>```L```: Correction level is ```Low```, can take up to 7% datamage


```size="300"``` sets the pixel size of the QR Code to 300.

```showControl={true}``` specifies that QR code displayed can be adjused by the user. If you set to false, only the QR code will be displayed, the control that the user can use to adjust the QR code will not be displayed.

### Configuration

In the above example, the ```globalInputConfig```  variable is passed in to the component. The variable defines the form that you would like to display on the mobile phone screen. It also contains the callback function that you would like to be invoked when the user interact with the form.

It might be better explained with an example, imagine you have the following requirement:

You would like the mobile app to display

* a ```Sign In``` form.
* the form contains ```Email Address``` and  a ```Password``` input fields and a ```Login``` button.
* When a user enters something in the ```Email Address``` field on the mobile screen, you would like your javascript function  ```setUsername(username)``` to be invoked.
* When a user enters something in the ```Password``` field on the mobile screen, you would like your function called ```setPassword(password)``` invoked with the text entered.
* When a user clicks on the ```Login``` button on the mobile screen, you would like your function ```login()``` invoked, so that you can do the login operation within your ```login()``` function

For the above requirement, you can define the following ```globalInputConfig``` variable:

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
                     }                     
               }               

 };
```

Following is line-by-line explanation about the the configuration given above:

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
defines the form that is to be displayed on the mobile screen. Obviously, ```Sign In``` will be displayed on the mobile screen as the title of the form.


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
                 onInput:setUsername
             }

}
```
Instructs the mobile app to display a ```text``` field on the mobile screen with the label ```Email Address```. Because the ```type``` is not given, and the default value of the ```type``` is ```text```, so the mobile displays the text field.  
The ```operations``` contains  all the callback functions. The value of the ```onInput``` is ```setUsername```, so the ```setUsername(username)``` will be invoked for each user typing in the ```Email Address``` field.

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
Instructs the mobile app to display a ```password``` field on the mobile screen with the label ```Password```. The ```type``` defines the type of form field, it can be ```button```, ```secret```, ```range```, ```text```, ```list``` etc. In this case, its value is ```secret```, so it displays a password field.

The ```operations``` contains all the callback functions. The value of the ```onInput``` is ```setPassword```, so when the user is entering text on the password field on the mobile screen, ```setPassword(password)``` will be invoked for each typing in the ```Password``` field.

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


Instructs the mobile app to display a ```Login``` button on the mobile screen. The ```type``` defines the types of form field, it can be ```button```, ```secret```, ```range```, ```text```, ```list``` etc.  In this case, its value is ```button```, so it displays the ```Login``` button.

The ```operations``` contains all the callback functions. The value of the ```onInput``` is ```login```, so when user has pressed on the button on the mobile screen, the ```login()``` will be invoked.

In your implementation of ```setUsername()``` and ```setPassword()``` functions, you can store the username and password into the component state. In the implementation of ```login()``` function(), you can retrieve the value of ```username``` and ```password``` from the component state, and passed them to your cmponent that implements the login function.

The folllowing is link to the actual working example code that you can playaround online:

  > [Example in JS Fiddler](https://jsfiddle.net/dilshat/26jh68wv/)

or you can have a look at the Sign In example at

>[https://globalinput.co.uk/](https://globalinput.co.uk/)


Before the QR code is displayed, an encryption key will be generated within your app, and the encryption will be part of the QR code to be transfered to the mobile app along with the other communication information. With the secure end-to-end encrypted communication between your application and the mobile app, nothing between your application and mobile app can possibly intercept the communication.



### Pairing configuration

It is possible to restrict the access to only those mobiles that are previously paired with your service applications. You can achieve this by adding ```securityGroup``` attribute in your ```globaInputConfig``` described previously:

```javascript

var globaInputConfig = {
        securityGroup:"bmPAZcfsu0CDBg2V4",                
        initData:{                
               form:{
                      ....                      
                     }                     
               }     
 };
```
The value of the ```securityGroup``` can be any randomly generated string. If you have not specified the  ```securityGroup```, it will take the default value, which is ```k7jc3QcMPKEXGW5UC```. When a new user has installed the Global Input App into his mobile, the value of the ```securityGroup``` in his/her app will be  ```k7jc3QcMPKEXGW5UC```. So the user does not have to carry out the paring process if you use this defaul t ```securityGroup```value.
If you have used any ```securityGroup```value different from the default one, then the the Global Input App users will receive the "Permission Denied" message when trying to connect to your service application unless the mobile app is paired previously.
For example you can try with [this example](https://jsfiddle.net/dilshat/gxvL901u/)











The default value of the ```securityGroup``` attribute distributed in the Javascript library is ```1CNbWCFpsbmRQuKdd```, if you specify different value than that, The Global Input App users has to pair with your service application to before being able to connect to your service application, you can choose 
