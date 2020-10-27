import { useGlobalInputApp, createMessageConnector, createInputReceivers } from '../index';
import { renderHook } from '@testing-library/react-hooks'


/**
 * compare initData to expectedInitData
 * @param {*} initData 
 * @param {*} expectedInitData 
 */
expect.extend({
    toBeSameInitData(received, expected) {
        if (received.action !== expected.action) {
            return {
                pass: false,
                message: () => `action = "${expected.action}" is expected but received "${received.action}" instead`
            };
        }
        if (received.dataType !== expected.dataType) {
            return {
                pass: false,
                message: () => `dataType = "${expected.dataType}" is expected but received "${received.dataType}" instead`
            };
        }
        if (received.form.id !== expected.form.id) {
            return {
                pass: false,
                message: () => `form.id = "${expected.form.id}" is expected but received "${received.form.id}" instead`
            };
        }
        if (received.form.title !== expected.form.title) {
            return {
                pass: false,
                message: () => `form.title = "${expected.form.title}" is expected but received "${received.form.title}" instead`
            };
        }
        if (received.form.label !== expected.form.label) {
            return {
                pass: false,
                message: () => `form.label = "${expected.form.label}" is expected but received "${received.form.label}" instead`
            };
        }
        for (const [index, field] of expected.form.fields.entries()) {
            if (field.label !== received.form.fields[index].label) {
                return {
                    pass: false,
                    message: () => `form.fields[${index}].label = "${field.label}" is expected but received "${received.form.fields[index].label}" instead`
                };
            }
            if (field.id !== received.form.fields[index].id) {
                return {
                    pass: false,
                    message: () => `form.fields[${index}].id = "${field.id}" is expected but received "${received.form.fields[index].id}" instead`
                };
            }
            if (field.value !== received.form.fields[index].value) {
                return {
                    pass: false,
                    message: () => `form.fields[${index}].value = "${field.value}" is expected but received "${received.form.fields[index].value}" instead`
                };
            }
            if (field.nLines !== received.form.fields[index].nLines) {
                return {
                    pass: false,
                    message: () => `form.fields[${index}].nLines = "${field.nLines}" is expected but received "${received.form.fields[index].nLines}" instead`
                };
            }
        }

        return {
            pass: true,
            message: () => `received initData contains the same data as in the expected initData`
        };
    }
});

it("Device App and Mobile App should be able to communicate", async function () {



    const deviceConfig = {
        initData: {
            action: "input",
            dataType: "form",
            form: {
                id: "test@globalinput.co.uk",
                title: "Global Input App Test",
                label: "Global Input Test",
                fields: [{
                    label: "Content",
                    id: "content",
                    value: "",
                    nLines: 10,
                }]
            }
        }
    };
    const deviceApp = {
        receiver: createInputReceivers(deviceConfig),//message receivers on the device side      
        ui: deviceConfig.initData
    }
    const { result, waitForNextUpdate, unmount } = renderHook(() => useGlobalInputApp(deviceConfig));
    await waitForNextUpdate();
    expect(result.current.isReady).toBe(true);

    //const {findByTestId}=render(<div>{connectionMessage}</div>);  //display QR Code here
    // const {code, level,size}=await getQRCodeValues({findByTestId}); //qrcode.react module is mocked
    const connectionCode = result.current.connectionCode;

    /** Here the device app displays a QR Code that contains the value of connectionCode, which is 
    *  an encrypted string containing information on how to connect to your device app
    **/
    const mobileApp = {
        con: createMessageConnector(), //creates a connector
        receiver: createInputReceivers(), //create promise objects inside callbacks to make testing more intuitive.
    };
    const { initData: initDataReceivedByMobile } = await mobileApp.con.connect(mobileApp.receiver.config, connectionCode) //mobile app connects to the device using the connectionCode that is obtained from the QR Code
    mobileApp.ui = initDataReceivedByMobile;  //mobile app display user interface from the initData obtained
    expect(mobileApp.ui).toBeSameInitData(deviceApp.ui);

    mobileApp.message = "content1"
    mobileApp.con.sendValue(mobileApp.ui.form.fields[0].id, mobileApp.message); //mobile sends a message
    deviceApp.message = await deviceApp.receiver.inputs[0].get();    //device receives the message
    expect(deviceApp.message).toEqual(mobileApp.message); //should match what was sent


    deviceApp.message = "content2";
    result.current.sendValue(deviceApp.ui.form.fields[0].id, deviceApp.message);
    mobileApp.message = await mobileApp.receiver.input.get();
    expect(mobileApp.message.data.value).toEqual(deviceApp.message);
    expect(mobileApp.message.data.fieldId).toEqual(deviceApp.ui.form.fields[0].id);


    const deviceConfig2 = {
        initData: {
            action: "input",
            dataType: "form",
            form: {
                id: "test2@globalinput.co.uk",
                title: "Global Input App Test 2",
                label: "Global Input Test 2",
                fields: [
                    {
                        label: "First Name",
                        id: "firstName",
                        value: "",
                        nLines: 10
                    }, {
                        label: "Last Name",
                        id: "lastName",
                        value: "",
                        nLines: 10
                    },
                ]
            }
        }
    };
    deviceApp.receiver = createInputReceivers(deviceConfig2);
    deviceApp.ui = deviceConfig2.initData;

    result.current.sendInitData(deviceApp.ui);
    mobileApp.message = await mobileApp.receiver.input.get();
    mobileApp.ui = mobileApp.message.initData;
    expect(mobileApp.ui).toBeSameInitData(deviceApp.ui);

    mobileApp.message = "firstName1";
    mobileApp.con.sendValue(mobileApp.ui.form.fields[0].id, mobileApp.message); //mobile sends information to the device
    deviceApp.message = await deviceApp.receiver.inputs[0].get();
    expect(deviceApp.message).toEqual(mobileApp.message);

    mobileApp.message = "lastName1";
    mobileApp.con.sendValue(mobileApp.ui.form.fields[1].id, mobileApp.message); //mobile sends information to the device
    deviceApp.message = await deviceApp.receiver.inputs[1].get();
    expect(deviceApp.message).toEqual(mobileApp.message);

    mobileApp.con.disconnect();
    result.current.disconnect();
    unmount();
});






