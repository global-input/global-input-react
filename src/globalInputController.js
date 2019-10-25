import { createMessageConnector, encrypt, decrypt } from "global-input-message";
const STATUS = {
    CONNECTING: 0,
    CONNECTED: 1,
    SENDER_CONNECTED: 2,
    SENDER_DISCONNECTED: 3
};

let connector = null;

const getCode = () => {
    if (connector) {
        return connector.buildInputCodeData();
    }
    else {
        return null;
    }
};
const disconnect = () => {
    if (connector) {
        connector.disconnect();
    }
    connector = null;
};
let connectionParameters = null;
const reconnect = () => {
    connect(connectionParameters);
};
const connect = ({ mobileConfig, onConnected, updateSenders, onError }) => {
    connectionParameters = { mobileConfig, onConnected, updateSenders, onError };
    if (!mobileConfig) {
        onError("mobileConfig is required");
        return;
    }
    if (!mobileConfig.initData) {
        onError("initData is missing in the parameter mobileConfig");
        return;
    }
    if (!mobileConfig.initData.form) {
        onError("form is missing in the initData of the mobileConfig");
        return;
    }
    disconnect();
    connector = createMessageConnector();
    const config = { ...mobileConfig };
    config.onRegistered = next => {
        next();
        var code = connector.buildInputCodeData();
        onConnected(code, STATUS.CONNECTED);
    }
    config.onSenderConnected = (sender, senders) => {
        if (mobileConfig.onSenderConnected) {
            mobileConfig.onSenderConnected(sender, senders);
        }
        updateSenders(sender, senders, STATUS.SENDER_CONNECTED);
    }
    config.onSenderDisconnected = (sender, senders) => {
        if (mobileConfig.onSenderDisconnected) {
            mobileConfig.onSenderDisconnected(sender, senders);
        }
        senders = senders ? senders : [];
        updateSenders(sender, senders, STATUS.SENDER_DISCONNECTED);
    }
    connector.connect(config);
};

const sendInputMessage = (message, fieldIndex, fieldId) => {
    if (connector) {
        connector.sendInputMessage(message, fieldIndex, fieldId);
    }
};

const changeInitData =initData=>connector ? connector.sendInitData(initData):console.log("sendInitData is invoked while in disconnected state.")
export default { STATUS, reconnect, disconnect, connect, sendInputMessage,changeInitData};


