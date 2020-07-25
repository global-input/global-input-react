

import React from 'react';




export const setCallbacksOnInitData=(initData,device)=>{    
    if (!initData || !initData.form) {
        throw new Error("initData.form is missing");
    }
    device.receiveFieldInputMessages=[]; 
    for(const field of initData.form.fields){
        const promise = new Promise((resolve, reject) => {        
            field.operations = {
                onInput: (message) => resolve(message)
            };
        });
        device.receiveFieldInputMessages.push(async () => promise);
    }
}
export const configureFieldInputOnDevice = (initData, fieldIndex) => {
    const promise = new Promise((resolve, reject) => {
        if (!initData || !initData.form) {
            reject("initData.form is missing");
        }
        initData.form.fields[fieldIndex].operations = {
            onInput: (message) => resolve(message)
        };
    });
    return async () => promise;
};

export const setCodeDataCallbacks = (callbacks) => {
    const promise = new Promise((resolve, reject) => {
        callbacks.onInputCodeData = (codeData) => {
            resolve(codeData);
        };
        callbacks.onError = (opts, message, error) => {
            console.log(`error received:${message} ${error}`);
            reject(message);
        };
        callbacks.onPairing = (codeData) => {
            resolve(codeData);
        };
    });
    callbacks.getConnectionCode= async () => promise;
};
export const setCallbacksOnMobileConfig = (callbacks,connectOption) => {
    const promisePermission = new Promise((resolve, reject) => {
        connectOption.onInputPermissionResult = (message) => {
            resolve(message);
        };
    });
    callbacks.getPermissionMessage= async () => promisePermission;
    
    const promiseInput = new Promise((resolve, reject) => {
        connectOption.onInput = (message) => {
            resolve(message);
        };
    });
    callbacks.getInputMessage = async () => promiseInput;    
}
