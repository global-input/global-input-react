import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { createMessageConnector, encrypt, decrypt } from "global-input-message";
import DisplayQRCode from './DisplayQRCode';
import globalInputController from "./globalInputController";

import useGlobalInputApp, {MobileState} from './useGlobalInputApp';


const _GlobalInputConnect =  ({ mobileConfig, connectingMessage, connectedMessage, qrCodeSize, renderSenderConnected, senderConnectedMessage, renderSenderDisconnected, senderDisconnectedMessage, multiSenders, reconnectOnDisconnect,children}, ref) => {        
    const [giaStatus, setGIAStatus] = useState(globalInputController.STATUS.CONNECTING);
    const [error, setError] = useState(null);
    const [senders, setSenders] = useState([]);
    const [sender, setSender] = useState(null);
    const [code, setCode] = useState("");
    useImperativeHandle(ref, () => ({...globalInputController}));
    const onConnected = (code, giaStatus) => {
        setGIAStatus(giaStatus);
        setCode(code);
    };
    const updateSenders= (sender, senders, giaSTATUS)=>{        
        setSender(sender);
        setSenders([...senders]);
        setGIAStatus(giaSTATUS);
        if(giaSTATUS === globalInputController.STATUS.SENDER_DISCONNECTED){
            if(!multiSenders){                
                if(reconnectOnDisconnect){
                    setGIAStatus(globalInputController.STATUS.CONNECTING);
                    globalInputController.reconnect();  
                }
                else{
                    globalInputController.disconnect();
                }
            }            
        }
    }            
    const onError= error=>{
        setError(error);
    }
    useEffect(() => {        
        globalInputController.connect({ mobileConfig, onConnected, updateSenders, onError});          
        return ()=>globalInputController.disconnect();
    }, []);
    console.log("-----error:"+error+"::giaStatus:"+giaStatus+":renderSenderConnected:"+renderSenderConnected+":children:"+children);
    if (error) {
        return (<DisplayQRCode code={error} label={error} size={qrCodeSize} />);
    }

    switch (giaStatus) {        
        case globalInputController.STATUS.CONNECTING:
            return connectingMessage ? (<div>{connectingMessage}</div>) : null;
        case globalInputController.STATUS.CONNECTED:
                console.log("[[" + code + "]]");
                return (<DisplayQRCode code={code} label={connectedMessage} size={qrCodeSize} />);    
        case globalInputController.STATUS.SENDER_CONNECTED:
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
        case globalInputController.STATUS.SENDER_DISCONNECTED:
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
                return (<span/>);
            }
        default:
            return (<div>Unknown State</div>);
    }
};
const GlobalInputConnect=forwardRef(_GlobalInputConnect);


export { encrypt, decrypt, GlobalInputConnect, DisplayQRCode,useGlobalInputApp,MobileState};

