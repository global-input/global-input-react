import React from 'react';
import { InitData, FormField, FieldValue, Sender } from 'global-input-message';
export * from 'global-input-message';
export function useGlobalInputApp(config: ConfigData | (() => ConfigData), connect?: boolean): GlobalInputData;
export function getGlobalInputState(): GlobalInputState;

interface GlobalInputState {
    isLoading: boolean;
    isReady: boolean;
    isError: boolean;
    isDisconnected: boolean;
    isConnected: boolean;
    isConnectionDenied: boolean;
    initData: InitData;
    senders: Sender[];
}

export type OnchangeFunction = (evt: FieldChanged) => void;

export interface ConfigData {
    initData: InitData | (() => InitData);
    onchange?: OnchangeFunction;
    options?: ConnectOptions;
    codeAES?: string;
}
export interface ConnectOptions {
    apikey?: string;
    url?: string;
    securityGroup?: string;
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
export type SendInitDataFunction = (initData: InitData, options?: ConnectOptions) => void;

export type ConnectQRProps = {
    size?: number,
    level?: "L" | "M" | "Q" | "H",
    label?: React.ReactNode,
    loading?: React.ReactNode,
    maxSize?: number;
    marginTop?: number;
    marginLeft?: number;
};
export interface GlobalInputData {
    ConnectQR: React.FC<ConnectQRProps>,
    PairingQR: React.FC<ConnectQRProps>,
    connectionCode: string;
    field: FormField;
    errorMessage: string;
    isLoading: boolean;
    isReady: boolean;
    isError: boolean;
    isDisconnected: boolean;
    isConnected: boolean;
    isConnectionDenied: boolean;
    initData: InitData;
    senders: Sender[];
    sendValue: SendValueFunction;
    sendInitData: SendInitDataFunction;
    setOnchange: (onchange: OnchangeFunction) => void;
    disconnect: () => void;
    restart: (config?: ConfigData) => void;
}

export function generateRandomString(length?: number): string;
export function encrypt(content: string, password: string): string;
export function decrypt(content: string, password: string): string;
