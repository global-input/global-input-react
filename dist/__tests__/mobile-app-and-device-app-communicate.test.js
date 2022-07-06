"use strict";

var _index = require("../index");

var _reactHooks = require("@testing-library/react-hooks");

var testUtil = _interopRequireWildcard(require("../testUtil"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * compare initData to expectedInitData
 * @param {*} initData
 * @param {*} expectedInitData
 */
expect.extend({
  toBeSameInitData: testUtil.toBeSameInitData
});
it("Device App and Mobile App should be able to communicate", async function () {
  const deviceConfig = {
    initData: {
      form: {
        id: "test@globalinput.co.uk",
        title: "Global Input App Test",
        label: "Global Input Test",
        fields: [{
          label: "Content",
          id: "content",
          value: "",
          nLines: 10
        }]
      }
    }
  };
  const deviceApp = {
    receiver: testUtil.createInputReceivers(deviceConfig),
    //message receivers on the device side
    ui: deviceConfig.initData,
    hook: (0, _reactHooks.renderHook)(() => (0, _index.useGlobalInputApp)(deviceConfig)) //calls the hook

  };
  await deviceApp.hook.waitForNextUpdate();
  expect(deviceApp.hook.result.current.isReady).toBe(true); //deviceApp is ready to accept connection from a mobile app.
  //const {findByTestId}=render(<div>{connectionMessage}</div>);  //display QR Code here
  // const {code, level,size}=await getQRCodeValues({findByTestId}); //qrcode.react module is mocked

  /** Here the device app displays a QR Code that contains the value of connectionCode, which is
  *  an encrypted string containing information on how to connect to your device app
  **/

  const connectionCode = deviceApp.hook.result.current.connectionCode;
  const mobileApp = {
    con: (0, _index.createMessageConnector)(),
    //creates a connector
    receiver: testUtil.createInputReceivers() //create promise objects inside callbacks to make testing more intuitive.

  };
  const {
    initData: initDataReceivedByMobile
  } = await mobileApp.con.connect(mobileApp.receiver.config, connectionCode); //mobile app connects to the device using the connectionCode that is obtained from the QR Code

  mobileApp.ui = initDataReceivedByMobile; //mobile app display user interface from the initData obtained

  expect(mobileApp.ui).toBeSameInitData(deviceApp.ui); //initData received should match what was sent

  mobileApp.message = "content1";
  mobileApp.con.sendValue(mobileApp.ui.form.fields[0].id, mobileApp.message); //mobile sends a message

  deviceApp.message = await deviceApp.receiver.inputs[0].get(); //device receives the message

  expect(deviceApp.message).toEqual(mobileApp.message); //should match what was sent

  deviceApp.message = "content2";
  deviceApp.hook.result.current.sendValue(deviceApp.ui.form.fields[0].id, deviceApp.message); //device app sends a message

  mobileApp.message = await mobileApp.receiver.input.get(); //mobile app receives the message

  expect(mobileApp.message.data.value).toEqual(deviceApp.message); //received message should match what was sent

  expect(mobileApp.message.data.fieldId).toEqual(deviceApp.ui.form.fields[0].id); //id received should match the if of the targeted field.

  const deviceConfig2 = {
    initData: {
      action: "input",
      dataType: "form",
      form: {
        id: "test2@globalinput.co.uk",
        title: "Global Input App Test 2",
        label: "Global Input Test 2",
        fields: [{
          label: "First Name",
          id: "firstName",
          value: "",
          nLines: 10
        }, {
          label: "Last Name",
          id: "lastName",
          value: "",
          nLines: 10
        }]
      }
    }
  };
  deviceApp.receiver = testUtil.createInputReceivers(deviceConfig2); //create promise objects inside callbacks to make testing more intuitive.

  deviceApp.ui = deviceConfig2.initData;
  deviceApp.hook.result.current.sendInitData(deviceApp.ui); //device app sends a new mobile user interface

  mobileApp.message = await mobileApp.receiver.input.get(); //mobile app receives the message

  mobileApp.ui = mobileApp.message.initData; //mobile displays a user interface from the initData received.

  expect(mobileApp.ui).toBeSameInitData(deviceApp.ui); //initData received should match what was sent

  mobileApp.message = "firstName1";
  mobileApp.con.sendValue(mobileApp.ui.form.fields[0].id, mobileApp.message); //mobile sends information to the device

  deviceApp.message = await deviceApp.receiver.inputs[0].get();
  expect(deviceApp.message).toEqual(mobileApp.message);
  mobileApp.message = "lastName1";
  mobileApp.con.sendValue(mobileApp.ui.form.fields[1].id, mobileApp.message); //mobile sends information to the device

  deviceApp.message = await deviceApp.receiver.inputs[1].get();
  expect(deviceApp.message).toEqual(mobileApp.message);
  mobileApp.con.disconnect();
  deviceApp.hook.result.current.close();
  deviceApp.hook.unmount();
}, 10000);