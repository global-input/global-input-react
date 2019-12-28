

import {createDeviceApp,createGlobalInputApp,createNextInitData} from "./utils/utils";


/**
 * 
 *  The device app/|(Receiver app) display a QR Code, the sender app scans the qr code to object 
 *  the connection information.And then the sender app (Global Input App) uses the connection information 
 *  connects to the device app and then receives the form fields defined by the device app. And then the GIA 
 *  send a content to the device app. And then device sends an content to the GIA
 * 
 */
it("bidirectional communication between receiver/device app and the sender (GIA)", async function () {
      //jest.setTimeout(10000);
      const deviceApp =  createDeviceApp(); //create the device app, the the GIA (Global Input App) can connect to the it by scanning its QR Code.
          
      const  qrCodeProperties=await deviceApp.getDisplayedQRCodeProperties(); //device application displays QR code containing encrypted information about how to connect to the device application

      expect(qrCodeProperties.value.length).toBeGreaterThan(200); //The QR Code should contain some encrypted content

      const globalInputApp= await createGlobalInputApp(qrCodeProperties.value);  //creates GIA (Global Input App) instance
      
      //verifies the information obtained from the QR Code displayed by the device application
      expect(globalInputApp.mobileConfig.url).toEqual(expect.stringMatching(/http.+/)); //the URL of the WebSocket server that the device application is connected to.
      expect(globalInputApp.mobileConfig.apikey.length).toBeGreaterThan(10); //api key for connecting to the WebSocket server.
      expect(globalInputApp.mobileConfig.aes.length).toBeGreaterThan(10);    //the encryption key used for the connection.

      const connectionResult=await globalInputApp.connectToDeviceApp(); //connect to the device application

      // Verifies the information received from the device application as the response to the request to connect 
      expect(connectionResult.allow).toBeTruthy(); 
      expect(connectionResult.initData.action).toEqual(deviceApp.mobileConfig.initData.action);
      expect(connectionResult.initData.dataType).toEqual(deviceApp.mobileConfig.initData.dataType);
      expect(connectionResult.initData.form.id).toEqual(deviceApp.mobileConfig.initData.form.id);
      expect(connectionResult.initData.form.title).toEqual(deviceApp.mobileConfig.initData.form.title);
      expect(connectionResult.initData.form.label).toEqual(deviceApp.mobileConfig.initData.form.label);
      deviceApp.mobileConfig.initData.form.fields.forEach((field,index)=>{
        expect(connectionResult.initData.form.fields[index].label).toEqual(field.label);     
        expect(connectionResult.initData.form.fields[index].id).toEqual(field.id);
        expect(connectionResult.initData.form.fields[index].value).toEqual(field.value);     
        expect(connectionResult.initData.form.fields[index].nLines).toBe(field.nLines);     
      });


      //verifies that the GIA sends a message and the device application receives it.
      const sampleMessageByGlobalInputApp={
          content:"User filled this content on the Global Input App",
          index:0
      };          
      globalInputApp.sendMessageToDeviceApplication(sampleMessageByGlobalInputApp.content,sampleMessageByGlobalInputApp.index);
      let contentReceivedOnDeviceApp=await deviceApp.getContentReceivedFromGIA();      
      expect(contentReceivedOnDeviceApp).toBe(sampleMessageByGlobalInputApp.content);



      //Verifies that the device applciation sends a message and GIA receives it.
      const sampleMessageByDeviceApplication = {
            id: "content",
            content: "message by device app",
            index: 0
      };
      deviceApp.sendMessageToGIA(sampleMessageByDeviceApplication.content,sampleMessageByDeviceApplication.index);
      let messageReceivedFromDeviceApp=await globalInputApp.getMessageFromDeviceApp();
      expect(messageReceivedFromDeviceApp.data.value).toBe(sampleMessageByDeviceApplication.content);
      expect(messageReceivedFromDeviceApp.data.index).toBe(sampleMessageByDeviceApplication.index);
      
      console.log("=======lllll:"+JSON.stringify(messageReceivedFromDeviceApp));


      globalInputApp.resetMessageFromDeviceApp();      
      const {initData,waitForFirstName,waitForLastName}= createNextInitData();      
      deviceApp.changeInitData(initData);
      
      var messageReceivedFromDeviceApp2=await globalInputApp.getMessageFromDeviceApp();
      expect(messageReceivedFromDeviceApp2.initData.action).toBe(initData.action);
      expect(messageReceivedFromDeviceApp2.initData.dataType).toBe(initData.dataType);
      expect(messageReceivedFromDeviceApp2.initData.form.id).toBe(initData.form.id);
      expect(messageReceivedFromDeviceApp2.initData.form.title).toBe(initData.form.title);
      expect(messageReceivedFromDeviceApp2.initData.form.label).toBe(initData.form.label);

      messageReceivedFromDeviceApp2.initData.form.fields.forEach((field,index)=>{
        expect(initData.form.fields[index].label).toEqual(field.label);     
        expect(initData.form.fields[index].id).toEqual(field.id);
        expect(initData.form.fields[index].value).toEqual(field.value);     
        expect(initData.form.fields[index].nLines).toBe(field.nLines);     
      });


    //verifies that the GIA sends a message and the device application receives it.
    const sampleMessageByGlobalInputApp2={
      firstName:{content:"dilshat",index:0},
      lastName: {content:"hewzulla",index:1}
    };
    globalInputApp.sendMessageToDeviceApplication(sampleMessageByGlobalInputApp2.firstName.content,sampleMessageByGlobalInputApp2.firstName.index);
    let firstName=await waitForFirstName();      
    expect(firstName).toBe(sampleMessageByGlobalInputApp2.firstName.content);

    globalInputApp.sendMessageToDeviceApplication(sampleMessageByGlobalInputApp2.lastName.content,sampleMessageByGlobalInputApp2.lastName.index);
    console.log("------waiting lasgtname.....");

    let lastName=await waitForLastName();      
    console.log("------got lasgtname.....");
    expect(lastName).toBe(sampleMessageByGlobalInputApp2.lastName.content);


      
      
        
 
      
});





