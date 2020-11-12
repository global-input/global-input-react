
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
        senders
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
    useEffect(() => {
        attached.current = true;
        return () => {
            attached.current = false;
        }
    }, []);

    if (typeof config === 'function') {
        config = config();
    }
    if (typeof config.initData === 'function') {
        config.initData = config.initData();
    }

    const configRef = useRef(config);
    configRef.current = config;
    const configId = config.initData && config.initData.id ? config.initData.id : '';
    useEffect(() => {
        globalInput.startConnect(configRef.current, configId, notify);
    }, [configId]); //You don't need to memoize the input parameter of this hook.

    const restart = useCallback((config) => {
        if (!attached.current) {
            console.log(" -restart-not-attached- ");
            return;
        }
        globalInput.disconnect(notify);
        globalInput.startConnect(config ? config : configRef.current, configId, notify);
    }, [configId])


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
    const PairingQR = useCallback(({ level = 'H', size, label = globalInput.qrCodeLabel, loading = globalInput.loading, maxSize = 400, marginTop = 90, marginLeft = 10 }) => {
        if (isLoading) {
            return loading;
        }
        if (!isReady) {
            return null;
        }
        const pairingCode = globalInput.getParingCode();
        if ((!pairingCode) || size === 0) {
            return null;
        }
        return globalInput.displayQRCode(pairingCode, level, size, label, maxSize, marginTop, marginLeft);
    }, [isReady, isLoading]);


    return {
        ConnectQR,
        PairingQR,
        connectionCode,
        field,
        errorMessage,
        isLoading,
        isReady,
        isError,
        isDisconnected,
        isConnected,
        initData,
        senders,
        sendValue,
        sendInitData,
        setOnchange,
        disconnect,
        restart,
    };
};
