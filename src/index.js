
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

    const attached = useRef(true);
    const notify = (st) => {
        if (attached.current) {
            dispatch(st);
        }
        else {
            console.log(` after-detach-${st.type} `);
        };
    };

    if (typeof config === 'function') {
        config = config();
    }
    let intDataConfigured = null;
    if (config) {
        intDataConfigured = config.initData;
        if (typeof intDataConfigured === 'function') {
            intDataConfigured = intDataConfigured();
        }
    }

    const initDataIdentity = globalInput.initDataIdentity(intDataConfigured);
    const initDataRef = useRef(null);
    initDataRef.current = intDataConfigured;
    const optionsRef = useRef(null);
    optionsRef.current = config && config.option;
    useEffect(() => {
        attached.current = true;
        if (!globalInput.isValidInitData(initDataRef.current)) {
            console.log(" init-data-use-empty ");
            return;
        }
        globalInput.startConnect(notify, initDataRef.current, optionsRef.current);
        return () => {
            attached.current = false;
        }
    }, [initDataIdentity]); //only execute once the identity is changed to allow the application to use simple construct to create parameter.

    const sendInitData = useCallback((initData) => {
        if (!attached.current) {
            return;
        }
        if (typeof initData === 'function') {
            initData = initData();
        }
        if (!globalInput.isValidInitData(initData)) {
            console.log(" init-data-set-empty ");
            return;
        }
        globalInput.sendInitData(initData, notify);
    }, []);


    const disconnect = useCallback(() => {
        globalInput.disconnect(notify);
    }, []);
    const sendValue = globalInput.sendValue;

    const onchange = useRef(null);
    const setOnchange = useCallback((listener) => onchange.current = listener, []);
    useEffect(() => {
        if (field && onchange.current && attached.current) {
            onchange.current({
                field,
                initData,
                sendInitData,
                sendValue
            });
        }
    }, [field, initData, sendInitData, sendValue]);

    const ConnectQR = useCallback(({ level = 'H', size, label = globalInput.qrCodeLabel, loading = globalInput.loading, maxSize = 400, marginTop = 90, marginLeft = 10 }) => {
        if (isLoading) {
            return loading;
        }
        if (!isReady) {
            return null;
        }
        if ((!connectionCode) || size === 0) {
            return null;
        }
        return globalInput.displayQRCode(connectionCode, level, size, label, maxSize, marginTop, marginLeft);
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
