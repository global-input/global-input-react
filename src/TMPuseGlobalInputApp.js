import React, { useReducer, useEffect, useRef,useMemo,useCallback} from "react";
import { createMessageConnector } from 'global-input-message';
import QRCode from "qrcode.react";

const ACTION_TYPES = {    
    DISCONNECT:1,
    CONNECT:2,
    SET_ERROR:3,    
    SET_CONNECTION_CODE:5,
    MOBILE_CONNECTED:6,    
    INPUT_RECEIVED:7,
    SET_SETTERS:8,
    SEND_INPUT_STREAM:9,
    MOBILE_DISCONNECTED:10
};

export const MobileState = {    
    INITIALIZING:1,      
    DISCONNECTED:2,
    ERROR:3, 
    WAITING_FOR_MOBILE:4,
    MOBILE_CONNECTED:5

};

const initialState={
    mobileState:MobileState.INITIALIZING,
    initData:null,        
    connectionCode:null,
    errorMessage:null,    
    mobile:createMessageConnector(),
    senders:null,
    fields:[],
    values:[],
    field:null,
    setters:[]
};



const doProcessConnect=(state, action)=>{
    const {mobile}=state;
    let {mobileState}=state;

    const {initData,mobileConfig,fields,values,setters}=action;
    if(!initData){
        console.warn("ignored empty InitData");
        return state;
    }         
    if(mobile.isConnected()){
        if(mobileState===MobileState.MOBILE_CONNECTED){            
            mobile.sendInitData(initData);
            return {...state,errorMessage:'',fields,values, field:null,setters,initData};
        }
        else{
            // mobileState=MobileState.DISCONNECTED;
            // mobile.disconnect();
            console.log("already connected...ingored the second time connect:");
            return state;
        }
    }
    if(!mobileConfig){
        console.warn("ignored empty mobileConfig");
        return {...state,mobileState};
    }                                                                       
    mobileConfig.initData=initData;  
    mobileState=MobileState.INITIALIZING;
    
    mobile.connect(mobileConfig);    
    return {...state,mobileState,errorMessage:'',fields,values, field:null,setters,initData};
};
const doProcessSetProcessConnectionCode=(state, action)=>{
    const {mobile}=state;                    
    if(!mobile){                   
        return state;
    } 
    const mobileState=MobileState.WAITING_FOR_MOBILE               
    const connectionCode = mobile.buildInputCodeData();           
    console.log("getting[[" + connectionCode + "]]");
    return {...state,mobileState,connectionCode};    
};
const doProcessDisconnect=(state, action)=>{
    const {mobile}=state;    
    if(mobile){
        mobile.disconnect();
        console.log("disconnected");        
    }                  
    return {...initialState,mobileState:MobileState.DISCONNECTED,initData:null};                      
};
const doProcessSetError=(state, action)=>{
    const {mobile}=state;    
    const {errorMessage}=action;   
    if(mobile){
        mobile.disconnect();
        console.log("disconnected because of error");        
    }     
    return {...state,mobileState:MobileState.ERROR,errorMessage,initData:null};                                      
};
const doProcessMobileConnected=(state, action)=>{
    const {senders}= action;
    const mobileState=MobileState.MOBILE_CONNECTED               
    return {...state,mobileState,senders};
};
const doProcessMobileDisconnected=(state, action)=>{
    const {senders}= action; 
    if(senders && senders.length){
        console.log("one mobile disconnected");
        return {...state,senders};           
    }             
    console.log("all mobiles disconnected");
    return {...state,mobileState:MobileState.WAITING_FOR_MOBILE}; 
    
}
const doProcessInputReceived=(state, action)=>{
    const {index,value,field}=action;    
    const  {values,fields}=state;
    
    if(!fields || fields.length<=index || index<0){
        console.warn("index out of range, ignored:"+index);        
        return state;
    }
    if(field.id && fields[index].id !==field.id){
        console.warn("field is does not match:"+field.id+":"+fields[index].id);
        return;
    }
    const newValues=values.map((v,ind)=>ind===index?value:v);
    const nf={...fields[index],value};
    const newFields=fields.map((f,ind)=>ind===index?nf:f);
    return {...state,values:newValues,field:nf, fields:newFields};
};
const doProcessSetSetters=(state, action)=>{
    const {setters}=action; 
    return {...state,setters};   
}
const doProcessSendInputStream=(state,action)=>{
    const {index,value}=action;  
    const  {values,fields,mobile}=state;    
    if(!values || values.length<=index || index<0){
        console.log("index out of range, ignored for sending input stream:"+index);        
        return state;
    }
    if(!fields || fields.length<=index){
        console.log("index out of range, ignored for sending input stream:"+index);        
        return state;
    }    
    values[index]=value;        
    fields[index].value=value;   
    if(mobile){
        mobile.sendInputMessage(value,index);     
    } 
    
    return {...state};
}


const reducer= (state, action)=>{
    console.log("***type:"+action.type);
    switch(action.type){   
        case ACTION_TYPES.DISCONNECT:      
                return doProcessDisconnect(state, action);
        case  ACTION_TYPES.SET_ERROR:
                return doProcessSetError(state,action);    
        case ACTION_TYPES.CONNECT:
                return doProcessConnect(state, action);        
        case  ACTION_TYPES.SET_CONNECTION_CODE:              
                return doProcessSetProcessConnectionCode(state,action);
        case ACTION_TYPES.MOBILE_CONNECTED:
                return doProcessMobileConnected(state, action);              
        case ACTION_TYPES.MOBILE_DISCONNECTED:
                return doProcessMobileDisconnected(state, action);              
        case ACTION_TYPES.INPUT_RECEIVED:
                return doProcessInputReceived(state,action);
        case ACTION_TYPES.SET_SETTERS:
                return doProcessSetSetters(state,action);
        case ACTION_TYPES.SEND_INPUT_STREAM:
                return doProcessSendInputStream(state,action);
        default: 
              return state;
    };
    
};

const DefaultQRCodeContainer=({children})=>(
    <div style={styles.barcode}>
            {children}
    </div>                  
);
const DefaultLabelContainer=({children})=>(
    <div style={styles.label}>
            {children}
    </div>                  
);



export default (configData, dependencies)=>{

    const [state, dispatch] = useReducer(reducer, initialState);    
    const {connectionCode, mobile,mobileState,errorMessage,values,fields,field,setters}=state;
    const onFieldChangedHolder=useRef(null);
    const setOnFieldChanged=(onFieldChanged)=>{
        onFieldChangedHolder.current=onFieldChanged;        
    }

    if(typeof configData ==='function'){
        configData=configData();            
    }
    const disconnect = useCallback(() => {
        if(mobile){
            mobile.disconnect();
        }
        dispatch({type:ACTION_TYPES.DISCONNECT});            
    },[mobile]);

    const setInitData= useCallback((initData,options)=>{
        processInitData({receivedInitData:initData,options,mobile,dispatch});
    },[mobile]);
    
    useEffect(()=>{
        if(!configData){
            return;
        }         
        onFieldChangedHolder.current=configData.onFieldChanged;
        setInitData(configData.initData, configData.options);        
    },dependencies?dependencies:[]);
    useEffect(()=>{
        return ()=>disconnect();
    },[]);
    
    const connectionMessage=useMemo(()=>{                                        
        let  qrCodeSize = window.innerWidth-10;
        if(qrCodeSize>400){
                qrCodeSize=400;
        }
        let QRCodeContainer=DefaultQRCodeContainer;            
        let LabelContainer=DefaultLabelContainer;        
        if(mobileState===MobileState.INITIALIZING){
            return (
                <QRCodeContainer>  
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
    <path fill="#C779D0" d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z">
        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.5s" repeatCount="indefinite"/>
    </path>
</svg>
                    
                </QRCodeContainer>
            );
        } 
        if(mobileState===MobileState.WAITING_FOR_MOBILE){
            if(!connectionCode){
                return(
                <QRCodeContainer>                    
                    Empty connection code
                </QRCodeContainer>
                );
            }
            return (
                <QRCodeContainer>                    
                    <QRCode value={connectionCode} level='H' size={qrCodeSize} />                    
                    <LabelContainer>
                        Scan with 
                        <a href="https://globalinput.co.uk/global-input-app/get-app" target="_blank"> Global Input App</a>
                    </LabelContainer>
                </QRCodeContainer>
            );

        }    
        return null;        
    },[connectionCode,mobileState]);

   const WhenWaiting = useCallback(({children})=>{
       if(mobileState!==MobileState.WAITING_FOR_MOBILE && mobileState !== MobileState.INITIALIZING){
           return null;
       }
       return (<React.Fragment>
           {children}
       </React.Fragment>);
   },[mobileState===MobileState.WAITING_FOR_MOBILE || mobileState === MobileState.INITIALIZING]);
   
   const WhenConnected = useCallback(({children})=>{
       if(mobileState!==MobileState.MOBILE_CONNECTED){
           return null;
       }
    return (<React.Fragment>
        {children}
    </React.Fragment>);
   },[mobileState===MobileState.MOBILE_CONNECTED]);
   
   const WhenDisconnected = useCallback(({children})=>{
        if(mobileState!==MobileState.DISCONNECTED){
            return null;
        }
        return (<React.Fragment>
            {children}
        </React.Fragment>);
   },[mobileState===MobileState.DISCONNECTED]);    
   

   const WhenError=useCallback(({children})=>{
    if(mobileState!==MobileState.ERROR){
        return null;
    }
    return (<React.Fragment>
        {children}
    </React.Fragment>);
},[mobileState===MobileState.ERROR]);

 

    
    const setFieldValueById=(fieldId, valueToSet)=>{ 
        if(mobileState!==MobileState.MOBILE_CONNECTED){
            return;
        }
        if(fields && fields.length){
            for(let [index,field] of fields.entries()){                    
                if(field.id===fieldId){
                    setters[index](valueToSet);                            
                    break;
                }
            };
        }                                           
    };
        
    
    useEffect(()=>{          
        if(field && onFieldChangedHolder.current){
            onFieldChangedHolder.current({field,values,setFieldValueById,setInitData});             
        }
    },[field]);
    
    return {
            mobileState,
            connectionCode,
            errorMessage,
            initData:state.initData,            
            mobile,
            disconnect,            
            setInitData, 
            connectionMessage,
            values,
            field,
            fields,
            setters,
            setFieldValueById,
            setOnFieldChanged,
            WhenWaiting, 
            WhenConnected,
            WhenDisconnected,            
            WhenError,
    };
};



const processInitData= ({receivedInitData,options,mobile,dispatch}) => {
    if(typeof receivedInitData ==='function'){
        receivedInitData=receivedInitData();            
    }
    if(!receivedInitData || !receivedInitData.form || !receivedInitData.form.fields || !receivedInitData.form.fields.length){            
        console.warn("will not send empty form");
        return;
    };
    const fields=[];
    const values=[];
    const setters=[];
    const formFields=receivedInitData.form.fields.map((f,index)=>{
        if(!f){
            console.error("The form contains a null field:"+index+" in "+receivedInitData.form.title);
            return f;
        }
        const field={id:f.id,label:f.label,value:f.value};
        fields.push(field);
        values.push(f.value);
        const s= (value)=>{                
            dispatch({type:ACTION_TYPES.SEND_INPUT_STREAM,value,index});                
        };
        setters.push(s);
        if(f.type==='info'){                
            return f;
        }
        if(f.operations && f.operations.onInput){                                     
            return f;
        }
        return {
            ...f,
            operations:{
                onInput:value=>{
                    dispatch({type:ACTION_TYPES.INPUT_RECEIVED,value,index, field:f});
                }
            }
        }                                                    
    });

    const waitForMobileToConnect = ()=> dispatch({type:ACTION_TYPES.SET_CONNECTION_CODE});
    const onSenderConnected = (sender, senders) => {
        dispatch({type:ACTION_TYPES.MOBILE_CONNECTED, senders});
    };
    const onSenderDisconnected = (sender, senders) => {                    
        dispatch({type:ACTION_TYPES.MOBILE_DISCONNECTED, senders});            
    };
    const onError = errorMessage => {                   
        dispatch({type:ACTION_TYPES.SET_ERROR,errorMessage});
    }; 
    const mobileConfig={            
        onRegistered: next => {
            next();
            console.log("-----registered:");
            waitForMobileToConnect();
        },
        onRegisterFailed:onError,
        onSenderConnected,
        onSenderDisconnected,
        onError,
        ...options
    };            
    const form={...receivedInitData.form,fields:formFields};
    const initData={...receivedInitData,form};    
    console.log("-------****8------dispatching CONNECT reduce action---***--");
    dispatch({type:ACTION_TYPES.CONNECT,initData,mobileConfig,fields,values,setters});        
}


const styles={
    barcode:{
        backgroundColor:"white",        
        padding:20,
        display:"flex",
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"center"      
    },
    label:{
        paddingTop:20,
        color:"#A9C8E6", //#4880ED
    }
}