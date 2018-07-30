'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNameRegex = /\.([a-z][a-zA-Z\d_\-]*)/g;

exports.default = _postcss2.default.plugin('postcss-prefix', fileNamePrefix);


function fileNamePrefix() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (root) {
    var filePath = root.source.input.file;
    var fileName = _path2.default.basename(filePath);

    var _fileName$split = fileName.split('.'),
        _fileName$split2 = (0, _slicedToArray3.default)(_fileName$split, 1),
        name = _fileName$split2[0];

    if (name === 'index') {
      var parts = filePath.split(_path2.default.sep);
      name = parts[parts.length - 2];
    }

    if (ignoreFileName(name)) return;

    var prefix = name + '-';

    root.walkRules(function (rule) {
      if (!rule.selectors) return rule;

      rule.selectors = rule.selectors.map(function (selector) {
        if (!isClassSelector(selector)) return selector;

        return selector.replace(classNameRegex, function (match, className) {
          if (ignoreClassName(className, options)) return '.' + className;
          if (className === 'root') return '.' + name;
          return '.' + prefix + className;
        });
      });
    });
  };
}

function ignoreFileName(fileName) {
  return (/^[^A-Z]/.test(fileName)
  );
}

function ignoreClassName(className, options) {
  return classMatchesTest(className, options.ignore) || className.trim().length === 0 || /^[A-Z-]/.test(className);
}

function classMatchesTest(className, ignore) {
  if (!ignore) return false;

  className = className.trim();

  if (ignore instanceof RegExp) return ignore.exec(className);

  if (Array.isArray(ignore)) {
    return ignore.some(function (test) {
      if (test instanceof RegExp) return test.exec(className);

      return className === test;
    });
  }

  return className === ignore;
}

function isClassSelector(selector) {
  return selector.indexOf('.') === 0;
}
module.exports = exports['default'];