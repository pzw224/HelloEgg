; (function (Global) {
    var neg = function (obj) {
        var isMath = Math && obj !== Math;
        var theType = typeof (obj);
        if (!isMath || theType == "number" || theType == "string" || theType == "boolean") {
            return;
        }
        return new avatar(obj);
    };

    function avatar(obj) {
        this.target = obj;
    }

    var selfElement = (function () {
        var scripts = document.getElementsByTagName("script");
        for (var i = scripts.length - 1 ; i >= 0 ; i--) {
            var theScript = scripts[i];
            if (/NEG.0.2.2.js/.test(theScript.src)) {
                return theScript;
            }
        }
    })();

    var base = {
        avatarCore: avatar.prototype,
        base: _neg,
        baseURL: (selfElement && selfElement.src.replace(/\/[^\/]+$/, '/')) || '',
        CDNTimestamp: (selfElement && selfElement.getAttribute('data-CDNTimestamp')) || '',
        isDebug: true,
        init: function () {
            Global.NEG = neg.base.merge(neg, _neg);
            Global.NEGfixForOldVersion && base.blend(neg, Global.NEGfixForOldVersion, { cover: false });
            if (!base.isDebug) {
                delete Global.NEG.base;
                Global.NEG.VersionControl && delete Global.NEG.VersionControl;
                var freeze = Object.freeze;
                freeze && freeze(Global.NEG);
            }
        }
    }

    var _neg = { base: base };
    neg.base = base;
    neg.toString = function () { return "nesc-sh.mis.neweggec.developer.UI@newegg.com" };
    Global.NEG = _neg;
})(this);

; (function (neg) {
    "use strict";
    var internalClass = {};

internalClass._String = (function () {
    var constructor = function (str) {
        this.source = str;
    };

    var thePrototype = (function () {
        var result = {};
        var sp = String.prototype;
        var baseFn = ["valueOf", "toString", "charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "localeCompare", "match", "replace", "search", "slice", "split", "sub", "sup",
            "substring", "substr", "toLowerCase", "toLocaleLowerCase", "toUpperCase", "toLocaleUpperCase", "anchor", "link", "fontcolor", "fontsize", "big", "blink", "bold", "fixed", "italics", "small", "strike"];
        for (var i = 0; i < baseFn.length ; i++) {
            (function (arg) {
                result[arg] = function () {
                    return sp[arg].apply(this.source, arguments);
                };
            })(baseFn[i]);
        }

        //ECMAScript5 functions implement
        if ("trim" in sp && sp.trim) {
            result.trim = function () {
                return sp.trim.apply(this.source, arguments);
            };
        } else {
            result.trim = function () {
                return this.source.replace(/(^\s+)|(\s+$)/g, '');
            };
        }

        if ("trimLeft" in sp && sp.trim) {
            result.trimLeft = function () {
                return sp.trimLeft.apply(this.source, arguments);
            };
        } else {
            result.trimLeft = function () {
                return this.source.replace(/^\s+/, '');
            };
        }

        if ("trimRight" in sp && sp.trim) {
            result.trimRight = function () {
                return sp.trimRight.apply(this.source, arguments);
            };
        } else {
            result.trimRight = function () {
                return this.source.replace(/\s+$/, '');
            };
        }

        return result;
    })();


    //begin customlize function
    thePrototype.constructor = constructor;


    constructor.prototype = thePrototype;
    return constructor;
})();


internalClass._Array = (function () {
    var constructor = function (array) {
        this.source = array;
    };

    var thePrototype = (function () {
        var result = {};
        var ap = Array.prototype;
        var baseFn = ["join", "toString", "pop", "push", "concat", "reverse", "shift", "unshift", "slice", "splice", "sort"];
        for (var i = 0; i < baseFn.length ; i++) {
            (function (arg) {
                result[arg] = function () {
                    return ap[arg].apply(this.source, arguments);
                };
            })(baseFn[i]);
        }

        //ECMAScript5 functions implement
        if ("indexOf" in ap && ap.indexOf) {
            result.indexOf = function () {
                return ap.indexOf.apply(this.source, arguments);
            };
        } else {
            result.indexOf = function (obj) {
                var i = this.source.length;
                for (; i--;) {
                    if (this.source[i] === obj) {
                        break;
                    }
                }
                return i;
            };
        }
        result.addRange = function (array) {
            if (array) {
                var len = array.length;
                if (len && array instanceof Array) {
                    len > 0 && ap.push.apply(this.source, array);
                } else {
                    this.source.push(array);
                }
                return this.source.length;
            }
        };
        return result;
    })();

    //begin customlize function
    thePrototype.constructor = constructor;

    thePrototype.each = function (fn) {
        var len = this.source.length;
        for (var i = 0; i < len; i++) {
            var res = fn.apply(this.source[i], [this.source[i], i]);
            if (res) {
                break;
            }
        };
    };

    thePrototype.get = function (index) {
        if (typeof index == "number") {
            return this.source[index];
        }
        return null;
    };

    constructor.prototype = thePrototype;
    return constructor;
})();


neg.cast = function (toBeTransfered) {
    var res = null;
    var typeStr = typeof (toBeTransfered);

    //switch (typeStr) {
    //    case "string":
    //        res = new internalClass.String(toBeTransfered);
    //        break;

    //    case "number":
    //        break;

    //    case "boolean":
    //        break;

    //    case "object":
    //        if (toBeTransfered instanceof String) {
    //            res = new internalClass.String(toBeTransfered.toString());
    //        }
    //        else if (toBeTransfered instanceof Array) {
    //            res = new internalClass.Array(toBeTransfered);
    //        }

    //        break;

    //    case "undefined":
    //    default:
    //}

    if (typeStr == "string") {
        return new internalClass._String(new String(toBeTransfered));
    }
    else if (typeStr == "object") {
        if (toBeTransfered instanceof String) {
            res = new internalClass._String(toBeTransfered);
        }
        else if (toBeTransfered instanceof internalClass._String.constructor) {
            return toBeTransfered;
        }
        else if (toBeTransfered instanceof Array) {
            res = new internalClass._Array(toBeTransfered);
        }
        else if (toBeTransfered instanceof internalClass._Array.constructor) {
            return toBeTransfered;
        }
    }
    return res;
};

})(NEG);
; (function (neg) {
    base = neg.base || {};

    var ap = Array.prototype;

    var _base = {
        /**
        * @name NEG.base.merge
        * @class [merge 将其他对象赋到mainObj上]
        * @param  {Object} mainObj [merge对象到mainObj上]
        * @param  {Object} p1,p2,p3... [支持�?��merge多个对象，从第二个参数开始]
        * @return {Object}         [返回merge之后的对象]
        * @example 
        * NEG.base.merge({x:1,y:1},{z:1},{a:1})
        * 结果：返�?{x:1,y:1,z:1,a:1}
        */
        merge: function (mainObj) {
            for (var index = 1; index < arguments.length; index++) {
                var sourceObj = arguments[index];
                for (var item in sourceObj) {
                    mainObj[item] = sourceObj[item];
                }
            }
            return mainObj;
        },

        blend: function (mainObj, attrSource, options) {
            var _options = {
                cover: true,
                mergePrototype: false
            };
            options = options ? _base.merge(_options, options) : _options;
            attrSource = [].concat(attrSource);
            var sourceLength = attrSource.length;
            for (var index = 0; index < sourceLength; index++) {
                var sourceObj = attrSource[index];
                for (var item in sourceObj) {
                    var rule1 = options.mergePrototype || sourceObj.hasOwnProperty(item);
                    var rule2 = options.cover || typeof (mainObj[item]) == "undefined";
                    if (rule1 && rule2) {
                        mainObj[item] = sourceObj[item];
                    }
                }
            }
            return mainObj;
        },
        /**
        * @name NEG.base.NS
        * @class [创建命名空间]
        * @param {String} NSString [要创建的命名空间，以点号隔开(Biz.Common)]
        * @param {Object} root [参数NSString的根节点�?默认是window)]
        * @return {Object} [返回创建的对象，若已存在则直接返回]
        * @example
        * NEG.base.NS("Biz.Common").ConsoleOne=function(){console.log(1);};
        * Biz.Common.ConsoleOne();
        * 结果：输�?1
        */
        NS: function (NSString, root) {
            var nsPath = NSString.split("."), ns = root || window || {}, root = ns;
            for (var i = 0, len = nsPath.length; i < len; i++) {
                ns[nsPath[i]] = ns[nsPath[i]] || {};
                ns = ns[nsPath[i]];
            };
            return ns;
        },
        /**
        * @name NEG.base.ArrayIndexOf
        * @class [返回对象存在数组的index,不存在返�?1]
        * @param {Array} array [操作的数组]
        * @param {Object} el [查找的对象]
        * @returns {number} [返回对象存在数组的Index,不存在返�?1]
        * @example
        * NEG.base.ArrayIndexOf([1,2,3,5],3);
        * 结果：返�?2
        */
        ArrayIndexOf: ap.indexOf
                    ? function (array, el) {
                        array = [].slice.call(array, 0);
                        return array.indexOf(el);
                    }
                    : function (array, el) {
                        for (var i = array.length, isExist = false; i-- && !isExist;) {
                            isExist = array[i] === el;
                            if (isExist) {
                                return i;
                            }
                        }
                        return i;
                    },

        each: function (array, fn) {
            array = [].concat(array);
            for (var i = array.length - 1; i >= 0; i--) {
                fn.call(array[i], i, array[i]);
            };
        },

        isType: function (obj, type) {
            //return Object.toString.call(obj).indexOf('[object ' + type) == 0 || !!(obj instanceof Number);
            return (type === "Null" && obj === null) ||
                (type === "Undefined" && obj === void 0) ||
                (type === "Number" && isFinite(obj)) ||
                 Object.prototype.toString.call(obj).slice(8, -1) === type;
        },

        getGUID: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },

        // , encodeHTML: function (str) {
        //     str = _base.isType(str, 'String') ? str : '';
        //     return str.replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/\'/g, "&#039;").replace(/\"/g, "&quot;");
        // }

        // , decodeHTML: function (str) {
        //     str = _base.isType(str, 'String') ? str : '';
        //     return str.replace(/(&quot;)/g, "\"").replace(/(&#039;)/ig, "'").replace(/(&lt;)/ig, "<").replace(/(&gt;)/ig, ">").replace(/(&amp;)/ig, "&");
        // }
        //, Enum: function () {
        //    var _enum = {};
        //    for (var i = 0; i < arguments.length; i++) {
        //        _enum[arguments[i]] = arguments[i];
        //    }
        //    return _enum;
        //}
        //, documentWriteScript: function (nativeWriteMethod) {
        //    var fixWriteMethod = function (msg) {
        //        //var reg = /<script.*?\bsrc\s*=\s*[\'"](.*?)['"].*?>.*?<\s*\/script\s*>/ig;
        //        var reg = /<script[^>]*?\bsrc\s*=\s*[\'"](.*?)['"][^>]*?>.*?(<\s*?\/script\s*?>)/ig;
        //        var scripts = [];
        //        msg = msg && msg.replace(reg, function (msg, script) {
        //            script && scripts.push(script);
        //            return ''
        //        });

        //        scripts.length > 0 && neg.base.BOM.Event.addEventListener(window, 'load', function () {
        //            neg.base.BOM.loadJS(scripts);
        //        });
        //        nativeWriteMethod.call(document, msg);
        //    };

        //    return function (hasScript) {
        //        document.write = hasScript ? fixWriteMethod : nativeWriteMethod;
        //    }

        //}(document.write)        ,
        setBaseURL: function (url) {
            return neg.base.baseURL = url || neg.base.baseURL;
        },

        setCDNTimestamp: function (timestamp) {
            var base = neg.base;
            base.CDNTimestamp = timestamp || base.CDNTimestamp;
        }

        //, trim: function (str) {
        //    return str.replace(/(^\s+)|(\s+$)/g, '');
        //}
    };
    _base.merge(base, _base);
})(NEG);!function (neg) {
    var base = neg.base || {};

    var _Event = {};

    var eventList = [],
        targetList = [];

    function getTargetId(target) {
        var targetId = (targetId = base.ArrayIndexOf(targetList, target)) >= 0
                           ? targetId
                           : targetList.push(target) - 1;
        return targetId;
    };

    /**
    * @name NEG.base.Event.addEventListener
    * @class [非DOM元素 事件侦听]
    * @param {Object} target      [事件宿主]
    * @param {[type]} eventName   [事件名]
    * @param {Function} eventHandle [事件处理句柄]
    * @param {Object} option      [配置选项,option.Parameter]
    * @example
    */
    _Event.addEventListener = function (target, eventName, eventHandle, option) {

        option = option || {};
        option.Parameter = option.Parameter || [];
        //var targetList = eventList.targetList

        //获取事件目标id                
        var targetId = getTargetId(target),
        //压入事件处理句柄
            eventNames = eventList[eventName] = eventList[eventName] || {},
            eventHandles = eventNames[targetId] = eventNames[targetId] || [];
        eventHandles.eventHandleAction = eventHandles.eventHandleAction || function () { };
        var theEventHandle = { target: target, eventHandle: eventHandle, Parameter: option };
        eventHandles.push(theEventHandle);


        eventHandles.eventHandleAction = function (oldevts) {
            return function (data) {
                //var eventObjetc = {
                //    target: target
                //};
                oldevts(data);
                //eventHandle.apply(target, option.Parameter);
                eventHandle.call(theEventHandle.target, theEventHandle.target, data, theEventHandle.Parameter);
            };
        }(eventHandles.eventHandleAction, theEventHandle);
    };

    /**
    * @name NEG.base.Event.removeEventListener
    * @class [非DOM元素 移除事件侦听]
    * @param {Object} target      [事件宿主]
    * @param {[type]} eventName   [事件名]
    * @param {Function} eventHandle [事件处理句柄:若没有指定会将targetId和对应eventName的事件句柄全部清除]
    * @param {Object} option      [配置选项]
    */
    _Event.removeEventListener = function (target, eventName, eventHandle) {
        var targetId = getTargetId(target),
            eventHandles = eventList[eventName][targetId];
        eventHandles.eventHandleAction = function () { };

        var deletedNum = 0;
        var eventLen = eventHandles.length;
        for (var i = 0; i < eventLen; i++) {
            var index = i - deletedNum;
            /*
            *Modify by Ben 2012/04/28                
            *若没有指定eventHanlde,会将targetId和对应eventName的事件句柄全部清�?
            */
            if (eventHandles[index] && eventHandles[index].eventHandle == eventHandle || !eventHandle) {
                eventHandles.splice(index, 1);
                deletedNum++;
            }
            else {
                eventHandles.eventHandleAction = function (oldevts, currentHandle) {
                    return function (data) {
                        oldevts(data);
                        currentHandle.eventHandle.call(currentHandle.target, currentHandle.target, data, currentHandle.Parameter);
                    };
                }(eventHandles.eventHandleAction, eventHandles[index]);
            }
        }
    };

    /**
    * @name NEG.base.Event.dispatchEvent
    * @class [非DOM元素 事件广播]
    * @param {Object} target      [事件宿主]
    * @param {String} eventName   [事件名]
    * @param {Function} eventHandle [事件处理句柄:若没有指定会将targetId和对应eventName的事件句柄全部清除]
    * @param {Object} option      [配置选项]
    */
    _Event.dispatchEvent = function (target, eventName, data) {
        /*
        switch (arguments.length) {
        case 2:
        var targetId = getTargetId(target),
        eventNames = eventList[eventName];
        eventNames[targetId] && eventNames[targetId].eventHandleAction();
        break;
        case 1:
        eventName = arguments[0];
        for (var targetId = 0; targetId < targetList.length; targetId++) {
        var currentTarget = targetList[targetId];
        currentTarget && arguments.callee(currentTarget, eventName);
        }
        }
        */

        var eventObjetc = {
            target: target
        };
        var targetId = getTargetId(target),
            eventNames = eventList[eventName];
        //eventNames && eventNames[targetId] && eventNames[targetId].eventHandleAction(data);
        //if (eventNames && eventNames[targetId]) {
        //    for (var i = 0; i < eventNames[targetId].length; i++) {
        //        eventNames[targetId][i].eventHandle.call(target, eventObjetc, data);
        //    }
        //}
        if (eventNames && eventNames[targetId]) {
            var theEventHandleAction = eventNames[targetId].eventHandleAction;
            theEventHandleAction && theEventHandleAction(data);
        }
    };

    _Event.publicDispatchEvent = function (eventName, data) {
        for (var targetId = 0; targetId < targetList.length; targetId++) {
            var currentTarget = targetList[targetId];
            currentTarget && _Event.dispatchEvent(currentTarget, eventName, data);
        }
    };

    base.Event = base.Event || {};
    base.Event = _Event;
}(NEG);
; (function (neg) {
    var utility = {
        isType: function (obj, type) {
            //return Object.toString.call(obj).indexOf('[object ' + type) == 0 || !!(obj instanceof Number);
            return (type === "Null" && obj === null) ||
                (type === "Undefined" && obj === void 0) ||
                (type === "Number" && isFinite(obj)) ||
                 Object.prototype.toString.call(obj).slice(8, -1) === type;
        },
        getGUID: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },
        getEnum: function () {
            var _enum = {};
            for (var i = 0; i < arguments.length; i++) {
                _enum[arguments[i]] = arguments[i];
            }
            return _enum;
        },
        isDefined: function (obj) {
            return typeof (obj) != "undefined";
        }
    };

    var scriptHelper = {
        documentWriteScript: (function (nativeWriteMethod) {
            var fixWriteMethod = function (msg) {
                //var reg = /<script.*?\bsrc\s*=\s*[\'"](.*?)['"].*?>.*?<\s*\/script\s*>/ig;
                var reg = /<script[^>]*?\bsrc\s*=\s*[\'"](.*?)['"][^>]*?>.*?(<\s*?\/script\s*?>)/ig;
                var scripts = [];
                msg = msg && msg.replace(reg, function (msg, script) {
                    script && scripts.push(script);
                    return ''
                });

                scripts.length > 0 && neg.base.BOM.Event.addEventListener(window, 'load', function () {
                    neg.base.BOM.loadJS(scripts);
                });
                nativeWriteMethod.call(document, msg);
            };

            return function (hasScript) {
                document.write = hasScript ? fixWriteMethod : nativeWriteMethod;
            };

        })(document.write)
    };
    utility.Script = scriptHelper;

    neg.utility = utility;
})(NEG)
; (function (neg) {

    var environment;
    var os = { Unknown: "Unknown", Window: "Window", Mac: "Mac", Linux: "Linux", FreeBSD: "FreeBSD" };
    var device = { Unknown: "Unknown", iPhone: "iPhone", iPad: "iPad", iPod: "iPod" };
    var browserType = { Unknown: "Unknown", IE: "IE", Firefox: "Firefox", Chrome: "Chrome", Opera: "Opera", Safari: "Safari" };
    if (window) {
        var getEnvironment = function () {
            var userAgent = neg.cast(window.navigator.userAgent);

            var p = (function () {
                return neg.cast(window.location.protocol).trimRight(":");
            })();

            var operationSys = (function () {
                if (/Win/.test(userAgent)) {
                    return os.Window;
                }
                if (/Mac/.test(userAgent)) {
                    return os.Mac;
                }
                if (/Linux/.test(userAgent)) {
                    return os.Linux;
                }
                if (/FreeBSD/.test(userAgent)) {
                    return os.FreeBSD;
                }
                return os.Unknown;
            })();

            var browser = (function () {
                if (/MSIE/.test(userAgent)) {
                    var appNameBegin = userAgent.indexOf("MSIE");
                    var appNameEnd = userAgent.indexOf(";", appNameBegin);
                    var ver = parseFloat(userAgent.substring(appNameBegin + 5, appNameEnd));
                    return { name: browserType.IE, version: ver };
                }
                if (/Firefox/.test(userAgent)) {
                    var ver = parseFloat(userAgent.substring(userAgent.indexOf("Firefox") + 8));
                    return { name: browserType.Firefox, version: ver };
                }
                if (/Chrome/.test(userAgent)) {
                    var ver = parseFloat(userAgent.substring(userAgent.indexOf("Chrome") + 7));
                    return { name: browserType.Chrome, version: ver };
                }
                if (/Safari/.test(userAgent)) {
                    var ver = parseFloat(userAgent.substring(userAgent.indexOf("Safari") + 7));
                    return { name: browserType.Safari, version: ver };
                }
                if (/Opera/.test(userAgent)) {
                    var ver = parseFloat(userAgent.substring(userAgent.indexOf("Opera") + 6));
                    return { name: browserType.Opera, version: ver };
                }
                return { name: browserType.Unknown, version: null };
            })();

            var d = (function () {
                if (/iPhone/.test(userAgent)) {
                    return device.iPhone;
                }
                if (/iPad/.test(userAgent)) {
                    return device.iPad;
                }
                if (/iPod/.test(userAgent)) {
                    return device.iPod;
                }
                return device.Unknown;
            })();

            return {
                protocol: p,
                os: operationSys,
                browserInfo: browser,
                device: d
            };
        };


        environment = {
            refresh: function () {
                neg.base.blend(environment, getEnvironment(), { cover: true, mergePrototype: false });
            }
        };

        neg.base.blend(environment, getEnvironment(), { cover: true, mergePrototype: false });
    }
    neg.utility && (neg.utility.Environment = environment);
})(NEG)
; (function (neg) {
    var ap = Array.prototype;
    var arrayHelper = {
        indexOf: ap.indexOf
                   ? function (array, el) {
                       array = [].slice.call(array, 0);
                       return array.indexOf(el);
                   }
                   : function (array, el) {
                       for (var i = array.length, isExist = false; i-- && !isExist;) {
                           isExist = array[i] === el;
                           if (isExist) {
                               return i;
                           }
                       }
                       return i;
                   },

        each: function (array, fn) {
            array = [].concat(array);
            for (var i = array.length - 1; i >= 0; i--) {
                fn.call(array[i], i, array[i]);
            };
        }
    };
    neg.utility && (neg.utility.Array = arrayHelper);
})(NEG)
; (function (neg) {

    var entityTable = {
        // 34: "&quot;",     // Quotation mark. Not required
        38: "&amp;",        // Ampersand. Applied before everything else in the application
        60: "&lt;",     // Less-than sign
        62: "&gt;",     // Greater-than sign
        // 63: "&#63;",      // Question mark
        // 111: "&#111;",        // Latin small letter o
        160: "&nbsp;",      // Non-breaking space
        161: "&iexcl;",     // Inverted exclamation mark
        162: "&cent;",      // Cent sign
        163: "&pound;",     // Pound sign
        164: "&curren;",    // Currency sign
        165: "&yen;",       // Yen sign
        166: "&brvbar;",    // Broken vertical bar
        167: "&sect;",      // Section sign
        168: "&uml;",       // Diaeresis
        169: "&copy;",      // Copyright sign
        170: "&ordf;",      // Feminine ordinal indicator
        171: "&laquo;",     // Left-pointing double angle quotation mark
        172: "&not;",       // Not sign
        173: "&shy;",       // Soft hyphen
        174: "&reg;",       // Registered sign
        175: "&macr;",      // Macron
        176: "&deg;",       // Degree sign
        177: "&plusmn;",    // Plus-minus sign
        178: "&sup2;",      // Superscript two
        179: "&sup3;",      // Superscript three
        180: "&acute;",     // Acute accent
        181: "&micro;",     // Micro sign
        182: "&para;",      // Pilcrow sign
        183: "&middot;",    // Middle dot
        184: "&cedil;",     // Cedilla
        185: "&sup1;",      // Superscript one
        186: "&ordm;",      // Masculine ordinal indicator
        187: "&raquo;",     // Right-pointing double angle quotation mark
        188: "&frac14;",    // Vulgar fraction one-quarter
        189: "&frac12;",    // Vulgar fraction one-half
        190: "&frac34;",    // Vulgar fraction three-quarters
        191: "&iquest;",    // Inverted question mark
        192: "&Agrave;",    // A with grave
        193: "&Aacute;",    // A with acute
        194: "&Acirc;",     // A with circumflex
        195: "&Atilde;",    // A with tilde
        196: "&Auml;",      // A with diaeresis
        197: "&Aring;",     // A with ring above
        198: "&AElig;",     // AE
        199: "&Ccedil;",    // C with cedilla
        200: "&Egrave;",    // E with grave
        201: "&Eacute;",    // E with acute
        202: "&Ecirc;",     // E with circumflex
        203: "&Euml;",      // E with diaeresis
        204: "&Igrave;",    // I with grave
        205: "&Iacute;",    // I with acute
        206: "&Icirc;",     // I with circumflex
        207: "&Iuml;",      // I with diaeresis
        208: "&ETH;",       // Eth
        209: "&Ntilde;",    // N with tilde
        210: "&Ograve;",    // O with grave
        211: "&Oacute;",    // O with acute
        212: "&Ocirc;",     // O with circumflex
        213: "&Otilde;",    // O with tilde
        214: "&Ouml;",      // O with diaeresis
        215: "&times;",     // Multiplication sign
        216: "&Oslash;",    // O with stroke
        217: "&Ugrave;",    // U with grave
        218: "&Uacute;",    // U with acute
        219: "&Ucirc;",     // U with circumflex
        220: "&Uuml;",      // U with diaeresis
        221: "&Yacute;",    // Y with acute
        222: "&THORN;",     // Thorn
        223: "&szlig;",     // Sharp s. Also known as ess-zed
        224: "&agrave;",    // a with grave
        225: "&aacute;",    // a with acute
        226: "&acirc;",     // a with circumflex
        227: "&atilde;",    // a with tilde
        228: "&auml;",      // a with diaeresis
        229: "&aring;",     // a with ring above
        230: "&aelig;",     // ae. Also known as ligature ae
        231: "&ccedil;",    // c with cedilla
        232: "&egrave;",    // e with grave
        233: "&eacute;",    // e with acute
        234: "&ecirc;",     // e with circumflex
        235: "&euml;",      // e with diaeresis
        236: "&igrave;",    // i with grave
        237: "&iacute;",    // i with acute
        238: "&icirc;",     // i with circumflex
        239: "&iuml;",      // i with diaeresis
        240: "&eth;",       // eth
        241: "&ntilde;",    // n with tilde
        242: "&ograve;",    // o with grave
        243: "&oacute;",    // o with acute
        244: "&ocirc;",     // o with circumflex
        245: "&otilde;",    // o with tilde
        246: "&ouml;",      // o with diaeresis
        247: "&divide;",    // Division sign
        248: "&oslash;",    // o with stroke. Also known as o with slash
        249: "&ugrave;",    // u with grave
        250: "&uacute;",    // u with acute
        251: "&ucirc;",     // u with circumflex
        252: "&uuml;",      // u with diaeresis
        253: "&yacute;",    // y with acute
        254: "&thorn;",     // thorn
        255: "&yuml;",      // y with diaeresis
        264: "&#264;",      // Latin capital letter C with circumflex
        265: "&#265;",      // Latin small letter c with circumflex
        338: "&OElig;",     // Latin capital ligature OE
        339: "&oelig;",     // Latin small ligature oe
        352: "&Scaron;",    // Latin capital letter S with caron
        353: "&scaron;",    // Latin small letter s with caron
        372: "&#372;",      // Latin capital letter W with circumflex
        373: "&#373;",      // Latin small letter w with circumflex
        374: "&#374;",      // Latin capital letter Y with circumflex
        375: "&#375;",      // Latin small letter y with circumflex
        376: "&Yuml;",      // Latin capital letter Y with diaeresis
        402: "&fnof;",      // Latin small f with hook, function, florin
        710: "&circ;",      // Modifier letter circumflex accent
        732: "&tilde;",     // Small tilde
        913: "&Alpha;",     // Alpha
        914: "&Beta;",      // Beta
        915: "&Gamma;",     // Gamma
        916: "&Delta;",     // Delta
        917: "&Epsilon;",   // Epsilon
        918: "&Zeta;",      // Zeta
        919: "&Eta;",       // Eta
        920: "&Theta;",     // Theta
        921: "&Iota;",      // Iota
        922: "&Kappa;",     // Kappa
        923: "&Lambda;",    // Lambda
        924: "&Mu;",        // Mu
        925: "&Nu;",        // Nu
        926: "&Xi;",        // Xi
        927: "&Omicron;",   // Omicron
        928: "&Pi;",        // Pi
        929: "&Rho;",       // Rho
        931: "&Sigma;",     // Sigma
        932: "&Tau;",       // Tau
        933: "&Upsilon;",   // Upsilon
        934: "&Phi;",       // Phi
        935: "&Chi;",       // Chi
        936: "&Psi;",       // Psi
        937: "&Omega;",     // Omega
        945: "&alpha;",     // alpha
        946: "&beta;",      // beta
        947: "&gamma;",     // gamma
        948: "&delta;",     // delta
        949: "&epsilon;",   // epsilon
        950: "&zeta;",      // zeta
        951: "&eta;",       // eta
        952: "&theta;",     // theta
        953: "&iota;",      // iota
        954: "&kappa;",     // kappa
        955: "&lambda;",    // lambda
        956: "&mu;",        // mu
        957: "&nu;",        // nu
        958: "&xi;",        // xi
        959: "&omicron;",   // omicron
        960: "&pi;",        // pi
        961: "&rho;",       // rho
        962: "&sigmaf;",    // sigmaf
        963: "&sigma;",     // sigma
        964: "&tau;",       // tau
        965: "&upsilon;",   // upsilon
        966: "&phi;",       // phi
        967: "&chi;",       // chi
        968: "&psi;",       // psi
        969: "&omega;",     // omega
        977: "&thetasym;",  // Theta symbol
        978: "&upsih;",     // Greek upsilon with hook symbol
        982: "&piv;",       // Pi symbol
        8194: "&ensp;",     // En space
        8195: "&emsp;",     // Em space
        8201: "&thinsp;",   // Thin space
        8204: "&zwnj;",     // Zero width non-joiner
        8205: "&zwj;",      // Zero width joiner
        8206: "&lrm;",      // Left-to-right mark
        8207: "&rlm;",      // Right-to-left mark
        8211: "&ndash;",    // En dash
        8212: "&mdash;",    // Em dash
        8216: "&lsquo;",    // Left single quotation mark
        8217: "&rsquo;",    // Right single quotation mark
        8218: "&sbquo;",    // Single low-9 quotation mark
        8220: "&ldquo;",    // Left double quotation mark
        8221: "&rdquo;",    // Right double quotation mark
        8222: "&bdquo;",    // Double low-9 quotation mark
        8224: "&dagger;",   // Dagger
        8225: "&Dagger;",   // Double dagger
        8226: "&bull;",     // Bullet
        8230: "&hellip;",   // Horizontal ellipsis
        8240: "&permil;",   // Per mille sign
        8242: "&prime;",    // Prime
        8243: "&Prime;",    // Double Prime
        8249: "&lsaquo;",   // Single left-pointing angle quotation
        8250: "&rsaquo;",   // Single right-pointing angle quotation
        8254: "&oline;",    // Overline
        8260: "&frasl;",    // Fraction Slash
        8364: "&euro;",     // Euro sign
        8472: "&weierp;",   // Script capital
        8465: "&image;",    // Blackletter capital I
        8476: "&real;",     // Blackletter capital R
        8482: "&trade;",    // Trade mark sign
        8501: "&alefsym;",  // Alef symbol
        8592: "&larr;",     // Leftward arrow
        8593: "&uarr;",     // Upward arrow
        8594: "&rarr;",     // Rightward arrow
        8595: "&darr;",     // Downward arrow
        8596: "&harr;",     // Left right arrow
        8629: "&crarr;",    // Downward arrow with corner leftward. Also known as carriage return
        8656: "&lArr;",     // Leftward double arrow. ISO 10646 does not say that lArr is the same as the 'is implied by' arrow but also does not have any other character for that function. So ? lArr can be used for 'is implied by' as ISOtech suggests
        8657: "&uArr;",     // Upward double arrow
        8658: "&rArr;",     // Rightward double arrow. ISO 10646 does not say this is the 'implies' character but does not have another character with this function so ? rArr can be used for 'implies' as ISOtech suggests
        8659: "&dArr;",     // Downward double arrow
        8660: "&hArr;",     // Left-right double arrow
        // Mathematical Operators
        8704: "&forall;",   // For all
        8706: "&part;",     // Partial differential
        8707: "&exist;",    // There exists
        8709: "&empty;",    // Empty set. Also known as null set and diameter
        8711: "&nabla;",    // Nabla. Also known as backward difference
        8712: "&isin;",     // Element of
        8713: "&notin;",    // Not an element of
        8715: "&ni;",       // Contains as member
        8719: "&prod;",     // N-ary product. Also known as product sign. Prod is not the same character as U+03A0 'greek capital letter pi' though the same glyph might be used for both
        8721: "&sum;",      // N-ary summation. Sum is not the same character as U+03A3 'greek capital letter sigma' though the same glyph might be used for both
        8722: "&minus;",    // Minus sign
        8727: "&lowast;",   // Asterisk operator
        8729: "&#8729;",    // Bullet operator
        8730: "&radic;",    // Square root. Also known as radical sign
        8733: "&prop;",     // Proportional to
        8734: "&infin;",    // Infinity
        8736: "&ang;",      // Angle
        8743: "&and;",      // Logical and. Also known as wedge
        8744: "&or;",       // Logical or. Also known as vee
        8745: "&cap;",      // Intersection. Also known as cap
        8746: "&cup;",      // Union. Also known as cup
        8747: "&int;",      // Integral
        8756: "&there4;",   // Therefore
        8764: "&sim;",      // tilde operator. Also known as varies with and similar to. The tilde operator is not the same character as the tilde, U+007E, although the same glyph might be used to represent both
        8773: "&cong;",     // Approximately equal to
        8776: "&asymp;",    // Almost equal to. Also known as asymptotic to
        8800: "&ne;",       // Not equal to
        8801: "&equiv;",    // Identical to
        8804: "&le;",       // Less-than or equal to
        8805: "&ge;",       // Greater-than or equal to
        8834: "&sub;",      // Subset of
        8835: "&sup;",      // Superset of. Note that nsup, 'not a superset of, U+2283' is not covered by the Symbol font encoding and is not included.
        8836: "&nsub;",     // Not a subset of
        8838: "&sube;",     // Subset of or equal to
        8839: "&supe;",     // Superset of or equal to
        8853: "&oplus;",    // Circled plus. Also known as direct sum
        8855: "&otimes;",   // Circled times. Also known as vector product
        8869: "&perp;",     // Up tack. Also known as orthogonal to and perpendicular
        8901: "&sdot;",     // Dot operator. The dot operator is not the same character as U+00B7 middle dot
        // Miscellaneous Technical
        8968: "&lceil;",    // Left ceiling. Also known as an APL upstile
        8969: "&rceil;",    // Right ceiling
        8970: "&lfloor;",   // left floor. Also known as APL downstile
        8971: "&rfloor;",   // Right floor
        9001: "&lang;",     // Left-pointing angle bracket. Also known as bra. Lang is not the same character as U+003C 'less than'or U+2039 'single left-pointing angle quotation mark'
        9002: "&rang;",     // Right-pointing angle bracket. Also known as ket. Rang is not the same character as U+003E 'greater than' or U+203A 'single right-pointing angle quotation mark'
        // Geometric Shapes
        9642: "&#9642;",    // Black small square
        9643: "&#9643;",    // White small square
        9674: "&loz;",      // Lozenge
        // Miscellaneous Symbols
        9702: "&#9702;",    // White bullet
        9824: "&spades;",   // Black (filled) spade suit
        9827: "&clubs;",    // Black (filled) club suit. Also known as shamrock
        9829: "&hearts;",   // Black (filled) heart suit. Also known as shamrock
        9830: "&diams;"   // Black (filled) diamond suit
    };
    var encodingHelper = {
        encodeHTML: function (str) {
            var res;
            if (neg.utility.isType(str, 'String')) {
                res = str;
            } else {
                return "";
            }
            res = res.replace(new RegExp(String.fromCharCode(38), "g"), entityTable[38]);
            for (var i in entityTable) {
                if (i != 38) {
                    res = res.replace(new RegExp(String.fromCharCode(i), "g"), entityTable[i]);
                }
            }
            return res;
        },
        decodeHTML: function (str) {
            var res;
            if (neg.utility.isType(str, 'String')) {
                res = str;
            } else {
                return "";
            }
            res = res.replace(new RegExp(entityTable[38], "g"), String.fromCharCode(38));
            for (var i in entityTable) {
                if (i != 38) {
                    res = res.replace(new RegExp(entityTable[i], "g"), String.fromCharCode(i));
                }
            }
            return res;
        },
        coventEntityToCharacters: function (str) {
            var res;
            if (neg.utility.isType(str, 'String')) {
                res = str;
            } else {
                return "";
            }


            for (var i in entityTable) {
                if (i != 38) {
                    res = res.replace(new RegExp(entityTable[i], "g"), String.fromCharCode(i));
                }
            }
            res = res.replace(new RegExp("&#(x?)(\\d+);", "g"), function (match, p1, p2, temp) {
                return String.fromCharCode(((p1 == 'x') ? parseInt(p2, 16) : p2));
            });
            res = res.replace(new RegExp(entityTable[38], "g"), String.fromCharCode(38));
            return res;
        }
    };
    neg.utility && (neg.utility.Encoding = encodingHelper);

})(NEG)
; (function (neg) {
    var stringHelper = {
        trim: function (str) {
            return str.replace(/(^\s+)|(\s+$)/g, '');
        }
    };
    neg.utility && (neg.utility.String = stringHelper);
})(NEG); (function (neg) {
    var theUtility = neg.utility;

    var vc = (function () {
        var versions = [],  theModules = neg.cast([]);

        return {
            getVersion: function (module) {
                var result = "";
                if (module) {
                    var moduleName = neg.cast(module).trim();
                    if (moduleName) {
                        moduleName = moduleName.toLowerCase();
                        var index = theModules.indexOf(moduleName);
                        if (index > -1) {
                            return versions[index];
                        }
                    }
                } else {
                    for (var i = 0; i < versions.length; i++) {
                        result += (theModules.get(i) + ":" + versions[i]) + "  ";
                    }

                }
                return result;
            },
            setVersion: function (versionInfo) {
                var info = [].concat(versionInfo);
                if (info.length > 0) {
                    for (var i = 0; i < info.length; i++) {
                        var item = info[i];
                        if (theUtility.isDefined(item.version) && theUtility.isDefined(item.module)) {
                            var moduleName = neg.cast(item.module).trim();
                            if (moduleName) {
                                moduleName = moduleName.toLowerCase();
                                if (theModules.indexOf(moduleName) == -1) {
                                    theModules.push(moduleName);
                                    versions.push(neg.cast(item.version).trim());
                                }
                            }
                        }
                    }
                }
            }
        };
    })();

    neg.VersionControl = vc;
})(NEG)
; (function (neg) {
    //var publicDispatchEvent = neg.base.Event.publicDispatchEvent;

    //定义事件
    var requireEvent = {
        COMPLETE: 'require_complete_' + ~~new Date(),
        LOADED: 'require_loaded_' + ~~new Date(),
        REQUIRING: 'require_requiring_' + ~~new Date()
    };

    //定义队列    
    var queue = {
        requiring: {}, //正在加载的模�?
        required: {},  //已加载完毕但未构造的模块
        moduleLoaded: {}, //加载并构造完毕的模块
        requireQueue: []  //模块加载意向清单
    };


    //监听模块加载状�?，当模块通过 require 方法以外的其他形式加载时，应通过此事件�?知require 记录
    neg.base.Event.addEventListener(queue, requireEvent.REQUIRING, function (e, data) {
        var moduleName = data.moduleName.toLowerCase();
        queue.requireQueue[moduleName] || queue.requireQueue.push(moduleName);
        queue.required[moduleName] = true;
    });



    //判断预期加载的模块是否已全部构�?完毕
    function isRequireComplete(moduleName) {
        var result;
        if (moduleName) {
            return queue.moduleLoaded[moduleName]
        }

        for (var i = 0, len = queue.requireQueue.length; i < len; i++) {
            //if(!neg.base.NS('ModuleLoaded',neg.base)[queue.requireQueue[i]]){
            var module = queue.requireQueue[i];
            if (!queue.moduleLoaded[module]) {
                return false;
            }
        };
        return true;
    }


    function publicDispatchCompleteEvent() { //此方法待重构
        neg.base.Event.publicDispatchEvent(requireEvent.COMPLETE);
        //neg.base.BOM.Event.dispatchEvent(document, 'readystatechange'); //for 蓝线与红线之间的NEG.domReady 
        //neg.base.BOM.Event.dispatchEvent(document, 'DOMContentLoaded'); //for 蓝线与红线之间的NEG.domReady 
        publicDispatchCompleteEvent = function () {
            neg.base.Event.publicDispatchEvent(requireEvent.COMPLETE);
        }
    }

    /**
    * @name require
    * @class [NEG 模块加载器]
    * @param {String} module [模块命名空间]
    * @param {String} url [可�?，模块文件路径]
    */
    var require = function (module, url) {
        //缓存原始命名空间�?
        var _module = module;

        //去除命名空间大小写敏�?
        module = module.toLowerCase();

        // 跳过已加载的模块
        if (queue.required[module] || queue.requiring[module] || queue.moduleLoaded[module]) {
            //return true;
            return neg.base.NS(module, neg.base);
        }


        var parseModule = (function () {
            var result;
            if (neg.VersionControl) {
                var vc = neg.VersionControl;
                result = function (module) {
                    var version = vc.getVersion(module);
                    version = version && ("." + version);
                    return neg.base.baseURL + module.replace(/\./ig, '/') + version + '.js';
                };
            } else {
                result = function (module) {
                    var ns = module.match(/(^.*)(\.\w*)$/);
                    var nsPath = ns[1];
                    var moduleName = ns[2];
                    var CDNTimestamp = neg.base.CDNTimestamp || '';
                    CDNTimestamp = CDNTimestamp && '?' + CDNTimestamp;
                    return neg.base.baseURL + module.replace(/\./ig, '/') + '.js' + CDNTimestamp;
                };
            }
            return result;
        })();


        //获取模块URL，实参优先级高于模块命名空间解析（此处URL�?��区分大小写）
        url = url || parseModule(_module);


        module = module.toLowerCase();

        //记录模块加载意向
        queue.requireQueue[module] = true;
        queue.requireQueue.push(module);

        //压入require队列，开始加载URL
        function startLoad(module) {
            if (!isRequire(module)) {
                queue.requiring[module] = true;  //注册正在加载的模�?
                neg.base.BOM.loadJS(url, function () {
                    // queue.required[module] = true; //注册已加载完毕的模块
                    // 校验模块有效�?
                    if (!queue.required[module]) {
                        throw new Error("module [" + module + "] is undefined! @" + url);
                    }

                    isRequireComplete() && publicDispatchCompleteEvent(); //如果�?��预期加载的模块都已构造完毕，则广播COMPLETE事件
                });
            }
        }



        //判断模块是否已经加载�?
        // return : ture 为已加载过， false 为尚未加�?
        function isRequire(module) {
            //return queue.required[module] || queue.requiring[module] || neg.base.NS('ModuleLoaded',neg.base)[module];
            return queue.required[module] || queue.requiring[module] || queue.moduleLoaded[module];
        }



        startLoad(module); //尝试启动加载
        return neg.base.NS(module, neg.base);
    };


    //监听模块加载状�?，当模块加载并构造完毕时出发回调
    neg.base.Event.addEventListener(require, requireEvent.LOADED, function (e, data) {
        var moduleName = data.moduleName.toLowerCase();
        queue.required[moduleName] = true;
        queue.moduleLoaded[moduleName] = true;
        isRequireComplete() && publicDispatchCompleteEvent();
    });

    require.Event = requireEvent;
    require.isRequireComplete = isRequireComplete;
    neg.base.Require = require;
})(NEG);
; (function (neg) {
    /**
    * @name NEG.Module
    * @class [NEG 模块构�?器]
    * @param {String} nsString [模块命名空间]
    * @param {Function} module [模块逻辑代码]
    */
    var loaded = {}
    function _module(nsString, module) {
        "use strict"
        var _base = neg.base;
        //发布消息：模块开始构造，但未构�?完成
        _base.Event.publicDispatchEvent(_base.Require.Event.REQUIRING, { moduleName: nsString });

        //获得模块文件相对路径及文件名
        var ns = nsString.match(/(^.*)\.(\w*)$/);
        var nsPath = ns[1];
        var moduleName = ns[2];


        //var fnBody = module.toString().replace(/\/\*[\w\W]*?\*\/|\/\/.*/igm,'');

        //remove multi-line comment
        var fnBody = module.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//igm, '');

        //remove single line comment
        fnBody = fnBody.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g, function (str, isString) {
            return isString ? str : ''
        });

        //var requireName = fnBody.match(/^function\s\(\b(\w+)\b/);

        var requireName = fnBody.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/i, function (fnbody, reqName) {
            return reqName;
        }).replace(fnBody, '');
        var reg = requireName && new RegExp("\\b" + requireName + "\\s*\\(([^\\)]+)\\)", "igm");

        var requireQueue = [];
        reg && fnBody.replace(reg, function (requireString, nsPath) {
            var dependence = nsPath.replace(/['"]/g, '');
            var idependence = dependence.toLowerCase();
            loaded[idependence] || (requireQueue[idependence] = requireQueue.push(idependence) - 1);
            neg.base.Require(dependence);
            //neg.base.Require(requireQueue[i]);
        });


        requireQueue.length && neg.base.Event.addEventListener(nsString, neg.base.Require.Event.LOADED, function (e, data) {
            var moduleName = data.moduleName.toLowerCase();
            if (requireQueue.hasOwnProperty(moduleName)) {
                //delete requireQueue[requireQueue.splice(requireQueue[moduleName],1)];
                delete requireQueue[moduleName];
                requireQueue.splice(requireQueue[moduleName], 1);
            }
            if (requireQueue.length <= 0) {
                neg.base.Event.removeEventListener(nsString, neg.base.Require.Event.LOADED);
                action();
            }
        });

        requireQueue.length || action();

        function action() {
            var _module = moduleName.toLowerCase(),
                _nsPath = nsPath.toLowerCase();
            var _base = neg.base,
                ns = _base.NS;
            var activeModule = _base.NS(nsPath.toLowerCase(), _base)[_module];
            var moduleAPI = module(_base.Require, _base.run);
            if (activeModule) { //如果当前模块已作为父级节点存�?
                if (typeof (moduleAPI) == 'function') {
                    ns(_nsPath, _base)[_module] = _base.merge(moduleAPI, activeModule);
                } else {
                    _base.merge(activeModule, moduleAPI);
                }
            } else {
                ns(_nsPath, _base)[_module] = moduleAPI;
            }

            //登记已经构�?好的模块，并广播通知
            //_base.NS('ModuleLoaded',_base)[nsString] = true;
            loaded[nsString.toLowerCase()] = true;
            _base.Event.publicDispatchEvent(_base.Require.Event.LOADED, { moduleName: nsString });

        }

    }
    neg.base.Module = _module;
})(NEG);
;(function (neg) {
    var runnerQueue = [];
    var eventer = neg.base.Event;
    var requireEvent = neg.base.Require.Event;
    function runnerAction() {
        while (function () {
            var activeRunner = runnerQueue.shift();
            activeRunner && activeRunner();
            return runnerQueue.length;
        }()) { };
    };
    eventer.addEventListener(this, requireEvent.COMPLETE, runnerAction);

    var _run = function () {
        var requireOfRun = [];
        var runBody;
        function isRequireComplete() {
            for (var i = 0; i < requireOfRun.length; i++) {
                var moduleName = requireOfRun[i];
                if (!requireOfRun[moduleName] && !neg.base.Require.isRequireComplete(moduleName)) {
                    return false;
                }
            }
            return true;
        }

        //监听模块加载状�?，当模块加载并构造完毕时出发回调
        this.runNow && eventer.addEventListener(this, requireEvent.LOADED, function (e, data) {
            var moduleName = data.moduleName.toLowerCase();
            requireOfRun[moduleName] = true;
            neg.base.ArrayIndexOf(requireOfRun, moduleName)>=0 && isRequireComplete() && runBody && runBody();
        });

        this.run = function (runner) {
            runBody = runner;
            

            if (this.runNow) {
                isRequireComplete() && runner();
            } else {
                runnerQueue.push(runner);
                neg.base.Require.isRequireComplete() && runnerAction();
            }
        };

        this.require = function (module,url) {
            neg.base.Require(module,url);

            module = module.toLowerCase();
            requireOfRun.push(module);
            if(!url){
                var ns = module.match(/(^.*)\.(\w*)$/);
                var nsPath = ns[1];
                var moduleName = ns[2];
                neg.base.NS(nsPath,neg.base)[moduleName];
            }

            
            var moduleBody = neg.base.NS(module,neg.base);
            return  moduleBody;
        };
     

    }

    var run = function (fn, runNow) {
        "use strict"
        var me = run;
        if (!(this instanceof me)) {
            return new me(fn, runNow);
        }
        
        var context = this;
        context.runNow = runNow;
        _run.call(context);

        //remove multi-line comment
        var fnBody = fn.toString().replace(/(?!['"])\/\*[\w\W]*?\*\//igm, '');

        //remove single line comment
        fnBody = fnBody.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g, function (str, isString) {
            return isString ? str : ''
        });

        var requireName = fnBody.replace(/^function\s*?\(\s*?([^,\)]+)[\w\W]*$/i, function(fnbody, reqName){
                              return reqName ;
                            }).replace(fnBody,'');
        var reg = requireName && new RegExp("\\b" + requireName + "\\s*\\(([^\\)]+)\\)","igm");
        var requireQueue = [];
        reg && fnBody.replace(reg, function(requireString,nsPath){
            var moduleName = nsPath.replace(/['"]/g, '');
            context.require(moduleName);
        });

        
        context.run(function(){
            fn(context.require, context.run);
        });
        
    };

    /**
    * @name NEG.base.run
    * @class [NEG的沙箱环境]
    * @param  {Fcuntion} fn [函数句柄]
    * @example 
    */
    neg.base.run = run;
})(NEG);; (function (NEG) {
    var base = NEG.base || {};
    var eventHandelList = {};
    function eventHandlePlus(dom, eventType, eventHandle) {
        return function (eventObject) {
            eventHandle.call(dom, eventObject);
        };
    }


    function updateEventAction(dom, eventType, eventHandle) {
        var eventHandles = eventHandelList[dom.GUID][eventType];
        function update(activeAction) {
            eventHandles.eventAction = function (eventAction, activeAction) {
                return function (eventObject) {
                    eventAction && eventAction.call(dom, eventObject);
                    activeAction.call(dom, eventObject);
                };
            }(eventHandles.eventAction, activeAction);
        }

        if (eventHandle) {
            update(eventHandle);
        }
        else {
            for (var i = 0; i < eventHandles.length; i++) {
                update(eventHandles[i]);
            }
        }
        return eventHandles.eventAction;
    }

    /**
    * @name NEG.base.BOM.Event.addEventListener
    * @class [DOM元素 事件侦听]
    * @param {[type]} dom         [事件宿主]
    * @param {[type]} eventType   [事件名]
    * @param {[type]} eventHandle [事件处理句柄]
    * @param {[type]} option      [配置选项,option.Parameter]
    */
    function addEventListener(dom, eventType, eventHandle, option) {
        option = option || {};
        dom.GUID = dom.GUID || base.getGUID();
        var eventHandles = base.NS(dom.GUID, eventHandelList)[eventType] = (base.NS(dom.GUID, eventHandelList)[eventType] || []);
        var fixFn = eventHandlePlus(dom, eventType, eventHandle);
        eventHandles.push(fixFn);
        if (eventHandles[eventHandle]) {
            var temp = [];
            temp.push(eventHandles[eventHandle]);
            temp.push(fixFn);
            eventHandles[eventHandle] = temp;
        } else {
            eventHandles[eventHandle] = fixFn;
        }
        eventHandles.eventAction = updateEventAction(dom, eventType, fixFn);

        if (dom.addEventListener) {
            dom.addEventListener(eventType, fixFn, false);
        }
        else if (dom.attachEvent) {
            dom.attachEvent('on' + eventType, fixFn);
        }

        /*else {
           var handle = dom['on' + eventType];
           if (typeof handle == 'function') {
               dom['on' + eventType] = function () {
                   handle();
                   fixFn();
               }
           } else {
               dom['on' + eventType] = fixFn;
           }
       }*/
    }

    /**
    * @name NEG.base.BOM.Event.removeEventListener
    * @class [DOM元素 移除事件侦听]
    * @param {[type]} dom         [事件宿主]
    * @param {[type]} eventType   [事件名]
    * @param {[type]} eventHandle [事件处理句柄:若没有指定会将targetId和对应eventName的事件句柄全部清除]
    * @param {[type]} option      [配置选项]
    */

    function removeEventListener(dom, eventType, theEventHandle, option) {
        option = option || {};
        var eventHandleToBeRemoved = eventHandelList[dom.GUID][eventType][theEventHandle];

        var removeEventHandle = function (eventHandle) {
            if (eventType && eventHandle) {
                if (dom.removeEventListener) {
                    dom.removeEventListener(eventType, eventHandle, false);
                } else if (dom.detachEvent) {
                    dom.detachEvent('on' + eventType, eventHandle);
                }
                //action.splice(base.ArrayIndexOf(action,eventHandle),1);
            } else if (eventType && !eventHandle) {
                //delete eventHandelList[dom.GUID][eventType];
                for (var i = 0; i < eventHandelList[dom.GUID][eventType].length; i++) {
                    removeEventListener(dom, eventType, eventHandelList[dom.GUID][eventType][i], option);
                }
                ;
            } else {
                var typeList = eventHandelList[dom.GUID];
                //delete eventHandelList[dom.GUID];
                for (var eventTypeItem in typeList) {
                    removeEventListener(dom, eventTypeItem);
                }
            }
        };
        if (NEG.utility.isType(eventHandleToBeRemoved, "Array")) {
            for (var i = 0; i < eventHandleToBeRemoved.length; i++) {
                removeEventHandle(eventHandleToBeRemoved[i]);
            }
        } else {
            removeEventHandle(eventHandleToBeRemoved);
        }
    }

    /**
    * @name NEG.base.BOM.Event.dispatchEvent
    * @class [DOM元素 广播事件]
    * @param {[type]} dom         [事件宿主]
    * @param {[type]} eventType   [事件名]
    * @param {[type]} option      [配置选项]
    */
    function dispatchEvent(dom, eventType, option) {
        option = option || { bubbles: false, cancelable: false };
        option.ieHack = dom.all && dom.all.toString(); // 规避 IE 异常，当 dom 不在DOM树时，IE7�?fireEVent会抛出异常；此处采用赋�?操作以避免js压缩时清除冗余语句；


        if (document.createEvent) {
            var evt = document.createEvent("Event");
            evt.initEvent(eventType, option.bubbles, option.cancelable);
            dom.dispatchEvent(evt);
        }
        else if (document.createEventObject) {
            eventType = 'on' + eventType;
            var evt = document.createEventObject();
            evt.cancelBubble = option.cancelable;
            dom.fireEvent(eventType, evt);
        }
    }

    /**
    * @name NEG.base.BOM.Event.isEventSupported
    * @class [isEventSupported 判断指定HTML元素是否原生支持指定事件]
    * @param  {[HTMLElement]}  dom       [目标HTML元素]
    * @param  {[string]}  eventType [事件名]
    * @param  {[object]}  option    [扩展选项]
    * @return {Boolean}           [支持返回true ，不支持返回false]
    */
    function isEventSupported(dom, eventType, option) {
        if (!base.BOM.Utility.isHTMLElement(dom)) { return false }
        option = option || {};

        var elementName = dom.tagName;
        var eventType = 'on' + eventType;
        dom = (dom === window) ?
            window :
                  document.createElement(elementName);

        var isSupported = (eventType in dom);

        if (!isSupported && ("setAttribute" in window)) {
            dom.setAttribute(eventType, "return;");
            isSupported = typeof dom[eventType] === "function";
        }

        if (dom !== window) {
            dom = null;
        }

        return isSupported;
    }

    base.NS("NEG.base.BOM").Event = {
        addEventListener: addEventListener
       , removeEventListener: removeEventListener
       , dispatchEvent: dispatchEvent
       , isEventSupported: isEventSupported
    };
})(NEG);
;(function (neg) {
    // 此方法待重构
    var isReady = false;
    var readyHandleQueue = [];

    var readyHandle = function () {
        neg.base.BOM.Event.removeEventListener(document, "readystatechange", ieReadyHandle);
        neg.base.BOM.Event.removeEventListener(document, "DOMContentLoaded", readyHandle);
        neg.base.BOM.Event.removeEventListener(window, "load", readyHandle);


        //readyHandle = function () { };
        
        //fn();
        var acctiveHandle;
        while (acctiveHandle = readyHandleQueue.shift()) {
            isReady || acctiveHandle();
        }
        isReady = true;
    }

    var ieReadyHandle = function () {
        //if (/loaded|interactive|complete/.test(document.readyState) && isReady == false) {
        if (/loaded|complete/.test(document.readyState) || isReady == true) {
            readyHandle();
        }
    };
    neg.base.BOM.Event.addEventListener(document, "readystatechange", ieReadyHandle);
    neg.base.BOM.Event.addEventListener(document, "DOMContentLoaded", readyHandle);
    neg.base.BOM.Event.addEventListener(window, "load", readyHandle);
    document.documentElement.doScroll && checkDoScroll();

    function checkDoScroll() {
        try {
            document.documentElement.doScroll("left");
        } catch (err) {
            setTimeout(checkDoScroll, 1);
            return
        }
        readyHandle();
    }

    function _domReady(fn) {
        if (isReady == true) {
            fn();
            return
        }
        readyHandleQueue.push(fn);

    }


    base.NS("NEG.base.BOM").DOMReady = _domReady;
})(NEG);

;(function (moduleName, neg) {
    
    function Loader(jsURL, completeHandle){
        var jscount = 1;
        this.loadJS = function(){
            if(/\bArray\b/.test(Object.prototype.toString.call(jsURL))){
                jscount = jsURL.length;
                for (var i = jscount - 1; i >= 0; i--) {
                    _loadJs(jsURL[i], function(){
                        --jscount || completeHandle();
                    });
                };
            }else{
                _loadJs(jsURL, completeHandle);
            }
        };
    }

    function JSLoader(){
        var jsQueue = [];
        jsQueue.currentJs = null;

        this.loadJS = function(jsURL, completeHandle){
            var fixHandle = function(){
                jsQueue.currentJs = null;
                completeHandle && completeHandle();
                startLoad();
            };                
            jsQueue.push(new Loader(jsURL, fixHandle));
            startLoad();            
            return this;
        };

        function startLoad(){
            if(!jsQueue.currentJs){
                jsQueue.currentJs = jsQueue.shift();
                jsQueue.currentJs && jsQueue.currentJs.loadJS();
            }        
        }        

    }


    function _loadJs(jsURL, completeHandle) {
        var head = document.getElementsByTagName('head')[0]
           , jsLoader = document.createElement('script')
           , isComplate = false
           , isExisted
           , loadCompleteHandle = function () {
               isComplate = true;
               neg.base.BOM.Event.removeEventListener(jsLoader, 'load', loadCompleteHandle);
               neg.base.BOM.Event.removeEventListener(jsLoader, 'readystatechange', readyHandle);
               loadCompleteHandle = function () { };
               completeHandle && completeHandle();
           }
           , readyHandle = function () {
               if (/loaded|complete/.test(jsLoader.readyState) && isComplate == false) {                 
                    loadCompleteHandle();                 
               }
           };
        jsLoader.async = true;
        jsLoader.setAttribute("type", "text/javascript");
        jsLoader.src = jsURL;
        neg.base.BOM.Event.addEventListener(jsLoader, 'load', loadCompleteHandle);
        neg.base.BOM.Event.addEventListener(jsLoader, 'readystatechange', readyHandle);
        neg.base.BOM.Event.addEventListener(jsLoader, 'error', loadCompleteHandle);


        //var jsList = [].slice.call(document.getElementsByTagName("script"));
        var jsList = document.getElementsByTagName("script");
        for (var i = 0, len = jsList.length; !isExisted && i < len; i++) {
            isExisted = jsURL == jsList[i].getAttribute("src");
        };

        isExisted || head.appendChild(jsLoader);
    };

    function loadJs(jsURL, completeHandle){
        var jsLoader = new JSLoader();
        jsLoader.loadJS(jsURL, completeHandle);
        return jsLoader;
    }



    /**
    * @name NEG.base.BOM.LoadJS
    * @class [JS 加载器]
    * @name NEG.Loader
    * @param {String} jsURL [js地址（暂时只支持绝对地址）]
    * @param {Function} completeHandle [回调函数]
    */
    NEG.base.BOM[moduleName] = loadJs;
})("loadJS", NEG);
;(function (neg) {
    var bom = neg.base.BOM = neg.base.BOM || {};
    bom.Utility = bom.Utility || {};
    function isHTMLElement(obj) {
        var _isHTMLElement = obj == document || obj == window;
        var testNodeName = function (target) {
            var nodeName = target.nodeName;
            return nodeName &&
                document.createElement(nodeName).constructor === target.constructor
        };
        return _isHTMLElement || testNodeName(obj);
    }

    /**
    * @name NEG.base.BOM.Utility.isHTMLElement
    * @class [判断是否是HTML元素]
    * @param {Object} obj [被判断对象]
    * @return {Bool} 是否是HTML元素
    * @example
    * NEG.base.BOM.Utility.isHTMLElement(document.body);
    * 结果：返回true
    *
    * NEG.base.BOM.Utility.isHTMLElement("document.body");
    * 结果：返回false
    */
    bom.Utility.isHTMLElement = isHTMLElement;
})(NEG);; (function (NEG) {

    var openAPI = {
        run: NEG.base.run,
        iRun: function (fn) { NEG.base.run(fn, true) },
        /**
        * @name NEG.on
        * @class [事件监听及广播]
        * @param {Object} eventName   [事件名]
        * @param {*} option [事件句柄 �?事件处理参数]
        */
        //, on: NEG.base.Event.publicDispatchEvent

        Module: NEG.base.Module,
        NS: NEG.base.NS,
        merge: NEG.base.merge,
        blend: NEG.base.blend,
        setCDNTimestamp: NEG.base.setCDNTimestamp,
        moduleURL: NEG.base.setBaseURL,
        loadJS: NEG.base.BOM.loadJS,
        domReady: NEG.base.BOM.DOMReady,

        ArrayIndexOf: NEG.utility.Array.indexOf,
        isType: NEG.utility.isType,
        encodeHTML: NEG.utility.Encoding.encodeHTML,
        decodeHTML: NEG.utility.Encoding.decodeHTML,
        Enum: NEG.utility.getEnum,
        documentWriteScript: NEG.utility.Script.documentWriteScript,
        trim: NEG.utility.String.trim
    },

    avatarAPI = {
        /**
        * @name NEG(id).on
        * @class [具体对象的事件绑定]
        * @param {Object} eventName   [事件名]
        * @param {Function} eventHandle [事件处理句柄:若没有指定会将targetId和对应eventName的事件句柄全部清除]
        * @param {Object} option      [配置选项]
        * @example
        * NEG("body").on("load",function(){console.info("i am ready");},{});
        * 结果：在onload时间�?输出 i am ready
        */
        on: function (eventType, eventHandle, option) {
            var target = this.target,
                base = NEG.base,
                addEventListener = (base.BOM.Utility.isHTMLElement(target) && base.BOM.Event.isEventSupported(target, eventType)) ?
               //, addEventListener = base.BOM.Utility.isHTMLElement(target) ?
                                       base.BOM.Event.addEventListener :
                                       base.Event.addEventListener;

            base.each(target, function (i, target) {
                addEventListener(target, eventType, eventHandle, option);
            });
            /*
            NEG.base.BOM.Selector(target).each(function(i,el){
                 addEventListener(el, eventType, eventHandle, option); 
              });*/
        },

        trigger: function (eventType, data) {
            var target = this.target,
                base = NEG.base,
                dispatchEvent = (base.BOM.Utility.isHTMLElement(target) && base.BOM.Event.isEventSupported(target, eventType)) ?
            //, dispatchEvent = base.BOM.Utility.isHTMLElement(target) ?
                                base.BOM.Event.dispatchEvent :
                                base.Event.dispatchEvent;

            base.each(target, function (i, target) {
                dispatchEvent(target, eventType, data);
            });
        },
        /**
        * @name NEG(id).off
        * @class [具体对象 事件移除]
        * @param {Object} eventName   [事件名]
        * @param {Function} eventHandle [事件处理句柄:若没有指定会将targetId和对应eventName的事件句柄全部清除]
        * @param {Object} option      [配置选项]
        * @example
        * var fn=function(){};
        * NEG("body").off("load",fn,{});
        */
        off: function (eventType, eventHandle, option) {
            if (arguments.length <= 0) { return }
            var target = this.target
                , base = NEG.base
                , removeEventListener = (base.BOM.Utility.isHTMLElement(target) && base.BOM.Event.isEventSupported(target, eventType))
                                      ? base.BOM.Event.removeEventListener
                                      : base.Event.removeEventListener

            base.each(target, function (i, target) {
                removeEventListener(target, eventType, eventHandle, option);
            });
        }
    };

    //base.on, base.off, base.trigger
    (function () {
        var hostProxy = {};
        var base = NEG.base;
        var isType = base.isType;
        var publicDispatchEvent = base.Event.publicDispatchEvent;
        var addEventListener = base.Event.addEventListener;

        var _on = function (eventName, option) {
            var args = [].slice.call(arguments, 0);
            if (option && isType(option, 'Function')) {
                args.unshift(hostProxy);
                addEventListener.apply(hostProxy, args);
            } else {
                publicDispatchEvent.apply(hostProxy, args);
            }
        },
        _trigger = function (eventName, data) {
            var args = [].slice.call(arguments, 0);
            publicDispatchEvent.apply(hostProxy, args);
        },
        _off = function (eventName, option) {
            var args = [].slice.call(arguments, 0);
            if (option && isType(option, 'Function')) {
                args.unshift(hostProxy);
                base.Event.removeEventListener.apply(hostProxy, args);
            }
        };

        openAPI.on = _on;
        openAPI.off = _off;
        openAPI.trigger = _trigger;
    })();

    //VersionControl
    (function () {
        if (NEG.VersionControl) {
            NEG.setVersion = NEG.VersionControl.setVersion;
            NEG.getVersion = NEG.VersionControl.getVersion;
        }
    })();

    NEG.base.merge(NEG.base.avatarCore, avatarAPI);
    NEG.base.merge(NEG, openAPI);
    NEG.base.init();
})(NEG);