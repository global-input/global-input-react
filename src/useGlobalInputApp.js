import React, { useReducer, useEffect, useRef,useMemo,useCallback} from "react";


import {MobileState} from './constants';
import reducer,{initialState} from './reducer';
import * as globalInput from './globalinput';
export {MobileState};

export default (configData, dependencies)=>{
    const [{        
        mobileState,
        connectionCode,        
        field,
        errorMessage
    }, dispatch] = useReducer(reducer, initialState);            
    const mobile=useRef(globalInput.initialData);    

    const setOnFieldChanged=(onFieldChanged)=>{
        globalInput.setOnFieldChanged(mobile,onFieldChanged);        
    };
    const disconnect=()=>{
        globalInput.closeConnection(mobile);
    };
    
    const setFieldValueById=useCallback((fieldId, valueToSet)=>{ 
        globalInput.setFieldValueById(mobile,mobileState,fieldId, valueToSet);                                         
    },[mobile,mobileState]);

    const setInitData= useCallback((initData)=>{                 
        globalInput.sendInitData(mobile,dispatch,initData);
    },[mobile,dispatch]);

    useEffect(()=>{
        globalInput.onFieldChanged(mobile,field,setFieldValueById,setInitData); //should only executed when the field is changed
    },[field]);
    
    useEffect(()=>{        
        globalInput.startConnect(mobile,dispatch,configData);
    },dependencies?dependencies:[]);

    
    const connectionMessage=useMemo(()=>globalInput.displayCode(mobileState,connectionCode),[connectionCode,mobileState]);
    const WhenWaiting = useCallback(({children})=>globalInput.displayWhen2(children,mobileState,MobileState.WAITING_FOR_MOBILE,MobileState.INITIALIZING),[mobileState===MobileState.WAITING_FOR_MOBILE || mobileState === MobileState.INITIALIZING]);
    const WhenConnected = useCallback(({children})=>globalInput.displayWhen(children,mobileState,MobileState.MOBILE_CONNECTED),[mobileState===MobileState.MOBILE_CONNECTED]);
    const WhenDisconnected = useCallback(({children})=>globalInput.displayWhen(children,mobileState,MobileState.DISCONNECTED),[mobileState===MobileState.DISCONNECTED]);
    const WhenError = useCallback(({children})=>globalInput.displayWhen(children,mobileState,MobileState.ERROR),[mobileState===MobileState.ERROR]);
   

    return {
        mobileState,
        connectionCode,
        errorMessage,
        initData:mobile.current.data && mobile.current.data.initData,            
        mobile:mobile.current,
        disconnect,    
        setInitData, 
        connectionMessage,
        values:globalInput.getValues(mobile),
        fields:globalInput.getFields(mobile),
        field,
        setters:globalInput.getSetters(mobile),
        setFieldValueById,
        setOnFieldChanged,
        WhenWaiting, 
        WhenConnected,
        WhenDisconnected,            
        WhenError,
        initDataID:globalInput.getInitDataID(mobile)
    };
};

