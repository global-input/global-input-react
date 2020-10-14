import React, { useReducer, useEffect, useRef, useMemo, useCallback } from "react";


import { MobileState } from './constants';
import reducer, { initialState } from './reducer';
import * as globalInput from './globalinput';
export { MobileState };

export default (configData, dependencies) => {
    const [{
        mobileState,
        connectionCode,
        field,
        errorMessage
    }, dispatch] = useReducer(reducer, initialState);
    
    const mobile = useRef(globalInput.initialData);

    const setOnFieldChanged = useCallback((onFieldChanged) => {
        globalInput.setOnFieldChanged(mobile, onFieldChanged);
    },[]);
    const disconnect = useCallback(() => {
        globalInput.closeConnection(mobile);
    },[]);

    const setFieldValueById = useCallback((fieldId, valueToSet) => {
        globalInput.setFieldValueById(mobile, mobileState, fieldId, valueToSet);
    }, [mobile, mobileState]);

    const setInitData = useCallback((initData) => {
        globalInput.sendInitData(mobile, dispatch, initData);
    }, [mobile, dispatch]);
    
    useEffect(() => {
        globalInput.startConnect(mobile, dispatch, configData);
    }, dependencies ? dependencies : []); //default connect once for the component

    useEffect(() => {
        globalInput.onFieldChanged(mobile, field, setFieldValueById, setInitData); //should only executed when the field is changed
    }, [field]);


    const ConnectQR = ({ children, size, level }) => globalInput.displayQRCode({ mobileState, connectionCode, children, size, level });


    return {
        ConnectQR,
        connectionCode,
        field,
        mobile: { 
            isLoading: mobileState === MobileState.INITIALIZING,
            isReady: mobileState === MobileState.WAITING_FOR_MOBILE,
            isError: mobileState === MobileState.ERROR,
            isDisconnected: mobileState === MobileState.DISCONNECTED,
            isConnected: mobileState === MobileState.MOBILE_CONNECTED,
            initDataID: globalInput.getInitDataID(mobile),
            error:errorMessage,
            sendInitData:setInitData,           
            sendValue:setFieldValueById,            
            setOnchange:setOnFieldChanged,
            disconnect,
            connector:mobile.current.connector,
        },
        /* @deprecated Use mobile.disconnect() instead */
        disconnect,
        /* @deprecated Use mobile.sendInitData instead */
        setInitData,        
        /* @deprecated Use mobile.sendValue() instead */
        setFieldValueById,
        /* @deprecated Use mobile.error instead */
        errorMessage,
        /* @deprecated Use mobile.sendValue() instead */
        setters: globalInput.getSetters(mobile),
        /* @deprecated Use the boolean variables provided in the mobile object instead */
        mobileState,
        /* @deprecated Use ConnectQR component instead */
        connectionMessage: useMemo(() => globalInput.displayCodeDeprecated(mobileState, connectionCode), [connectionCode, mobileState]),
        /* @deprecated Use field instead */
        values: globalInput.getValues(mobile),
        /* @deprecated Use field instead */
        fields: globalInput.getFields(mobile),
        /* @deprecated Use mobile.initDataID instead */
        initData: mobile.current.data && mobile.current.data.initData,
        /* @deprecated */
        WhenWaiting: useCallback(({ children }) => globalInput.displayWhen2Deprecated(children, mobileState, MobileState.WAITING_FOR_MOBILE, MobileState.INITIALIZING), [mobileState === MobileState.WAITING_FOR_MOBILE || mobileState === MobileState.INITIALIZING]),
        /* @deprecated */
        WhenConnected: useCallback(({ children }) => globalInput.displayWhenDeprecated(children, mobileState, MobileState.MOBILE_CONNECTED), [mobileState === MobileState.MOBILE_CONNECTED]),
        /* @deprecated */
        WhenDisconnected: useCallback(({ children }) => globalInput.displayWhenDeprecated(children, mobileState, MobileState.DISCONNECTED), [mobileState === MobileState.DISCONNECTED]),
        /* @deprecated */
        WhenError: useCallback(({ children }) => globalInput.displayWhenDeprecated(children, mobileState, MobileState.ERROR), [mobileState === MobileState.ERROR])
    };
};

