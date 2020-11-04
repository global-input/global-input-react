
import * as globalInput from './globalinput';
import { useReducer, useRef, useEffect, useCallback } from "react";
export * from "global-input-message";
export const useGlobalInputApp = (config) => {
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
    const configRef = useRef(config); //ignore even if the config changes
    const attached = useRef(true);
    const onchange = useRef(null);

    const notify = (st) => {
        if (attached.current) {
            dispatch(st);
        }
        else {
            console.log(`${st.type} after detach`);
        };
    }
    useEffect(() => {
        globalInput.startConnect(notify, configRef.current);
        return () => {
            attached.current = false;
        }
    }, []);

    const sendInitData = useCallback((initData) => {
        attached.current && globalInput.sendInitData(initData, notify);
    }, []);


    const disconnect = useCallback(() => {
        globalInput.disconnect(notify);
    }, []);
    const sendValue = globalInput.sendValue;


    const setOnchange = (listener) => onchange.current = listener;
    useEffect(() => {
        if (field && onchange.current) {
            onchange.current({
                field,
                initData,
                sendInitData,
                sendValue
            });
        }
    }, [field, initData, sendInitData, sendValue]);

    const ConnectQR = useCallback(({ level, size, container, children }) => {
        return globalInput.displayQRCode({ level, size, container, connectionCode, isReady, isLoading, children });
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
        sendValue,
        sendInitData,
        disconnect,
        setOnchange,
    };
};
