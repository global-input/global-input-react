import React, { useReducer, useEffect, useRef, useMemo, useCallback } from "react";


import {reducer,
        initialState,startConnect,
        getFlags,invokeOnChange,getExposed,displayQRCode} from './globalinput';




export default (configData, dependencies) => {
    const [{
        connectionCode,
        errorMessage,    
        field        
    }, dispatch] = useReducer(reducer, initialState);
    const {isLoading,isReady,isError,isDisconnected,isConnected}=getFlags();
    useEffect(() => {
        startConnect(dispatch, configData);
    }, dependencies ? dependencies : []); //default connect once for the component

    useEffect(()=>invokeOnChange(field),[field]);
    
    const ConnectQR=useCallback(({level,size,container,children})=>displayQRCode({level,size,container,connectionCode,isReady,isLoading,children}),[connectionCode,isReady,isLoading]);
    
    const {initData,sendValue,sendInitData,setOnchange,disconnect}=getExposed();


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
        sendValue,
        sendInitData,
        setOnchange,
        disconnect
        
    };
};

