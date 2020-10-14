

declare module 'global-input-react' {
    export * from 'global-input-message';
    import { InitData, FormField, MessageReceiver, FieldValue } from 'global-input-message';

    type ConfigDataCreator = () => ConfigData;
    export const MobileState: MobileState;
    export enum MobileState {
        INITIALIZING = 1,
        DISCONNECTED,
        ERROR,
        WAITING_FOR_MOBILE,
        MOBILE_CONNECTED
    }

    export function useGlobalInputApp(configData?: ConfigData | ConfigDataCreator, dependencies?: ReadonlyArray<any>): GlobalInputData;
    type OnFieldChangedFunction = (evt: FieldChanged) => void;

    interface ConfigData {
        initData?: InitData | InitDataCreator;
        onFieldChanged?: OnFieldChangedFunction;
        options?: ConnectOptions;
        mobile?: object;
    }
    interface ConnectOptions {
        apikey?: string;
        securityGroup?: string;
        client?: string;
        url?: string;
    }
    interface FieldChanged {
        field: FormField;
        mobile: Mobile;
        values: FieldValue[];        
    }
    type InitDataCreator = () => InitData;





    interface FormOperation {
        onInput: (value: any) => void;
    }

    type SetFieldValueByIdFunction = (fieldId: string, valueToSet: FieldValue) => void;
    type SetInitDataFunction = (initData: InitData, options?: ConnectOptions) => void;

    type ConnectQRProps = {
        size: number,
        level: "L" | "M" | "Q" | "H"
    };

    interface Mobile {
        isLoading: boolean;
        isReady: boolean;
        isError: boolean;
        isDisconnected: boolean;
        isConnected: boolean;
        initDataID: string;        
        error: string;
        sendInitData:SetInitDataFunction;
        sendValue:SetFieldValueByIdFunction;
        setOnchange: (onFieldChanged: OnFieldChangedFunction) => void;
        disconnect: () => void;
        connector:object;
    }


    interface GlobalInputData {
        ConnectQR: FunctionComponent<ConnectQRProps>,        
        connectionCode: string;
        field: FormField;        
        mobile: Mobile;
        /* @deprecated Use mobile.disconnect() instead */
        disconnect: () => void;
        /* @deprecated Use mobile.sendInitData() instead */
        setInitData: SetInitDataFunction;                
        /* @deprecated Use mobile.sendValue() instead */
        setFieldValueById: SetFieldValueByIdFunction;
        /* @deprecated Use mobile.error instead */
        errorMessage: string;
        /* @deprecated Use mobile.sendValue() instead */
        setters: ((value: any) => void)[];
        /* @deprecated Use the boolean variables provided in the mobile object instead */
        mobileState: 1 | 2 | 3 | 4 | 5;
        /* @deprecated Use ConnectQR component instead */
        connectionMessage: React.FC<void>;
        /* @deprecated Use field instead */
        values: FieldValue[];
        /* @deprecated Use field instead */
        fields: FormField[];
        /* @deprecated */
        WhenWaiting: WhenFunction;
        /* @deprecated */
        WhenConnected: WhenFunction;
        /* @deprecated */
        WhenDisconnected: WhenFunction;
        /* @deprecated */
        WhenError: WhenFunction;
    }

    type WhenFunction = (props: any) => any;




    export function generateRandomString(length?: number): string;
    export function encrypt(content: string, password: string): string;

    export function decrypt(content: string, password: string): string;


}