import * as globalInput from './globalinput';
import { useReducer, useRef, useEffect, useCallback } from "react";

const withoutSession = config => (config && config.session ? { ...config, session: undefined } : config);
export const useGlobalInputApp = (config, canConnect = true, configId = "") => {
    const [{
        connectionCode,
        pairingCode,
        errorMessage,
        field,
        isLoading,
        isReady,
        isError,
        isClosed,
        isConnected,
        isDisconnected,
        isConnectionDenied,
        initData,
        senders,
        sender,
        registeredInfo
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
    const sessionUsed = useRef(false);
    configRef.current = config;
    useEffect(() => {
        if (typeof configRef.current === 'function') {
            configRef.current = configRef.current();
        }
        if (typeof configRef.current.initData === 'function') {
            configRef.current.initData = configRef.current.initData();
        }
        if (canConnect || globalInput.keepConnection()) {
            // config.session (resume a saved session) is used by the first connect only: a later
            // connect with a changed configId keeps the current session, restart() starts a new one.
            const resume = !sessionUsed.current;
            sessionUsed.current = true;
            globalInput.startConnect(resume ? configRef.current : withoutSession(configRef.current), notify);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canConnect, configId]); //You don't need to memoize the input parameter of this hook.

    const restart = useCallback((config) => {
        if (!attached.current) {
            console.log(" -restart-not-attached- ");
            return;
        }
        if (config && typeof config.initData === 'function') {
            config.initData = config.initData();
        }
        if (!config) {
            if (typeof configRef.current === 'function') {
                configRef.current = configRef.current();
            }
            if (typeof configRef.current.initData === 'function') {
                configRef.current.initData = configRef.current.initData();
            }
        }
        sessionUsed.current = true;
        globalInput.closeConnection(notify);
        globalInput.startConnect(withoutSession(config ? config : configRef.current), notify);
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


    const close = useCallback(() => {
        globalInput.closeConnection(notify);
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



    return {
        connectionCode,
        pairingCode,
        field,
        errorMessage,
        isLoading,
        isReady,
        isError,
        isClosed,
        isConnected,
        isDisconnected,
        isConnectionDenied,
        initData,
        senders,
        sender,
        sendValue,
        sendInitData,
        setOnchange,
        close,
        restart,
        registeredInfo,
        getSessionData: globalInput.getSessionData,
        setClientAppLaunched: globalInput.setClientAppLaunched,
    };
};
