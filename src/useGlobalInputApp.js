import React, { useReducer, useEffect, useRef, useMemo, useCallback } from "react";


import { MobileState,reducer,
        initialState,startConnect,
        displayQRCode,mobileData} from './globalinput';


export { MobileState };

export default (configData, dependencies) => {
    const [{
        connectionCode,
        errorMessage,    
        field,
        isLoading,
        isReady,
        isError,
        isDisconnected,
        isConnected,
    }, dispatch] = useReducer(reducer, initialState);
    
    useEffect(() => {
        startConnect(dispatch, configData);
    }, dependencies ? dependencies : []); //default connect once for the component

    useEffect(()=>{
        if(field && mobileData.onchange){                         
                mobileData.onchange({
                field,
                initData:mobileData.initData,
                sendInitData:mobileData.sendInitData,
                sendValue:mobileData.sendValue});                         
        }
    },[field]);

    const ConnectQR=useCallback(({level,size,container,children})=>displayQRCode({connectionCode,isReady,isLoading,children}),[connectionCode,isReady,isLoading]);


    return {
        ConnectQR,
        connectionCode,
        field,        
        errorMessage,
        isLoading,
        isReady,
        isError,
        isDisconnected,
        isConnected,
        initData:mobileData.mobileConfig.initData,
        sendValue:mobileData.sendValue,
        sendInitData:mobileData.sendInitData,
        setOnchange:mobileData.setOnchange,
        disconnect:mobileData.disconnect
        
    };
};

