import * as globalInput from './globalinput';
import { useReducer, useRef, useEffect, useCallback } from "react";
export * from 'global-input-message';
export const useGlobalInputApp = (config, canConnect = true, configId = "") => {
    const [{
        connectionCode,
        errorMessage,
        field,
        isLoading,
        isReady,
        isError,
        isDisconnected,
        isConnected,
        isConnectionDenied,
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
    const configRef = useRef(null);
    configRef.current = config;
    useEffect(() => {
        if (typeof configRef.current === 'function') {
            configRef.current = configRef.current();
        }
        if (typeof configRef.current.initData === 'function') {
            configRef.current.initData = configRef.current.initData();
        }
        if (canConnect || globalInput.keepConnection()) {
            globalInput.startConnect(configRef.current, notify);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canConnect, configId]); //You don't need to memoize the input parameter of this hook.

    const restart = useCallback((config) => {
        if (!attached.current) {
            console.log(" -restart-not-attached- ");
            return;
        }
        globalInput.disconnect(notify);
        globalInput.startConnect(config ? config : configRef.current, notify);
    }, [])


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

    const ConnectQR = useCallback(({ level = 'H', size, label = globalInput.qrCodeLabel, loading = globalInput.loading, maxSize = 400, vspace = 130, hspace = 50 }) => {
        if (isLoading) {
            return loading;
        }
        if (!isReady) {
            return null;
        }
        if ((!connectionCode) || size === 0) {
            return null;
        }
        return globalInput.displayQRCode(connectionCode, level, size, label, maxSize, vspace, hspace);
    }, [connectionCode, isReady, isLoading]);
    const PairingQR = useCallback(({ level = 'H', size, label = globalInput.qrCodeLabel, loading = globalInput.loading, maxSize = 400, vspace = 130, hspace = 50 }) => {
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
        return globalInput.displayQRCode(pairingCode, level, size, label, maxSize, vspace, hspace);
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
        isConnectionDenied,
        initData,
        senders,
        sendValue,
        sendInitData,
        setOnchange,
        disconnect,
        restart,
    };
};

const getGlobalInputState = globalInput.getStateData;
export { getGlobalInputState };
