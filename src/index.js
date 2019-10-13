import React, { useState, useEffect } from 'react';
import { createMessageConnector, encrypt, decrypt } from "global-input-message";
import DisplayQRCode from './DisplayQRCode';


const GIASTATUS = {
    CONNECTING: 0,
    CONNECTED: 1,
    SENDER_CONNECTED: 2,
    SENDER_DISCONNECTED: 3
};

function createGlobalInput() {
    var connector = null;
    const disconnect = () => {
        if (connector) {
            connector.disconnect();
        }
        connector = null;
    };
    const connect = ({ mobileConfig, onConnected, onSenderConnected, onSenderDisconnected }) => {
        disconnect();
        if (!mobileConfig) {
            console.log("mobile config is not set");
            return;
        }



        const connector = createMessageConnector();

        const config = { ...mobileConfig };
        config.onRegistered = next => {
            next();
            var code = connector.buildInputCodeData();
            onConnected(code);
        }
        config.onSenderConnected = (sender, senders) => {
            if (mobileConfig.onSenderConnected) {
                mobileConfig.onSenderConnected(sender, senders);
            }
            onSenderConnected(sender, senders);
        }
        config.onSenderDisconnected = (sender, senders) => {
            if (mobileConfig.onSenderDisconnected) {
                mobileConfig.onSenderDisconnected(sender, senders);
            }
            onSenderDisconnected(sender, senders);
        }
        connector.connect(config);
    };
    const checkMobileConfig = mobileConfig => {
        if (!mobileConfig) {
            return "mobileConfig is required";
        }
        if (!mobileConfig.initData) {
            return "initData is missing in the parameter mobileConfig";
        }
        if (!mobileConfig.initData.form) {
            return "form is missing in the initData of the mobileConfig";
        }
        return null;
    };
    const getCode = () => {
        if (connector) {
            return connector.buildInputCodeData();
        }
    };
    return { connect, disconnect, checkMobileConfig, getCode };

}
const globalInput = createGlobalInput();

const GlobalInputConnect = function ({ mobileConfig, connectingMessage, connectedMessage, qrCodeSize, renderSenderConnected, senderConnectedMessage, renderSenderDisconnected, senderDisconnectedMessage, children }) {
    var error = globalInput.checkMobileConfig(mobileConfig);
    const [giaStatus, setGIAStatus] = useState(GIASTATUS.CONNECTING);
    const [senders, setSenders] = useState([]);
    const [sender, setSender] = useState(null);
    const [code, setCode] = useState("");
    const onConnected = code => {
        setGIAStatus(GIASTATUS.CONNECTED);
        setCode(code);
    };

    const onSenderConnected = (sender, senders) => {
        setSender(sender);
        setSenders([...senders]);
        setGIAStatus(GIASTATUS.SENDER_CONNECTED);
    };
    const onSenderDisconnected = (sender, senders) => {
        setSender(sender);
        if (senders) {
            setSenders([...senders]);
        }
        else {
            setSenders([]);
        }


        setGIAStatus(GIASTATUS.SENDER_DISCONNECTED);

    };
    useEffect(() => {
        if (!error) {
            globalInput.connect({ mobileConfig, onConnected, onSenderConnected, onSenderDisconnected });
        }
        return globalInput.disconnect;
    }, [mobileConfig]);

    if (error) {
        return (<DisplayQRCode code={error} label={error} size={qrCodeSize} />);
    }
    switch (giaStatus) {
        case GIASTATUS.CONNECTED:
            console.log("[[" + code + "]]");
            return (<DisplayQRCode code={code} label={connectedMessage} size={qrCodeSize} />);
        case GIASTATUS.CONNECTING:
            return connectingMessage ? (<div>{connectingMessage}</div>) : null;
        case GIASTATUS.SENDER_CONNECTED:
            if (renderSenderConnected) {
                return renderSenderConnected(sender, senders);
            }
            else if (senderConnectedMessage) {
                return <div>{senderConnectedMessage}</div>
            }
            else if (children) {
                return children;
            }
            else {
                return (<span/>);
            }
        case GIASTATUS.SENDER_DISCONNECTED:
            if (renderSenderDisconnected) {
                return renderSenderDisconnected(sender, senders)
            }
            else if (senderDisconnectedMessage) {
                return (<div>{senderDisconnectedMessage}</div>);
            }
            else if (children) {
                return children;
            }
            else {
                return <span/>;
            }
        default:
            return (<div>Unknown State</div>);
    }
};

export { encrypt, decrypt, GlobalInputConnect, DisplayQRCode }
