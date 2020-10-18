

declare module 'global-input-react' {
    export * from 'global-input-message';
    import { InitData, FormField, MessageReceiver, FieldValue } from 'global-input-message';

    type ConfigDataCreator = () => ConfigData;
    
    export function useGlobalInputApp(configData?: ConfigData | ConfigDataCreator, dependencies?: ReadonlyArray<any>): GlobalInputData;
    type OnchangeFunction = (evt: FieldChanged) => void;

    interface ConfigData {
        initData?: InitData | InitDataCreator;
        onchange?: OnchangeFunction;
        options?: ConnectOptions;
        session?: object;
    }
    interface ConnectOptions {
        apikey?: string;
        securityGroup?: string;
        client?: string;
        url?: string;
    }
    interface FieldChanged {
        field: FormField;        
        initData:InitData;
        sendInitData:SetInitDataFunction;       
        sendValue:SetFieldValueByIdFunction
    }
    type InitDataCreator = () => InitData;

    type SetFieldValueByIdFunction = (fieldId: string, valueToSet: FieldValue) => void;
    type SetInitDataFunction = (initData: InitData, options?: ConnectOptions) => void;

    type ConnectQRProps = {
        size: number,
        level: "L" | "M" | "Q" | "H"
    };
    interface GlobalInputData {
        ConnectQR: FunctionComponent<ConnectQRProps>,        
        connectionCode: string;
        field: FormField;        
        errorMessage: string;    
        isLoading: boolean;
        isReady: boolean;
        isError: boolean;
        isDisconnected: boolean;
        isConnected: boolean;
        initData:InitData;
        sendValue:SetFieldValueByIdFunction;
        sendInitData:SetInitDataFunction;        
        setOnchange: (onchange: OnchangeFunction) => void;
        disconnect: () => void;        
    }

    export function generateRandomString(length?: number): string;
    export function encrypt(content: string, password: string): string;

    export function decrypt(content: string, password: string): string;


}