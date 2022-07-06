"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGlobalInputApp = void 0;

var globalInput = _interopRequireWildcard(require("./globalinput"));

var _react = require("react");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useGlobalInputApp = (config, canConnect = true, configId = "") => {
  const [{
    connectionCode,
    pairingCode,
    errorMessage,
    field,
    isLoading,
    isReady,
    isError,
    isClosed,
    isConnected,
    isDisconnected,
    isConnectionDenied,
    initData,
    senders,
    sender
  }, dispatch] = (0, _react.useReducer)(globalInput.reducer, globalInput.initialState);
  const attached = (0, _react.useRef)(true);

  const notify = st => {
    if (attached.current) {
      dispatch(st);
    } else {
      console.log(` after-detach-${st.type} `);
    }

    ;
  };

  (0, _react.useEffect)(() => {
    attached.current = true;
    return () => {
      attached.current = false;
    };
  }, []);
  const configRef = (0, _react.useRef)(null);
  configRef.current = config;
  (0, _react.useEffect)(() => {
    if (typeof configRef.current === 'function') {
      configRef.current = configRef.current();
    }

    if (typeof configRef.current.initData === 'function') {
      configRef.current.initData = configRef.current.initData();
    }

    if (canConnect || globalInput.keepConnection()) {
      globalInput.startConnect(configRef.current, notify);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [canConnect, configId]); //You don't need to memoize the input parameter of this hook.

  const restart = (0, _react.useCallback)(config => {
    if (!attached.current) {
      console.log(" -restart-not-attached- ");
      return;
    }

    if (config && typeof config.initData === 'function') {
      config.initData = config.initData();
    }

    if (!config) {
      if (typeof configRef.current === 'function') {
        configRef.current = configRef.current();
      }

      if (typeof configRef.current.initData === 'function') {
        configRef.current.initData = configRef.current.initData();
      }
    }

    globalInput.closeConnection(notify);
    globalInput.startConnect(config ? config : configRef.current, notify);
  }, []);
  const sendInitData = (0, _react.useCallback)(initData => {
    if (!attached.current) {
      return;
    }

    if (typeof initData === 'function') {
      initData = initData();
    }

    if (!globalInput.isValidInitData(initData)) {
      console.log(" init-data-set-empty ");
      return;
    }

    globalInput.sendInitData(initData, notify);
  }, []);
  const close = (0, _react.useCallback)(() => {
    globalInput.closeConnection(notify);
  }, []);
  const sendValue = globalInput.sendValue;
  const onchange = (0, _react.useRef)(null);
  const setOnchange = (0, _react.useCallback)(listener => onchange.current = listener, []);
  (0, _react.useEffect)(() => {
    if (field && onchange.current && attached.current) {
      onchange.current({
        field,
        initData,
        sendInitData,
        sendValue
      });
    }
  }, [field, initData, sendInitData, sendValue]);
  return {
    connectionCode,
    pairingCode,
    field,
    errorMessage,
    isLoading,
    isReady,
    isError,
    isClosed,
    isConnected,
    isDisconnected,
    isConnectionDenied,
    initData,
    senders,
    sender,
    sendValue,
    sendInitData,
    setOnchange,
    close,
    restart
  };
};

exports.useGlobalInputApp = useGlobalInputApp;