This is an [Global Input App](https://globalinput.co.uk) extension (GIA React Extension) library to enable device and web applications, which are written in React JS, to have mobile input and control features. Some of the features you can get with the GIA extension:

 - [Mobile Authentication](https://globalinput.co.uk/global-input-app/mobile-authentication)
 - [Mobile Input & Control](https://globalinput.co.uk/global-input-app/mobile-input-control)
 - [Second Screen Experience](https://globalinput.co.uk/global-input-app/second-screen-experience)
 - [Mobile Personal Storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage)
 - [Mobile Encryption & Signing](https://globalinput.co.uk/global-input-app/mobile-content-encryption)
 - [Mobile Content Transfer](https://globalinput.co.uk/global-input-app/mobile-content-transfer)

Also, this is a React wrapper around [the GIA JS Extension](https://github.com/global-input/global-input-message) to make it easier for the React JS application to have mobile extension.

## Setup

```shell
npm i global-input-react
```

## Usage

The application needs to pass a configuration data to the GIA component, specifying the mobile interfaces and callbacks when the user interacts with the specified mobile interface elements. The GIA component is responsible for displaying an Encrypted QR Code, so that users can scan the QR Code and connect to your application to operate on it with mobile devices. The communication between devices is secured with end-to-end encryption.

Let's say that you would like to display a text field ```Content``` on the user's mobile screen after the user has connected to your application by scanning an encrypted QR code:

```JavaScript
import {GlobalInputConnect} from 'global-input-react';
import React, {useState,useRef} from 'react';
const SingleFieldFormDemo= ()=>{  
    const [content,setContent]=useState('');
    
    const globalInput=useRef(null); //used for sending message back to GIA

    const mobileConfig={
      initData:{
          action:"input",
          dataType:"form",
          form:{
            id:"test@globalinput.co.uk",
            title:"Global Input App Test",
            label:"Global Input Test",
            fields:[{
              label:"Content",
              id:"content",
              value:"",
              nLines:10,
              operations:{
                  onInput:setContent
              }
          }]
          }
    },
       url: "https://globalinput.co.uk"
    };
    
    return (
        <GlobalInputConnect mobileConfig={mobileConfig}          
        ref={globalInput}>
        <div>When you type on your mobile, the content will appear below</div>
              <textarea style={{width:500, height:500}} value={content} onChange={evt => {
                  setContent(evt.target.value);
                  globalInput.current.sendInputMessage(evt.target.value,0);
                  }}/>
        </GlobalInputConnect>
    );
}


```
You may experiment with the sample code on [JSFiddle](https://jsfiddle.net/dilshat/ubakg74e/)

You may find the source code of the [Content Transfer Application](https://globalinput.co.uk/global-input-app/content-transfer) is not much different from the above sample code.



### Sign In Example

Another example is to display a Sign In form on the connected mobile. The form comprises of a  ```Username``` text field, a ```Password``` text field, and a ```Sign In``` button:

```JavaScript
import {GlobalInputConnect} from 'global-input-react';
import React from 'react';
let onUsernameReceived = u=>{
	console.log(u);
};
let onPasswordReceived = p=>{
	 //password is p
};
let onSignIn=(username,password)=>{
  console.log("sign in pressed");
}
let mobileConfig={        
   initData:{                              
     form:{
       title:"Sign In",
       id:"###username###@mycompany.com",  
       fields:[{
         label:"Username",
         id:"username",            
         operations:{onInput:u=>onUsernameReceived(u)}
       },{
         label:"Password",
         id:"password",
         operations:{onInput:p=>onPasswordReceived(p)}
      },{
        label:"Sign In",
        type:"button",            
        operations:{onInput:()=>onSignIn()}
     }]
    }
  }
 };

export default props=>{
     const [username, setUsername]=React.useState("");  
     const [password, setPassword]=React.useState("");
     const [message, setMessage]= React.useState("");
     onUsernameReceived=setUsername;
     onPasswordReceived=setPassword;
     onSignIn=()=>{
        setMessage(`Sign in with ${username} ${password}`);
     };
     return (<div><GlobalInputConnect mobileConfig={mobileConfig}/>   
              {message}
     </div>);
   };
```
You can experiment with the sample code above on [JSFiddler](https://jsfiddle.net/dilshat/3crLw63v/)

One of the important features that the GIA provides is that users can take advantage of the [mobile personal storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage) to automate the sign in process. The value of the ```id``` of the form plays the role of the identifier for identifying the form data when the user chooses to store it to the [mobile personal storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage) on his/her mobile device. The place holder ```###username###``` distinguishes multiple user accounts from each other on the same application/domain. If one user can have only one account on the domain/application, no need to include the place holder in the id of the form.

The [GIA Mobile Authention](https://globalinput.co.uk/global-input-app/mobile-authentication) allows users to convert a password-based authentication to a password-less authentication by pushing the stored credentials from the [Mobile Personal Storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage) to the connected application. This brings convenience and security to users because the users can set up completely random passwords without the need for remembering them, and can sign in securely on shared devices in public view, without worrying about revealing passwords to prying eyes, video cameras and keyboard tracking devices.

## More Examples
* [Content Transfer Example](https://globalinput.co.uk/global-input-app/content-transfer)
* [Second Screen Application](https://globalinput.co.uk/global-input-app/video-player)
* [Game Control Application](https://globalinput.co.uk/global-input-app/game-example)
* [Mobile Form Automation](https://globalinput.co.uk/global-input-app/send-message)
* [Mobile Form Transfer](https://globalinput.co.uk/global-input-app/form-data-transfer)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/qr-printing)
