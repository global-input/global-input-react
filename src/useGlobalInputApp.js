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
    
    const shared = useRef(globalInput.initialData);
    
        
    useEffect(() => {
        globalInput.startConnect(shared, dispatch, configData);
    }, dependencies ? dependencies : []); //default connect once for the component

    useEffect(()=>{
        globalInput.updateMobileData(dispatch,mobileState,errorMessage,shared);
    },[mobileState,errorMessage,dispatch]);
    
    useEffect(() => {
        globalInput.onFieldChanged(shared, field); //should only executed when the field is changed
    }, [field]);


    const ConnectQR = ({ children, size, level }) => globalInput.displayQRCode({ mobileState, connectionCode, children, size, level });


    return {
        ConnectQR,
        connectionCode,
        field,
        mobile:shared.current.mobile,        
        /* @deprecated Use mobile.disconnect() instead */
        disconnect:shared.current.mobile.disconnect,
        /* @deprecated Use mobile.sendInitData instead */
        setInitData:shared.current.mobile.sendInitData,        
        /* @deprecated Use mobile.sendValue() instead */
        setFieldValueById:shared.current.mobile.sendValue,
        /* @deprecated Use mobile.error instead */
        errorMessage,
        /* @deprecated Use mobile.sendValue() instead */
        setters: globalInput.getSetters(shared),
        /* @deprecated Use the boolean variables provided in the mobile object instead */
        mobileState,
        /* @deprecated Use ConnectQR component instead */
        connectionMessage: useMemo(() => globalInput.displayCodeDeprecated(mobileState, connectionCode), [connectionCode, mobileState]),
        /* @deprecated Use field instead */
        values: globalInput.getValues(shared),
        /* @deprecated Use field instead */
        fields: globalInput.getFields(shared),
        /* @deprecated Use mobile.initDataID instead */
        initData: shared.current.data && shared.current.data.initData,
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

