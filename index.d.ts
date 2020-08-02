

declare module 'global-input-react' {  
    export * from 'global-input-message';
    import {InitData,FormField,MessageReceiver,FieldValue} from 'global-input-message';
    
    type ConfigDataCreator=()=>ConfigData;
    export const MobileState:MobileState;
    export enum MobileState {
        INITIALIZING=1,
        DISCONNECTED,
        ERROR,
        WAITING_FOR_MOBILE,
        MOBILE_CONNECTED
    }

    export function useGlobalInputApp(configData?:ConfigData|ConfigDataCreator, dependencies?:ReadonlyArray<any>):GlobalInputData;
    
    interface ConfigData {
        initData?:InitData|InitDataCreator;
        onFieldChanged?:(evt:FieldChanged)=>void;
        options?:ConnectOptions;
    }
    interface ConnectOptions {
        apikey?:string;
        securityGroup?:string;
        client?:string;
        url?:string;        
    }
    interface FieldChanged {
        field:FormField
    }
    type InitDataCreator=()=>InitData;
    
    
    
    

    interface FormOperation{
        onInput:(value:any) => void
    }

    interface GlobalInputData {
            mobileState:1|2|3|4|5;
            connectionCode:string;
            errorMessage:string;            
            mobile:object;           
            disconnect:()=>void;            
            setInitData:(initData:InitData,options?:ConnectOptions)=>void; 
            connectionMessage:React.FC<void>;
            values:FieldValue[];
            field:FormField;
            fields:FormField[];
            setters:((value:any)=>void)[];
            WhenWaiting:WhenFunction; 
            WhenConnected:WhenFunction;
            WhenDisconnected:WhenFunction;
            WhenError:WhenFunction;
            setFieldValueById:(fieldId:string, valueToSet:FieldValue)=>void;
    }

    type WhenFunction=(props:any)=>any;

    

    
    export function generateRandomString(length?:number):string;
    export function encrypt(content:string, password:string):string;
    
    export function decrypt(content:string, password:string):string;

    
}