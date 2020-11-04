import React from 'react';
import { InitData, FormField, FieldValue } from 'global-input-message';
export * from 'global-input-message';
export function useGlobalInputApp(config: ConfigData | (() => ConfigData)): GlobalInputData;

type OnchangeFunction = (evt: FieldChanged) => void;

export interface ConfigData {
    initData: InitData | (() => InitData);
    onchange?: OnchangeFunction;
    options?: ConnectOptions;
}
export interface ConnectOptions {
    apikey?: string;
    securityGroup?: string;
    client?: string;
    url?: string;
}
interface FieldChanged {
    field: FormField;
    initData: InitData;
    sendInitData: SendInitDataFunction;
    sendValue: SendValueFunction
}

type SendValueFunction = (fieldId: string, valueToSet: FieldValue, fieldIndex?: number) => void;
type SendInitDataFunction = (initData: InitData, options?: ConnectOptions) => void;

type ConnectQRProps = {
    size?: number,
    level?: "L" | "M" | "Q" | "H",
    container?: React.FC
};
export interface GlobalInputData {
    ConnectQR: React.FC<ConnectQRProps>,
    connectionCode: string;
    field: FormField;
    errorMessage: string;
    isLoading: boolean;
    isReady: boolean;
    isError: boolean;
    isDisconnected: boolean;
    isConnected: boolean;
    initData: InitData;
    sendValue: SendValueFunction;
    sendInitData: SendInitDataFunction;
    setOnchange: (onchange: OnchangeFunction) => void;
    disconnect: () => void;
}

export function generateRandomString(length?: number): string;
export function encrypt(content: string, password: string): string;
export function decrypt(content: string, password: string): string;
