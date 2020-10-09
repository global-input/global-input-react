import {ACTION_TYPES,MobileState} from './constants';

export const initialState={    
    mobileState:MobileState.INITIALIZING,    
    connectionCode:null,
    errorMessage:null,        
    senders:null,    
    field:null    
};


export default (state, action)=>{
    console.log("-------****type:"+action.type);
    switch(action.type){   
        case ACTION_TYPES.START_CONNECT:
               return {...state,
                      errorMessage:'',
                      field:null,
                      mobileState:MobileState.INITIALIZING
                    };
        
        case ACTION_TYPES.SEND_INIT_DATA:               
                return {...state,field:null};

        case ACTION_TYPES.REGISTERED:
                return {...state,
                       connectionCode:action.connectionCode,
                       mobileState:MobileState.WAITING_FOR_MOBILE
                };
         
        case ACTION_TYPES.REGISTER_FAILED:
                return {...state,
                      errorMessage:action.errorMessage,
                      mobileState:MobileState.ERROR
                };
        
        case ACTION_TYPES.SENDER_CONNECTED:                    
                return {...state,senders:action.senders, mobileState:MobileState.MOBILE_CONNECTED};
        
        case ACTION_TYPES.SENDER_DISCONNECTED:
                        {
                            const mobileState=action.senders && action.senders.length >0 ? state.mobileState:MobileState.WAITING_FOR_MOBILE;
                            return {...state,senders:action.senders,mobileState};
                        }
        case ACTION_TYPES.ON_CONNECTION_ERROR:
                    return {...state,
                          errorMessage:action.errorMessage,
                          mobileState:MobileState.ERROR
                    };    
        case ACTION_TYPES.SET_FIELD:
                return {...state,field:action.field};        
        default: 
              return state;
    };    
};