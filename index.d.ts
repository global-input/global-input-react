

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
    type OnFieldChangedFunction=(evt:FieldChanged)=>void;

    interface ConfigData {
        initData?:InitData|InitDataCreator;
        onFieldChanged?:OnFieldChangedFunction;
        options?:ConnectOptions;
    }
    interface ConnectOptions {
        apikey?:string;
        securityGroup?:string;
        client?:string;
        url?:string;        
    }
    interface FieldChanged {
        field:FormField;
        values:FieldValue[];
        setFieldValueById:SetFieldValueByIdFunction;
        setInitData:SetInitDataFunction;
        initDataID:string;
    }
    type InitDataCreator=()=>InitData;
    
    
    
    

    interface FormOperation{
        onInput:(value:any) => void;
    }
    
    type SetFieldValueByIdFunction=(fieldId:string, valueToSet:FieldValue)=>void;
    type SetInitDataFunction=(initData:InitData,options?:ConnectOptions)=>void;
    interface GlobalInputData {
            mobileState:1|2|3|4|5;
            connectionCode:string;
            errorMessage:string;            
            mobile:object;           
            disconnect:()=>void;            
            setInitData:SetInitDataFunction; 
            connectionMessage:React.FC<void>;
            values:FieldValue[];
            field:FormField;
            fields:FormField[];
            setters:((value:any)=>void)[];
            WhenWaiting:WhenFunction; 
            WhenConnected:WhenFunction;
            WhenDisconnected:WhenFunction;
            WhenError:WhenFunction;
            DisplayMobileConnect:WhenFunction;
            setFieldValueById:SetFieldValueByIdFunction;
            setOnFieldChanged:(onFieldChanged:OnFieldChangedFunction)=>void;
            initDataID:string;
    }

    type WhenFunction=(props:any)=>any;

    

    
    export function generateRandomString(length?:number):string;
    export function encrypt(content:string, password:string):string;
    
    export function decrypt(content:string, password:string):string;

    
}