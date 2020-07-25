
declare module 'global-input-react' {    
    function useGlobalInputApp(configData?:ConfigData|ConfigDataCreator, dependencies?:ReadonlyArray<any>):GlobalInputData;
    type ConfigDataCreator=()=>ConfigData;
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
    interface InitData {
        form:{
            title?:string;
            label?:string;
            fields:FormField[];
            views?:{
                viewId:{
                    [id:string]:object;
                }
            };
        }        
    }
    interface FormField{
        id?:string;        
        type?:string;
        label?:string;
        value?:GlobalInputValue;        
        nLines?:number;
        icon?:string;
        viewId?:string;
        iconText?:string|object;
        operations?:FormOperation;        
        options?:object[];
        index?:number;
    }
    
    

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
            connectionMessage:()=>GlobalInputValue;
            values:GlobalInputValue[];
            field:FormField;
            fields:FormField[];
            setters:((value:any)=>void)[];
            WhenWaiting:WhenFunction; 
            WhenConnected:WhenFunction;
            WhenDisconnected:WhenFunction;
            WhenError:WhenFunction;
            setFieldValueById:(fieldId:string, valueToSet:GlobalInputValue)=>void;
    }

    type WhenFunction=(props:any)=>any;

    

    
    function generateRandomString(length?:number):string;
    function encrypt(content:string, password:string):string;
    
    function decrypt(content:string, password:string):string;

    
    type GlobalInputValue=any; //todo

    
}