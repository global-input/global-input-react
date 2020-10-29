import React, { useReducer, useEffect, useRef, useMemo, useCallback } from "react";


import * as globalInput from './globalinput';

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
        initData,
    }, dispatch] = useReducer(globalInput.reducer, globalInput.initialState);    
    
    useEffect(() => {
        globalInput.startConnect(dispatch, configData);
    }, dependencies ? dependencies : []); //default connect once for the component

    useEffect(() => {
        if (field && globalInput.mobileData.onchange) {
            globalInput.mobileData.onchange({
                field,
                initData,
                sendInitData: globalInput.mobileData.sendInitData,
                sendValue: globalInput.sendValue
            });
        }
    }, [field]);

    const ConnectQR = useCallback(({ level, size, container, children }) => {
        globalInput.displayQRCode({ level, size, container, connectionCode, isReady, isLoading, children });
    }, [connectionCode, isReady, isLoading]);


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
        initData,
        sendValue: globalInput.sendValue,
        sendInitData: globalInput.mobileData.sendInitData,
        disconnect: globalInput.mobileData.disconnect,
        setOnchange: globalInput.setOnchange,
    };
};

