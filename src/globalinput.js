
import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { createMessageConnector } from 'global-input-message';

const ACTION_TYPES = {
    START_CONNECT: 1,
    SEND_INIT_DATA: 2,
    REGISTERED: 3,
    REGISTER_FAILED: 4,
    SENDER_CONNECTED: 5,
    SENDER_DISCONNECTED: 6,
    CONNECTION_ERROR: 7,
    RECEIVED_FIELD: 8,
    SEND_FIELD: 9,
    CLOSE: 10
};

const MobileState = {
    INITIALIZING: 1,
    DISCONNECTED: 2,
    ERROR: 3,
    WAITING_FOR_MOBILE: 4,
    MOBILE_CONNECTED: 5
};

export const initialState = {
    connectionCode: null,
    errorMessage: null,
    field: null,
    isLoading: true,
    isReady: false,
    isError: false,
    isDisconnected: false,
    isConnected: false,
    initData: null,
};


const mobileData = {
    session: null,
    mobileState: MobileState.INITIALIZING,
    fields: [],
    values: [],
    setters: [],
    clients: [],
    client: null,
    mobileConfig: null
};

const setFieldProperties = (fields, values, setters) => {
    mobileData.fields = fields;
    mobileData.values = values;
    mobileData.setters = setters;
}


const closeConnection = () => {
    if (mobileData.session) {
        mobileData.session.disconnect();
        mobileData.session = null;
    }
};
export const disconnect = (notify) => {
    closeConnection();
    mobileData.mobileState = MobileState.DISCONNECTED;
    if (notify) {
        notify({ type: ACTION_TYPES.CLOSE });
    }
}


export const sendValue = (fieldId, valueToSet, fieldIndex = -1) => {
    if (mobileData.mobileState !== MobileState.MOBILE_CONNECTED) {
        return;
    }
    if (mobileData.fields && mobileData.fields.length) {
        if (fieldId) {
            for (let [index, field] of mobileData.fields.entries()) {
                if (field.id === fieldId) {
                    mobileData.setters[index](valueToSet);
                    break;
                }
            }
        }
        else {
            if (fieldIndex >= 0 && fieldIndex <= mobileData.fields.length) {
                mobileData.setters[fieldIndex](valueToSet);
            }
        }
    }
};
export const isValidInitData = initData => initData && initData.form && initData.form.fields && initData.form.fields.length;

export const initDataIdentity = (initData) => {
    if (!isValidInitData(initData)) {
        return '';
    }
    return initData.id + "/" + initData.form.id;
}

const buildMessageHandlersForInitData = (initData, notify) => {

    const fields = [];
    const values = [];
    const fieldSetters = [];
    const formFields = initData.form.fields.map((f, index) => {
        if (!f) {
            throw new Error(`The form contains a null field:${index} in ${initData.form.title}`);
        }
        const field = { id: f.id, label: f.label, value: f.value };
        fields.push(field);
        values.push(f.value);
        const s = (value) => {
            if (mobileData.fields !== fields) {
                console.error(" set-field-discarded-fields-replaced ");
                return;
            }
            if (mobileData.mobileState !== MobileState.MOBILE_CONNECTED) {
                console.error(" set-field-discarded-state-not-connected ");
                return;
            }
            values[index] = value;
            fields[index].value = value;
            if (fields[index].id) {
                mobileData.session.sendValue(fields[index].id, value);
            }
            else {
                mobileData.session.sendValue(null, value, index);
            }
            notify({ type: ACTION_TYPES.SEND_FIELD });
        }
        fieldSetters.push(s);
        if (f.type === 'info') {
            return f;
        }
        if (f.operations && f.operations.onInput) {
            return f;
        }
        return {
            ...f,
            operations: {
                onInput: value => {
                    if (mobileData.mobileState !== MobileState.MOBILE_CONNECTED) {
                        console.error(' on-input-message-discarded-not-connected ');
                        return;
                    }
                    if (mobileData.fields !== fields) {
                        console.error(' on-input-message-discarded-fields-replaced ');
                        return;
                    }
                    values[index] = value;
                    fields[index].value = value;
                    const field = { ...fields[index], value };
                    notify({ type: ACTION_TYPES.RECEIVED_FIELD, field });
                }
            }
        }
    });
    return {
        setters: fieldSetters,
        fields,
        values,
        initData: {
            ...initData,
            form: {
                ...initData.form,
                fields: formFields
            }
        }
    };
};


const buildMobileConfig = (initData, options, notify) => {
    return {
        initData,
        onRegistered: (connectionCode) => {
            mobileData.mobileState = MobileState.WAITING_FOR_MOBILE;
            options && options.onRegistered && options.onRegistered(connectionCode);
            notify({ type: ACTION_TYPES.REGISTERED, connectionCode });
        },
        onRegisterFailed: errorMessage => {
            closeConnection();
            mobileData.mobileState = MobileState.ERROR;
            options && options.onRegisterFailed && options.onRegisterFailed();
            notify({ type: ACTION_TYPES.REGISTER_FAILED, errorMessage });

        },
        onSenderConnected: (client, clients) => {
            mobileData.mobileState = MobileState.MOBILE_CONNECTED;
            mobileData.clients = clients;
            mobileData.client = client;
            notify({ type: ACTION_TYPES.SENDER_CONNECTED });
        },
        onSenderDisconnected: (client, clients) => {
            mobileData.clients = clients;
            mobileData.client = client;
            closeConnection();
            mobileData.mobileState = MobileState.INITIALIZING;
            mobileData.session = createMessageConnector();
            mobileData.session.connect(mobileData.mobileConfig);
            notify({ type: ACTION_TYPES.SENDER_DISCONNECTED });
        },
        onError: errorMessage => {
            closeConnection();
            mobileData.mobileState = MobileState.ERROR;
            notify({ type: ACTION_TYPES.CONNECTION_ERROR, errorMessage });
        },
        url: options && options.url,
        apikey: options && options.apikey,
        securityGroup: options && options.securityGroup,
        aes: options && options.aes,
        onInput: options && options.onInput,
        onInputPermissionResult: options && options.onInputPermissionResult
    };
};

export const sendInitData = (initDataConfigured, notify) => {
    const { setters, fields, values, initData } = buildMessageHandlersForInitData(initDataConfigured, notify);
    setFieldProperties(fields, values, setters);
    mobileData.mobileConfig.initData = initData;
    mobileData.session.sendInitData(initData);
    notify({ type: ACTION_TYPES.SEND_INIT_DATA });
};


export const startConnect = (notify, initDataConfigured, options) => {
    const { setters, fields, values, initData } = buildMessageHandlersForInitData(initDataConfigured, notify);
    mobileData.mobileConfig = buildMobileConfig(initData, options, notify);
    setFieldProperties(fields, values, setters);
    if (mobileData.mobileState === MobileState.MOBILE_CONNECTED) {
        mobileData.session.sendInitData(initData);
        notify({ type: ACTION_TYPES.SEND_INIT_DATA });
        return;
    }
    closeConnection();
    mobileData.mobileState = MobileState.INITIALIZING;
    mobileData.session = createMessageConnector();
    mobileData.session.connect(mobileData.mobileConfig);
    notify({ type: ACTION_TYPES.START_CONNECT });
};




export const reducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.START_CONNECT:
        case ACTION_TYPES.SEND_INIT_DATA:
            state = { ...state, errorMessage: '', field: null };
            break;
        case ACTION_TYPES.REGISTERED:
            state = { ...state, errorMessage: '', field: null, connectionCode: action.connectionCode };
            break;
        case ACTION_TYPES.RECEIVED_FIELD:
            state = { ...state, field: action.field };
            break;
        case ACTION_TYPES.CONNECTION_ERROR:
        case ACTION_TYPES.REGISTER_FAILED:
            state = { ...state, errorMessage: action.errorMessage };
            break;
        case ACTION_TYPES.SENDER_CONNECTED:
        case ACTION_TYPES.SENDER_DISCONNECTED:
        case ACTION_TYPES.SEND_FIELD:
        case ACTION_TYPES.CLOSE:
        default:
    };
    return {
        ...state,
        isLoading: mobileData.mobileState === MobileState.INITIALIZING,
        isReady: mobileData.mobileState === MobileState.WAITING_FOR_MOBILE,
        isError: mobileData.mobileState === MobileState.ERROR,
        isDisconnected: mobileData.mobileState === MobileState.DISCONNECTED,
        isConnected: mobileData.mobileState === MobileState.MOBILE_CONNECTED,
        initData: mobileData.mobileConfig && mobileData.mobileConfig.initData
    };
};

const styles = {
    label: {
        paddingTop: 20,
        color: "#A9C8E6", //#4880ED
    },
};

export const loading = (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <path fill="#C779D0" d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.5s" repeatCount="indefinite" />
        </path>
    </svg>
);


export const qrCodeLabel = (
    <div style={styles.label}>
        Scan with <a href="https://globalinput.co.uk/global-input-app/get-app" rel="noreferrer" target="_blank"> Global Input App</a>
    </div>
);

export const displayQRCode = (connectionCode, level, size, label, maxSize, marginTop, marginLeft) => {
    if ((!connectionCode) || size === 0) {
        return null;
    }
    if (size) {
        return (
            <>
                <QRCode value={connectionCode} level={level} size={size} />
                {label}
            </>
        );
    }
    else {
        return (
            <>
                <ResizeQRCode value={connectionCode} level={level} maxSize={maxSize} marginTop={marginTop} marginLeft={marginLeft} />
                {label}
            </>
        );
    }
}

const ResizeQRCode = ({ value, level, maxSize, marginTop, marginLeft }) => {
    const [size, setSize] = useState(0);
    useEffect(() => {
        const handleResize = () => {
            let size = 0;
            if (window && window.innerWidth && window.innerHeight) {
                if (window.innerWidth < window.innerHeight) {
                    size = window.innerWidth - marginLeft;
                }
                else {
                    size = window.innerHeight - marginTop;
                }
            }
            setSize(size > maxSize ? maxSize : size);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize) }
    });
    if (!size) {
        return null;
    }
    return (<QRCode value={value} level={level} size={size} />);
};
