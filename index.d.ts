
declare module 'global-input-react' {
    export function useGlobalInputApp(configData:any, dependencies?:[any]|[]):any;
    export const generateRandomString: (length?:number) => string;
    export const encrypt:(content:string, password:string) => string;
    export const decrypt:(content:string, password:string) => string;

    type QRCodeInput={
        label?:string;
        code?:string;
        level?:'L'|'M'|'Q'|'H';        
        size?:number;
    };
    export const DisplayQRCode:(props:QRCodeInput)=>any;

    export const MobileState:{    
        INITIALIZING:1,      
        DISCONNECTED:2,
        ERROR:3, 
        WAITING_FOR_MOBILE:4,
        MOBILE_CONNECTED:5           
    };

    
}