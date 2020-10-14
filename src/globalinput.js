
import React from "react";
import QRCode from "qrcode.react";
import {ACTION_TYPES, MobileState} from './constants';
import { createMessageConnector } from 'global-input-message';

const createInitialData=()=>({    
        fields:[],
        values:[], 
        setters:[],
        initData:null    
});
export const initialData={        
    data:createInitialData(),    
    onFieldChanged:()=>{},
    mobile:{
        session:null,
        isLoading: true,
        isReady:false,
        isError: false,
        isDisconnected: false,
        isConnected: false,
        initDataID: null,
        error:'',
        sendInitData:()=>{},           
        sendValue:()=>{},            
        setOnchange:()=>{},
        disconnect:()=>{},
        connector:null
    }

};


export const getValues         = shared => shared.current.data && shared.current.data.values;
export const getFields         = shared => shared.current.data && shared.current.data.fields;
export const getSetters        = shared => shared.current.data && shared.current.data.setters;
export const getInitDataID     = shared => shared.current.data && shared.current.data.initData && shared.current.data.initData.id;

export const updateMobileData=(dispatch,mobileState,errorMessage,shared)=>{
    shared.current.mobile.isLoading= mobileState === MobileState.INITIALIZING;
    shared.current.mobile.isReady= mobileState === MobileState.WAITING_FOR_MOBILE;
    shared.current.mobile.isError= mobileState === MobileState.ERROR;
    shared.current.mobile.isDisconnected= mobileState === MobileState.DISCONNECTED;
    shared.current.mobile.isConnected= mobileState === MobileState.MOBILE_CONNECTED;    
    shared.current.mobile.initDataID= shared.current.data && shared.current.data.initData && shared.current.data.initData.id;
    shared.current.mobile.error=errorMessage; 
    
    shared.current.mobile.setOnchange = (onFieldChanged) => {
        shared.current.onFieldChanged=onFieldChanged;        
    };
    shared.current.mobile.disconnect =()=>{
        closeConnection(shared);
    };
    shared.current.mobile.sendInitData = (initData) => {
        sendInitData(shared, dispatch, initData);
    };
    shared.current.mobile.sendValue=(fieldId, valueToSet) => {
        setFieldValueById(shared, mobileState, fieldId, valueToSet);
    };
}


const closeConnection=(shared)=>{
    if(shared.current.mobile.session){
        shared.current.mobile.session.disconnect();
        shared.current.mobile.session=null;        
        shared.current.data=createInitialData();   
        shared.current.onFieldChanged=()=>{};     
    }
};
const setSession=(shared,session)=>{
    shared.current.mobile.session=session;        
    shared.current.data=createInitialData();   
    shared.current.onFieldChanged=()=>{};     
};




export const onFieldChanged=(shared,field)=>{
    if(field && shared.current.onFieldChanged){
        shared.current.onFieldChanged({
                                      field,
                                      values: getValues(shared),
                                      mobile:shared.current.mobile                                      
                                    });             
    }
};



const setFieldValueById=(shared,mobileState,fieldId, valueToSet)=>{
    if(mobileState!==MobileState.MOBILE_CONNECTED){
        return;
    }
    const {setters,fields}=shared.current.data;
    if(fields && fields.length){
        for(let [index,field] of fields.entries()){                    
            if(field.id===fieldId){
                setters[index](valueToSet);                            
                break;
            }
        };
    }
}
const sendInitData=(shared,dispatch,initData)=>{
    const data=processInitData(shared,dispatch, initData);
    if(!data){
        return null;
    }
    shared.current.data=data;
    dispatch({type:ACTION_TYPES.SEND_INIT_DATA});
    shared.current.mobile.session.sendInitData(data.initData);         
};
export const startConnect =(shared,dispatch,configData) => {
    if(typeof configData ==='function'){
        configData=configData();            
    }
    if(!configData){
        return;
    }
    const options=configData.options;
    const data=processInitData(shared,dispatch, configData.initData);
    if(!data){
        return null;
    }

    const mobileConfig={
        initData:data.initData,            
        onRegistered: next => {
            next();  
            const connectionCode = shared.current.mobile.session.buildInputCodeData();
            console.log("getting[[" + connectionCode + "]]");
            dispatch({type:ACTION_TYPES.REGISTERED,connectionCode});
            if(options && options.onRegistered){
                options.onRegistered();
            }
        },
        onRegisterFailed:errorMessage => {                   
            dispatch({type:ACTION_TYPES.REGISTER_FAILED,errorMessage});
            closeConnection(shared);
            if(options && options.onRegisterFailed){
                options.onRegisterFailed();                
            }
        },
        onSenderConnected:(sender, senders) => {
            dispatch({type:ACTION_TYPES.SENDER_CONNECTED, senders,sender});            
        },
        onSenderDisconnected:(sender, senders) => {            
            closeConnection(shared);
            dispatch({type:ACTION_TYPES.SENDER_DISCONNECTED});
            
        },
        onError:errorMessage => {                   
            dispatch({type:ACTION_TYPES.ON_CONNECTION_ERROR,errorMessage});
        },
        url : options && options.url,
        apikey: options && options.apikey,      
        securityGroup: options && options.securityGroup,      
        aes:options && options.aes,
        onInput:options && options.onInput,
        onInputPermissionResult:options && options.onInputPermissionResult 
    }; 
    if(configData.session){
        setSession(shared,configData.session);
        shared.current.data=data;  
        shared.current.onFieldChanged=configData.onFieldChanged;
        dispatch({type:ACTION_TYPES.ATTACH_CONNECT});
        shared.current.mobile.session.sendInitData(data.initData);
    }
    else{
        closeConnection(shared,configData);    
        shared.current.data=data;  
        shared.current.onFieldChanged=configData.onFieldChanged;            
        dispatch({type:ACTION_TYPES.START_CONNECT});          
        shared.current.mobile.session=createMessageConnector();        
        shared.current.mobile.session.connect(mobileConfig);
    }
    
    
}

const processInitData=(shared,dispatch, initData)=>{
    if(typeof initData ==='function'){
        initData=initData();            
    }
    if(!isValidInitData(initData)){            
        console.warn("will not send empty form");
        return null;
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
        const s= (value)=>{ 
            values[index]=value;        
            fields[index].value=value;
            dispatch({type:ACTION_TYPES.SEND_FIELD});              
            shared.current.mobile.session.sendInputMessage(value,index);            
        };
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
                onInput:value=>{
                    values[index]=value;        
                    fields[index].value=value;  
                    const nf={...fields[index],value};                                                                                                                   
                    dispatch({type:ACTION_TYPES.RECEIVED_FIELD,field:nf});
                }
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
const isValidInitData=initData => initData && initData.form && initData.form.fields && initData.form.fields.length;





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

export const  displayCodeDeprecated = (mobileState,connectionCode) => {
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
                        <QRCodeContainer>Empty connection code</QRCodeContainer>
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
};


export const displayWhen2Deprecated = (children,mobileState,st1,st2)=>{
    if(mobileState!==st1 && mobileState !== st2){
        return null;
    }
    return (<React.Fragment>
        {children}
    </React.Fragment>);
};
export const displayWhenDeprecated = (children,mobileState,st)=>{
    if(mobileState!==st){
        return null;
    }
    return (<React.Fragment>
        {children}
    </React.Fragment>);
};
const getDefaultQRCodeSize=()=>{
    if(!window){
        return 400;        
    }
    let  size = window.innerWidth-10;
    return size>400?400:size;    
}
export const displayQRCode=({mobileState,connectionCode,children,size,level})=>{
    const qrCodeSize=size?size:getDefaultQRCodeSize();
    const qrCodeLevel=level?level:'H';

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
                        <QRCodeContainer>Empty connection code</QRCodeContainer>
                    );
                }
            return (
            <QRCodeContainer>                    
                <QRCode value={connectionCode} level={qrCodeLevel} size={qrCodeSize}/>
                {children?children:(
                    <LabelContainer>
                    Scan with 
                        <a href="https://globalinput.co.uk/global-input-app/get-app" target="_blank"> Global Input App</a>
                    </LabelContainer>
                )}                
            </QRCodeContainer>
        );

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