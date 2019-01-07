(function (root, undefined) {
  let fm = {}

  const _opts = {
    precision: 0,    // 小数点精确度到几位
    grouping: 3,
    thousand: ",",
    decimal: ".",
    symbol: "$"
  }

  let nativeMap = Array.prototype.map,
    nativeIsArray = Array.isArray,
    toString = Object.prototype.toString;

  function isString(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  }

  function isArray(obj) {
    return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
  }

  function isObject(obj) {
    return obj && toString.call(obj) === '[object Object]';
  }

  const toFixed = fm.toFixed = (number, precision) => {
    const _number = number.toString()
    const decimals = _number.substr(_number.indexOf('.') + 1)
    const exponent = decimals.length - precision >= 0 ? '' : Math.abs(decimals.length - precision)

    return exponent !== ''
      ? (parseInt(decimals) * Math.pow(10, exponent)).toString()
      : decimals.substr(0, precision)
  }

  const formatNumber = fm.formatNumber = (obj) => {
    const opts = Object.assign({}, _opts, obj)
    const { number, precision, thousand, decimal, grouping } = opts
    const reg = /(\d{3})(?=\d)/g

    const negativeSign = number < 0 ? '-' : ''

    let numStr = (parseInt(Math.abs(number) || 0).toFixed(decimal)).toString()
    let mode = numStr.length > 3 ? numStr.length % grouping : 0

    let decimals = precision > 0 ? decimal + toFixed(number, precision) : ''

    return negativeSign + (mode ? numStr.substr(0, mode) + thousand : '') + numStr.substr(mode).replace(reg, '$1' + thousand) + decimals
  }

  const formatCurrency = fm.formatCurrency = (opts) => {
    const { symbol } = opts
    return symbol + formatNumber(opts)
  }

  /* --- Module Definition --- */

  // Export fm for CommonJS. If being loaded as an AMD module, define it as such.
  // Otherwise, just add `fm` to the global object
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = lib;
    }
    exports.fm = lib;
  } else if (typeof define === 'function' && define.amd) {
    // Return the library as an AMD module:
    define([], function () {
      return fm;
    });
  } else {
    // Use fm.noConflict to restore `fm` back to its original value.
    // Returns a reference to the library's `fm` object;
    // e.g. `var numbers = fm.noConflict();`
    fm.noConflict = (function (oldFm) {
      return function () {
        // Reset the value of the root's `fm` variable:
        root.fm = oldFm;
        // Delete the noConflict method:
        fm.noConflict = undefined;
        // Return reference to the library to re-assign it:
        return fm;
      };
    })(root.fm);

    // Declare `fm` on the root (global/window) object:
    root['fm'] = fm;
  }

})(this)