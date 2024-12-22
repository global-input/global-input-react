import React from 'react';
import type { InitData, FormField, FieldValue, Sender,PermissionRequestMessage } from 'global-input-message';
export * from 'global-input-message';
export function useGlobalInputApp(config: ConfigData | (() => ConfigData), canConnect?: boolean, configId?: any): GlobalInputData;
export function getGlobalInputState(): GlobalInputState;

interface RegisteredInfo {
    session: string;
    url: string;
}
interface GlobalInputState {
    isLoading: boolean;
    isReady: boolean;
    isError: boolean;
    isClosed: boolean;
    isConnected: boolean;
    isConnectionDenied: boolean;
    initData: InitData;
    senders: Sender[];
    registeredInfo?: RegisteredInfo|null;
}

export type OnchangeFunction = (evt: FieldChanged) => void;

export interface ConfigData {
    initData: InitData | (() => InitData);
    onchange?: OnchangeFunction;
    options?: ConnectOptions;
    codeAES?: string;
    initSocket?:(socket:any)=>void;
}
export interface ConnectOptions {
    apikey?: string;
    url?: string;
    securityGroup?: string;
    client?: string;
    onRegistered?: (connectionCode: string) => void;
    onRegisterFailed?: () => void;
    onSenderConnected?: (sender: Sender, senders: Sender[]) => void;
    onSenderDisconnected?: (sender: Sender, senders: Sender[]) => void;
    onInputPermission?: (permissionMessage: PermissionRequestMessage, senders: Sender[], allow: () => void, deny: (reason?: string) => void) => void;
    onError?: (message: string) => void;
}
export interface FieldChanged {
    field: FormField;
    initData: InitData;
    sendInitData: SendInitDataFunction;
    sendValue: SendValueFunction
}

export type SendValueFunction = (fieldId: string, valueToSet: FieldValue, fieldIndex?: number) => void;
export type SendInitDataFunction = (initData: InitData) => void;

export type ConnectQRProps = {
    size?: number,
    level?: "L" | "M" | "Q" | "H",
    label?: React.ReactNode,
    loading?: React.ReactNode,
    maxSize?: number;
    vspace?: number;
    hspace?: number;
    mobile:GlobalInputData;
    onClickCode?: (code: string) => void;
};


export interface GlobalInputData {
    connectionCode: string;
    registeredInfo?: RegisteredInfo;
    pairingCode: string;
    field: FormField;
    errorMessage: string;
    isLoading: boolean;
    isReady: boolean;
    isError: boolean;
    isClosed: boolean;
    isConnected: boolean;
    isDisconnected:boolean;
    isConnectionDenied: boolean;
    initData: InitData;
    senders: Sender[];
    sender:Sender;
    sendValue: SendValueFunction;
    sendInitData: SendInitDataFunction;
    setOnchange: (onchange: OnchangeFunction) => void;
    close: () => void;
    restart: (config?: ConfigData) => void;
    setClientAppLaunched: (listener:(data:any)=>void ) => void;
}

export function generateRandomString(length?: number): string;
export function encrypt(content: string, password: string): string;
export function decrypt(content: string, password: string): string;
export  const ConnectQR:React.FC<ConnectQRProps>;
export  const PairingQR:React.FC<ConnectQRProps>;
