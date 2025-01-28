
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
    CLOSE: 10,
    CONNECTION_DENIED: 11
};

const MobileState = {
    INITIALIZING: 1,
    CLOSED: 2,
    ERROR: 3,
    WAITING_FOR_MOBILE: 4,
    MOBILE_CONNECTED: 5
};

export const initialState = {
    connectionCode: null,
    pairingCode: null,
    errorMessage: null,
    field: null,
    isLoading: true,
    isReady: false,
    isError: false,
    isClosed: false,
    isConnected: false,
    isConnectionDenied: false,
    isDisconnected: false,
    initData: null,
    connected: [],
    registeredInfo: null

};


const mobileData = {
    session: null,
    mobileState: MobileState.INITIALIZING,
    fields: [],
    values: [],
    setters: [],
    senders: [],
    sender: null,
    mobileConfig: null
};

const setFieldProperties = (fields, values, setters) => {
    mobileData.fields = fields;
    mobileData.values = values;
    mobileData.setters = setters;
}



export const closeConnection = (notify) => {
    if (mobileData.session) {
        mobileData.session.disconnect();
        mobileData.session = null;
        mobileData.senders = [];
        mobileData.sender = null;
        mobileData.fields = [];
        mobileData.values = [];
        mobileData.setters = [];
    }
    mobileData.mobileState = MobileState.CLOSED;
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


function compareField(field1, field2) {
    // First check if either field is null/undefined
    if (!field1 || !field2) {
        return field1 === field2; // true only if both are null/undefined
    }

    // Array of properties to compare
    const properties = ['id', 'type', 'label', 'value', 'nLines'];

    // Check each property
    for (const prop of properties) {
        // Handle cases where the property might not exist
        const value1 = field1[prop];
        const value2 = field2[prop];
        
        if (value1 !== value2) {
            return false;
        }
    }

    return true; // All properties match
}
//compare two arrays of fields
function compareFields(fields1, fields2) {
    if (fields1.length !== fields2.length) {
        return false;
    }
    for(let i=0;i<fields1.length;i++) {
        if (!compareField(fields1[i], fields2[i])) {
            return false;
        }
    }
    return true;
}



export const isValidInitData = initData => initData && initData.form && initData.form.fields && initData.form.fields.length;

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
            if(mobileData.fields !== fields) {
                if(compareFields(mobileData.fields, fields)) {            
                    console.error(" send-value-discarded-fields-replaced-future-fix");                    
                }
                else{
                    console.error(" send-value-discarded-fields-replaced");
                    return;
                }
            }
            if (mobileData.mobileState !== MobileState.MOBILE_CONNECTED) {
                console.error(" send-value-discarded-state-not-connected ");
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
                        console.error(' received-message-discarded-not-connected ');
                        return;
                    }
                    
                    if (mobileData.fields !== fields) {
                        if(compareFields(mobileData.fields, fields)) {            
                            console.error(" receive-message-discarded-fields-replaced-future-fix ");                    
                        }
                        else{
                            console.error(' receive-message-discarded-fields-replaced ');
                            return;

                        }
                        
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

let onClientAppLaunched = null;
export const  setClientAppLaunched = (clientAppLaunched) => {
    onClientAppLaunched=clientAppLaunched;
}
const buildMobileConfig = (initData, config, notify) => {
    const options = config.options;
    return {
        initData,
        onClientAppLaunched: (data) => {
            onClientAppLaunched && onClientAppLaunched(data);
        },
        onRegistered: (connectionCode, registeredInfo) => {            
            mobileData.mobileState = MobileState.WAITING_FOR_MOBILE;
            options && options.onRegistered && options.onRegistered(connectionCode);
            config && config.initSocket && config.initSocket(mobileData.session.socket);
            notify({ type: ACTION_TYPES.REGISTERED, connectionCode, registeredInfo });
        },
        onRegisterFailed: errorMessage => {
            mobileData.mobileState = MobileState.ERROR;
            options && options.onRegisterFailed && options.onRegisterFailed();
            notify({ type: ACTION_TYPES.REGISTER_FAILED, errorMessage });

        },
        onSenderConnected: (sender, senders) => {
            mobileData.mobileState = MobileState.MOBILE_CONNECTED;
            mobileData.senders = senders;
            mobileData.sender = sender;
            options && options.onSenderConnected && options.onSenderConnected(sender, senders);
            notify({ type: ACTION_TYPES.SENDER_CONNECTED });
        },
        onSenderDisconnected: (sender, senders) => {
            mobileData.senders = senders;
            mobileData.sender = sender;
            if (senders && senders.length) {
                console.log("-multi-senders-");
            }
            else {
                mobileData.mobileState = MobileState.INITIALIZING;
                mobileData.session.connect(mobileData.mobileConfig);
                console.log("-sender-disconnected-");
            }
            options && options.onSenderDisconnected && options.onSenderDisconnected(sender, senders);
            notify({ type: ACTION_TYPES.SENDER_DISCONNECTED });

        },
        onInputPermission: (permissionMessage, senders, allow, deny) => {
            if (options && options.onInputPermission) {
                options.onInputPermission(permissionMessage, senders, allow, deny);
            }
            else {
                if (mobileData.sender && mobileData.sender.client !== permissionMessage.client) {
                    deny(" denied due to the one-app-per-session policy set by the application. ");
                    notify({ type: ACTION_TYPES.CONNECTION_DENIED });
                }
                else {
                    allow();
                }
            }
        },
        onError: errorMessage => {
            mobileData.mobileState = MobileState.ERROR;
            notify({ type: ACTION_TYPES.CONNECTION_ERROR, errorMessage });
        },
        url: options && options.url,
        apikey: options && options.apikey,
        securityGroup: options && options.securityGroup,
        client: options && options.client
    };

};

export const sendInitData = (initDataConfigured, notify) => {
    const { setters, fields, values, initData } = buildMessageHandlersForInitData(initDataConfigured, notify);
    if (!initData.action) {
        initData.action = 'input';
    }
    setFieldProperties(fields, values, setters);
    mobileData.mobileConfig.initData = initData;
    mobileData.session.sendInitData(initData);
    notify({ type: ACTION_TYPES.SEND_INIT_DATA });
};

export const startConnect = (config, notify) => {
    if (!isValidInitData(config.initData)) {
        console.log(" init-data-use-empty-");
        return;
    }
    const { setters, fields, values, initData } = buildMessageHandlersForInitData(config.initData, notify);
    if (!initData.action) {
        initData.action = 'input';
    }
    mobileData.mobileConfig = buildMobileConfig(initData, config, notify);
    setFieldProperties(fields, values, setters);
    if (mobileData.mobileState === MobileState.MOBILE_CONNECTED) {
        mobileData.session.sendInitData(initData);
        notify({ type: ACTION_TYPES.SEND_INIT_DATA });
        return;
    }
    mobileData.mobileState = MobileState.INITIALIZING;
    if (!mobileData.session) {
        mobileData.session = createMessageConnector();
    }
    if (config.codeAES) {
        mobileData.session.setCodeAES(config.codeAES);
    }
    mobileData.session.connect(mobileData.mobileConfig);
    notify({ type: ACTION_TYPES.START_CONNECT });
};

const getParingCode = () => {
    return mobileData.session && mobileData.session.buildPairingData();
};


export const reducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.START_CONNECT:
        case ACTION_TYPES.SEND_INIT_DATA:
            state = { ...state, errorMessage: '', field: null, isConnectionDenied: false };
            break;
        case ACTION_TYPES.REGISTERED:
            state = { ...state, errorMessage: '', field: null, connectionCode: action.connectionCode, pairingCode: getParingCode(), isConnectionDenied: false, registeredInfo: action.registeredInfo };
            break;
        case ACTION_TYPES.RECEIVED_FIELD:
            state = { ...state, field: action.field, isConnectionDenied: false };
            break;
        case ACTION_TYPES.CONNECTION_ERROR:
        case ACTION_TYPES.REGISTER_FAILED:
            state = { ...state, errorMessage: action.errorMessage, isConnectionDenied: false };
            break;
        case ACTION_TYPES.CONNECTION_DENIED:
            state = { ...state, isConnectionDenied: true };
            break;
        case ACTION_TYPES.SENDER_CONNECTED:
        case ACTION_TYPES.SENDER_DISCONNECTED:
        case ACTION_TYPES.SEND_FIELD:
        case ACTION_TYPES.CLOSE:
            state = { ...state, isConnectionDenied: false };
            break;
        default:
    };
    return {
        ...state,
        ...getStateData()
    };
};
const getStateData = () => {
    return {
        isLoading: mobileData.mobileState === MobileState.INITIALIZING,
        isReady: mobileData.mobileState === MobileState.WAITING_FOR_MOBILE,
        isError: mobileData.mobileState === MobileState.ERROR,
        isClosed: mobileData.mobileState === MobileState.CLOSED,
        isConnected: mobileData.mobileState === MobileState.MOBILE_CONNECTED,
        isDisconnected: (!!mobileData.sender) && (mobileData.mobileState !== MobileState.MOBILE_CONNECTED),
        initData: mobileData.mobileConfig && mobileData.mobileConfig.initData,
        senders: mobileData.senders,
        sender: mobileData.sender
    }
}

export const keepConnection = () => !!mobileData.sender;
