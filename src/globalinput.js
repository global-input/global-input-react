
import React from "react";
import QRCode from "qrcode.react";

import { createMessageConnector } from 'global-input-message';

const ACTION_TYPES = { 
    START_CONNECT:1,
    SEND_INIT_DATA:2,
    REGISTERED:3,
    REGISTER_FAILED:4,
    SENDER_CONNECTED:5,
    SENDER_DISCONNECTED:6,
    CONNECTION_ERROR:7,
    RECEIVED_FIELD:8,
    SEND_FIELD:9,
    CLOSE:10    
};

const MobileState = {        
    INITIALIZING:1,      
    DISCONNECTED:2,
    ERROR:3, 
    WAITING_FOR_MOBILE:4,
    MOBILE_CONNECTED:5
};

export const initialState={        
    connectionCode:null,
    errorMessage:null,    
    field:null    
};


const mobileData={
    session:null,
    mobileState:MobileState.INITIALIZING,    
    fields:[],
    values:[], 
    setters:[],    
    clients:[],
    mobileConfig:null,
    sendInitData:()=>{},
    disconnect:()=>{},
    onchange:()=>{}        
};

const sendValue = (fieldId, valueToSet) => {
    if(mobileData.mobileState!==MobileState.MOBILE_CONNECTED){
        return;
    }        
    if(mobileData.fields && mobileData.fields.length){
        for(let [index,field] of mobileData.fields.entries()){                    
            if(field.id===fieldId){
                mobileData.setters[index](valueToSet);                            
                break;
            }
        };
    }
};

const closeConnection =()=>{
    if(mobileData.session){
        mobileData.session.disconnect();        
        mobileData.session=null;        
        mobileData.mobileState=MobileState.DISCONNECTED;
    }        
};

const setOnchange=onchange => mobileData.onchange=onchange;  


export const getFlags = ()=>{
    return {
        isLoading: mobileData.mobileState===MobileState.INITIALIZING,
        isReady: mobileData.mobileState===MobileState.WAITING_FOR_MOBILE,
        isError: mobileData.mobileState===MobileState.ERROR,
        isDisconnected: mobileData.mobileState===MobileState.DISCONNECTED,
        isConnected:    mobileData.mobileState===MobileState.MOBILE_CONNECTED

    };
};
export const getExposed = () => {
    return {
        initData:mobileData.mobileConfig && mobileData.mobileConfig.initData,
        sendValue,
        sendInitData:mobileData.sendInitData,
        setOnchange,
        disconnect:mobileData.disconnect
    }

};

export const invokeOnChange=(field)=>{
    if(field && mobileData.onchange){ 
        const {initData,sendValue,sendInitData}=getExposed();
        mobileData.onchange({
        field,
        initData,
        sendInitData,
        sendValue});                         
    }
}

const isValidInitData=initData => initData && initData.form && initData.form.fields && initData.form.fields.length;



const buildMessageHandlers=(dispatch, initData)=>{
    if(typeof initData ==='function'){
        initData=initData();            
    }
    if(!isValidInitData(initData)){            
        console.warn("will not send empty form");
        return {};
    };
    const fields=[];
    const values=[];
    const fieldSetters=[];
    const formFields=initData.form.fields.map((f,index)=>{
        if(!f){
            throw `The form contains a null field:${index} in ${initData.form.title}`;            
        }
        const field={id:f.id,label:f.label,value:f.value};
        fields.push(field);
        values.push(f.value);        
        const s= (value)=>dispatch({type:ACTION_TYPES.SEND_FIELD,value,fields,values,index});            
        fieldSetters.push(s);
        if(f.type==='info'){                
            return f;
        }
        if(f.operations && f.operations.onInput){
            return f;
        }
        return {
            ...f,
            operations:{
                onInput:value => dispatch({type:ACTION_TYPES.RECEIVED_FIELD,values,fields,value,index})
            }
        }                                                    
    });       
    return {
                setters:fieldSetters,
                fields,
                values,
                initData:{
                    ...initData,
                    form:{...initData.form,
                        fields:formFields
                    }
                }
    };
};

export const startConnect = (dispatch,configData) => {
    if(typeof configData ==='function'){
        configData=configData();            
    }
    if(!configData){
        return;
    }
    const options=configData.options;
    const {setters,fields,values,initData}=buildMessageHandlers(dispatch, configData.initData);
    if(!initData){
        return null;
    }
    const mobileConfig={
        initData,            
        onRegistered: next => {
            next();  
            const connectionCode = mobileData.session.buildInputCodeData();
            //console.log("encrypted one-time session code [[" + connectionCode + "]]");
            dispatch({type:ACTION_TYPES.REGISTERED,connectionCode});
            if(options && options.onRegistered){
                options.onRegistered();
            }
        },
        onRegisterFailed:errorMessage => {                   
            dispatch({type:ACTION_TYPES.REGISTER_FAILED,errorMessage});            
            if(options && options.onRegisterFailed){
                options.onRegisterFailed();                
            }
        },
        onSenderConnected:(client, clients) => {            
            dispatch({type:ACTION_TYPES.SENDER_CONNECTED, clients,client});            
        },
        onSenderDisconnected:(client, clients) => {                                    
            dispatch({type:ACTION_TYPES.SENDER_DISCONNECTED,client, clients});            
            
        },
        onError:errorMessage => {                   
            dispatch({type:ACTION_TYPES.CONNECTION_ERROR,errorMessage});
        },
        url : options && options.url,
        apikey: options && options.apikey,      
        securityGroup: options && options.securityGroup,      
        aes:options && options.aes,
        onInput:options && options.onInput,
        onInputPermissionResult:options && options.onInputPermissionResult 
    };
    
    if(mobileData.mobileState===MobileState.MOBILE_CONNECTED){  
            dispatch({type:ACTION_TYPES.SEND_INIT_DATA,setters,fields,values,mobileConfig});
            return;
    }
    mobileData.sendInitData=(initDataToSet)=>{
        if(!initDataToSet){
            return null;
        }        
        const {setters,fields,values,initData}=buildMessageHandlers(dispatch, initDataToSet); 
        const mobileConfig=mobileData.mobileConfig;
        mobileConfig.initData=initData;
        dispatch({type:ACTION_TYPES.SEND_INIT_DATA, setters,fields,values,mobileConfig});        
    };
    mobileData.disconnect=()=>{
        closeConnection();
        dispatch({type:ACTION_TYPES.CLOSE});                      
    };
    closeConnection();    
    dispatch({type:ACTION_TYPES.START_CONNECT,mobileConfig,setters,fields,values});                  
};






const processStartConnect = (state, action)=>{    
    const {mobileConfig,setters,fields,values}=action;          
    mobileData.mobileState=MobileState.INITIALIZING;    
    mobileData.setters=setters;
    mobileData.fields=fields;
    mobileData.values=values;
    mobileData.mobileConfig=mobileConfig;
    mobileData.session=createMessageConnector();        
    mobileData.session.connect(mobileConfig);        
    return {...state,
        errorMessage:'',
        field:null,        
        isLoading:true,
        isReady:false,
        isError:false,
        isDisconnected:false,
        isConnected:false,
        senders: []        
      };
}
const processSendInitData = (state, action)=>{    
    if (mobileData.mobileState!==MobileState.MOBILE_CONNECTED) {
        console.error("sendInitData:requires MOBILE_CONNECTED");
        return state;
    }
    const {mobileConfig,setters,fields,values}=action;              
    mobileData.setters=setters;
    mobileData.fields=fields;
    mobileData.values=values;    
    mobileData.mobileConfig=mobileConfig;
    mobileData.session.sendInitData(mobileConfig.initData);    
    return {...state,
        field:null        
    };
}



const processRegistered = (state, action)=>{
    const {connectionCode}=action;
    mobileData.mobileState=MobileState.WAITING_FOR_MOBILE;
    return {...state,
           connectionCode,
           isLoading:false,
           isReady:true,
           isError:false,
           isDisconnected:false,
           isConnected:false,
    }; 
};
const processError=(state, action)=>{
    const {errorMessage}=action; 
    mobileData.mobileState=MobileState.ERROR;    
    closeConnection();
    
    return {...state,
        errorMessage,
        isError:true,
        isLoading:false,
        isReady:false,
        isDisconnected:true,
        isConnected:false,
        field:null
    }; 
};
const processSenderConnected = (state, action) => { 
       const {clients}=action;
       mobileData.mobileState=MobileState.MOBILE_CONNECTED;
            return {...state,
                clients,
                isConnected:true,
                isLoading:false,
                isReady: false,
                isError:false,
                isDisconnected:false
            };           
}
const processSenderDisconnected = (state, action) => {
    closeConnection();
    mobileData.mobileState=MobileState.INITIALIZING;    
    mobileData.session=createMessageConnector();        
    mobileData.session.connect(mobileData.mobileConfig);    
    return {...state,
        errorMessage:'',
        field:null,        
        isLoading:true,
        isReady:false,
        isError:false,
        isDisconnected:false,
        isConnected:false,
        senders: []      
      };    
};
const processReceivedField = (state, action)=>{
    
    if(mobileData.mobileState!==MobileState.MOBILE_CONNECTED){
        console.error("RECEIVED_FIELD:requires isConnected:"+mobileData.mobileState);
        return state;
    }
    const {values,fields,value,index}=action;    
    if(mobileData.fields!==fields){
        console.error("RECEIVED_FIELD:fields array is expected to stay unchanged");
        return state;
    }
    values[index]=value;        
    fields[index].value=value;  
    const field={...fields[index],value};        
    return {...state,field}; 
};
const processSendField=(state, action)=>{    
    const { values, fields, index, value } = action;
    if (mobileData.fields !== fields) {
        console.error("SEND_FIELD:fields array is expected to stay unchanged");
        state;
    }
    if(mobileData.mobileState!==MobileState.MOBILE_CONNECTED){
        console.error("SEND_FIELD:requires isConnected:"+mobileData.mobileState);
        return state;
    }
    values[index] = value;
    fields[index].value = value;
    mobileData.session.sendInputMessage(value, index);
    return { ...state };
};
const processClose=(state, action)=>{     
    mobileData.mobileState=MobileState.DISCONNECTED;    
    closeConnection();    
    return {...state,        
        isError:false,
        isLoading:false,
        isReady:false,
        isDisconnected:true,
        isConnected:false,
        field:null
    };    

}
export const reducer = (state, action)=>{
    switch(action.type){   
        case ACTION_TYPES.START_CONNECT:
                    return processStartConnect(state, action);        
        case ACTION_TYPES.SEND_INIT_DATA:               
                    return processSendInitData(state, action);        
        case ACTION_TYPES.REGISTERED:
                    return processRegistered(state, action);
        case ACTION_TYPES.CONNECTION_ERROR:
                    return processError(state, action);
        case ACTION_TYPES.REGISTER_FAILED:
                    return processError(state, action);        
        case ACTION_TYPES.SENDER_CONNECTED:
                    return processSenderConnected(state,action);        
        case ACTION_TYPES.SENDER_DISCONNECTED: 
                    return processSenderDisconnected(state,action);        
        case ACTION_TYPES.RECEIVED_FIELD:
                    return processReceivedField(state,action);        
        case ACTION_TYPES.SEND_FIELD:
                    return processSendField(state,action);        
        case ACTION_TYPES.CLOSE:
                    return processClose(state,action);
        default: 
              return state;
    };    
};

const getDefaultQRCodeSize=()=>{
    if(!window){
        return 400;        
    }
    let  size = window.innerWidth-10;
    return size>400?400:size;    
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


export const displayQRCode=({    
    connectionCode,        
    level='H',
    isReady=false,
    isLoading=false,
    size=getDefaultQRCodeSize(),
    container=DefaultQRCodeContainer,
    children=(<DefaultLabelContainer> Scan with <a href="https://globalinput.co.uk/global-input-app/get-app" target="_blank"> Global Input App</a></DefaultLabelContainer>)
    })=>{         
        if(isReady){             
            if(connectionCode){
                return container({children:(
                    <>
                    <QRCode value={connectionCode} level={level} size={size}/>
                    {children}
                    </>
                )});                
            }
            else{
                console.log("connectionCode is not set yet");                
            }            
         } 
        else if(isLoading){            
            return container({children:(
                <>
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                            <path fill="#C779D0" d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z">
                                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.5s" repeatCount="indefinite"/>
                            </path>
                        </svg>                
                
                </>
            )});               
        }
           
        return null; 
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


