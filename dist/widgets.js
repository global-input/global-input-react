"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PairingQR = exports.ConnectQR = void 0;

var _react = _interopRequireWildcard(require("react"));

var _qrcode = _interopRequireDefault(require("qrcode.react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const styles = {
  label: {
    paddingTop: 20,
    color: "#A9C8E6" //#4880ED

  },
  qrCode: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: "white"
  }
};

const qrCodeLabel = /*#__PURE__*/_react.default.createElement("div", {
  style: styles.label
}, "Scan with ", /*#__PURE__*/_react.default.createElement("a", {
  href: "https://globalinput.co.uk/global-input-app/get-app",
  rel: "noopener noreferrer",
  target: "_blank"
}, " Global Input App"));

const loadingSVG = /*#__PURE__*/_react.default.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "50",
  height: "50",
  viewBox: "0 0 50 50"
}, /*#__PURE__*/_react.default.createElement("path", {
  fill: "#C779D0",
  d: "M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z"
}, /*#__PURE__*/_react.default.createElement("animateTransform", {
  attributeName: "transform",
  type: "rotate",
  from: "0 25 25",
  to: "360 25 25",
  dur: "0.8s",
  repeatCount: "indefinite"
})));

const ConnectQR = ({
  mobile,
  level = 'H',
  size = null,
  label = qrCodeLabel,
  loading = loadingSVG,
  maxSize = 400,
  vspace = 130,
  hspace = 50
}) => {
  const [optimumSize, setOptimumSize] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    const handleResize = () => {
      let oSize = 0;

      if (window && window.innerWidth && window.innerHeight) {
        if (window.innerWidth < window.innerHeight) {
          oSize = window.innerWidth - hspace;
        } else {
          oSize = window.innerHeight - vspace;
        }
      }

      setOptimumSize(oSize > maxSize ? maxSize : oSize);
    };

    if (size === 0 || size) {
      return undefined;
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hspace, maxSize, size, vspace]);

  if (mobile.isLoading) {
    return loading;
  }

  if (!mobile.isReady) {
    return null;
  }

  if (!mobile.connectionCode || size === 0) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    style: styles.qrCode
  }, /*#__PURE__*/_react.default.createElement(_qrcode.default, {
    value: mobile.connectionCode,
    level: level,
    size: size ? size : optimumSize
  }), label);
};

exports.ConnectQR = ConnectQR;

const PairingQR = ({
  mobile,
  level = 'H',
  size = null,
  label = qrCodeLabel,
  loading = loadingSVG,
  maxSize = 400,
  vspace = 130,
  hspace = 50
}) => {
  const [optimumSize, setOptimumSize] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    const handleResize = () => {
      let oSize = 0;

      if (window && window.innerWidth && window.innerHeight) {
        if (window.innerWidth < window.innerHeight) {
          oSize = window.innerWidth - hspace;
        } else {
          oSize = window.innerHeight - vspace;
        }
      }

      setOptimumSize(oSize > maxSize ? maxSize : oSize);
    };

    if (size === 0 || size) {
      return null;
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hspace, maxSize, size, vspace]);

  if (mobile.isLoading) {
    return loading;
  }

  if (!mobile.isReady) {
    return null;
  }

  if (!mobile.pairingCode || size === 0) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    style: styles.qrCode
  }, /*#__PURE__*/_react.default.createElement(_qrcode.default, {
    value: mobile.pairingCode,
    level: level,
    size: size ? size : optimumSize
  }), label);
};

exports.PairingQR = PairingQR;