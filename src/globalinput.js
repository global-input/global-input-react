
import React from "react";
import QRCode from "qrcode.react";
import {ACTION_TYPES, MobileState} from './constants';
import { createMessageConnector } from 'global-input-message';

export const initialData={    
    connector:null,
    data:{
        fields:[],
        values:[], 
        setters:[],
        initData:null,        
    },    
    onFieldChanged:()=>{},

};
export const getValues         = mobile => mobile.current.data && mobile.current.data.values;
export const getFields         = mobile => mobile.current.data && mobile.current.data.fields;
export const getSetters        = mobile => mobile.current.data && mobile.current.data.setters;
export const getInitDataID     = mobile => mobile.current.data && mobile.current.data.initData && mobile.current.data.initData.id;

export const setOnFieldChanged=(mobile,onFieldChanged)=>{
    mobile.current.onFieldChanged=onFieldChanged;
}

export const closeConnection=(mobile)=>{
    if(mobile.current.connector){
        mobile.current.connector.disconnect();
        mobile.current.connector=null;
        mobile.current.data=null;         
    }
};




export const onFieldChanged=(mobile,field,setFieldValueById,setInitData)=>{
    if(field && mobile.current.onFieldChanged){
        mobile.current.onFieldChanged({
                                      field,
                                      values: getValues(mobile),
                                      setFieldValueById,
                                      setInitData
                                    });             
    }
};



export const setFieldValueById=(mobile,mobileState,fieldId, valueToSet)=>{
    if(mobileState!==MobileState.MOBILE_CONNECTED){
        return;
    }
    const {setters,fields}=mobile.current.data;
    if(fields && fields.length){
        for(let [index,field] of fields.entries()){                    
            if(field.id===fieldId){
                setters[index](valueToSet);                            
                break;
            }
        };
    }
}
export const sendInitData=(mobile,dispatch,initData)=>{
    const data=processInitData(mobile,dispatch, initData);
    if(!data){
        return null;
    }
    mobile.current.data=data;
    dispatch({type:ACTION_TYPES.SEND_INIT_DATA});
    mobile.current.connector.sendInitData(data.initData);         
};
export const startConnect =(mobile,dispatch,configData) => {
    if(typeof configData ==='function'){
        configData=configData();            
    }
    if(!configData){
        return;
    }
    const options=configData.options;
    const data=processInitData(mobile,dispatch, configData.initData);
    if(!data){
        return null;
    }
    const mobileConfig={
        initData:data.initData,            
        onRegistered: next => {
            next();  
            const connectionCode = mobile.current.connector.buildInputCodeData();
            console.log("getting[[" + connectionCode + "]]");
            dispatch({type:ACTION_TYPES.REGISTERED,connectionCode});
            if(options && options.onRegistered){
                options.onRegistered();
            }
        },
        onRegisterFailed:errorMessage => {                   
            dispatch({type:ACTION_TYPES.REGISTER_FAILED,errorMessage});
            closeConnection(mobile);
            if(options && options.onRegisterFailed){
                options.onRegisterFailed();                
            }
        },
        onSenderConnected:(sender, senders) => {
            dispatch({type:ACTION_TYPES.SENDER_CONNECTED, senders,sender});            
        },
        onSenderDisconnected:(sender, senders) => {            
            closeConnection(mobile);
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
    closeConnection(mobile);
    mobile.current.data=data;  
    mobile.current.onFieldChanged=configData.onFieldChanged;            
    dispatch({type:ACTION_TYPES.START_CONNECT});          
    mobile.current.connector=createMessageConnector();        
    mobile.current.connector.connect(mobileConfig);
}

const processInitData=(mobile,dispatch, initData)=>{
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
            mobile.current.connector.sendInputMessage(value,index);            
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
                    dispatch({type:ACTION_TYPES.SET_FIELD,field:nf});
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

export const  displayCode = (mobileState,connectionCode) => {
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


export const displayWhen2 = (children,mobileState,st1,st2)=>{
    if(mobileState!==st1 && mobileState !== st2){
        return null;
    }
    return (<React.Fragment>
        {children}
    </React.Fragment>);
};
export const displayWhen = (children,mobileState,st)=>{
    if(mobileState!==st){
        return null;
    }
    return (<React.Fragment>
        {children}
    </React.Fragment>);
};



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