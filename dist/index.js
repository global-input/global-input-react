"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _globalInputMessage = require("global-input-message");

Object.keys(_globalInputMessage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _globalInputMessage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _globalInputMessage[key];
    }
  });
});

var _useGlobalInputApp = require("./useGlobalInputApp");

Object.keys(_useGlobalInputApp).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useGlobalInputApp[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useGlobalInputApp[key];
    }
  });
});

var _widgets = require("./widgets");

Object.keys(_widgets).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _widgets[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _widgets[key];
    }
  });
});