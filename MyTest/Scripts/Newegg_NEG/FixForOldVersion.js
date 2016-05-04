; (function (Global) {
    Global.NEGfixForOldVersion = {
        encodeHTML: function (str) {
            str = NEG.utility.isType(str, 'String') ? str : '';
            return str.replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/\'/g, "&#039;").replace(/\"/g, "&quot;");
        },

        decodeHTML: function (str) {
            str = NEG.utility.isType(str, 'String') ? str : '';
            return str.replace(/(&quot;)/g, "\"").replace(/(&#039;)/ig, "'").replace(/(&lt;)/ig, "<").replace(/(&gt;)/ig, ">").replace(/(&amp;)/ig, "&");
        },
        Enum: function () {
            var _enum = {};
            for (var i = 0; i < arguments.length; i++) {
                _enum[arguments[i]] = arguments[i];
            }
            return _enum;
        },
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
            }

        })(document.write),
        queryStringBuilder: function (baseQueryString) {
            var me = arguments.callee;
            if (!(this instanceof me)) {
                return new me(baseQueryString);
            }

            function getIndex(key) {
                key = key && key.toLowerCase();
                return NEG.utility.Array.arrayIndexOf(keyMap, key);
            }

            var keyMap = [];
            var names = [];
            var values = [];
            var model = {};

            if (baseQueryString) {
                var collections = baseQueryString.split('&');
                if (collections) {
                    for (var i = collections.length - 1; i >= 0; i--) {
                        var keyValue = collections[i];
                        var keyValueArr = keyValue && keyValue.split('=');
                        var key = keyValueArr && keyValueArr[0];
                        var value = keyValueArr && keyValueArr[1];
                        if (key) {
                            //model[key] = value;
                            set(key, value);
                        }
                    };
                }

            }

            function set(key, value) {
                if (key && value) {
                    //keyMap.push(key.toLowerCase());
                    var index = getIndex(key);
                    if (index >= 0 && index < values.length) {
                        values[index] = value;
                    } else {
                        names.push(key);
                        values.push(value);
                        keyMap.push(key.toLowerCase());
                    }
                    //model[key] = value;
                }
                return value;
            }


            function get(key) {

                var result = key ? values[getIndex(key)] : "";
                return result;
                //return key ? model[key] : model;
            }

            function remove(key) {
                var _model = model;
                var index = getIndex(key);
                if (key && index > 0) {
                    //delete model[key];
                    names.splice(index, 1);
                    values.splice(index, 1);
                    keyMap.splice(index, 1);
                } else {
                    //model = {};
                    names = [];
                    values = [];
                    keyMap = [];
                }
                //return key ? this.get[key] : _model ;

            }

            var encodeURI = function (str) {
                try {
                    str = str ? decodeURIComponent(str) : '';
                } catch (e) { };

                return encodeURIComponent(str).replace(/\*/g, "%2A").replace(/-/g, "%2D").replace(/_/g, "%5F").replace(/\./g, "%2E").replace(/!/g, '%21').replace(/~/g, '%7E').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
            };

            /*
            this.toString = function(t1,t2){
                t1 = t1 || '=';
                t2 = t2 || '&';
                var result = [];
                for(var key in model){
                    if(model.hasOwnProperty(key)){
                        result.push(encodeURI(key) + t1 + encodeURI(model[key]));
                    }
                }
                return result.join(t2) || '';
            } 
            */
            this.set = set;
            this.get = get;
            this.remove = remove;
            this.toString = function (t1, t2) {
                t1 = t1 || '=';
                t2 = t2 || '&';
                var result = [];
                for (var index = 0; index < names.length; index++) {
                    if (values[index]) {
                        result.push(encodeURI(names[index]) + t1 + encodeURI(values[index]));
                    }
                }
                return result.join(t2) || '';
            }

        }
    }
})(window)


//NEG.queryStringBuilder = function (baseQueryString) {
//    var me = arguments.callee;
//    if (!(this instanceof me)) {
//        return new me(baseQueryString);
//    }

//    function getIndex(key) {
//        key = key && key.toLowerCase();
//        return NEG.ArrayIndexOf(keyMap, key);
//    }

//    var keyMap = [];
//    var names = [];
//    var values = [];
//    var model = {};

//    if (baseQueryString) {
//        var collections = baseQueryString.split('&');
//        if (collections) {
//            for (var i = collections.length - 1; i >= 0; i--) {
//                var keyValue = collections[i];
//                var keyValueArr = keyValue && keyValue.split('=');
//                var key = keyValueArr && keyValueArr[0];
//                var value = keyValueArr && keyValueArr[1];
//                if (key) {
//                    //model[key] = value;
//                    set(key, value);
//                }
//            };
//        }

//    }

//    function set(key, value) {
//        if (key && value) {
//            //keyMap.push(key.toLowerCase());
//            var index = getIndex(key);
//            if (index >= 0 && index < values.length) {
//                values[index] = value;
//            } else {
//                names.push(key);
//                values.push(value);
//                keyMap.push(key.toLowerCase());
//            }
//            //model[key] = value;
//        }
//        return value;
//    }


//    function get(key) {

//        var result = key ? values[getIndex(key)] : "";
//        return result;
//        //return key ? model[key] : model;
//    }

//    function remove(key) {
//        var _model = model;
//        var index = getIndex(key);
//        if (key && index > 0) {
//            //delete model[key];
//            names.splice(index, 1);
//            values.splice(index, 1);
//            keyMap.splice(index, 1);
//        } else {
//            //model = {};
//            names = [];
//            values = [];
//            keyMap = [];
//        }
//        //return key ? this.get[key] : _model ;

//    }

//    var encodeURI = function (str) {
//        try {
//            str = str ? decodeURIComponent(str) : '';
//        } catch (e) { };

//        return encodeURIComponent(str).replace(/\*/g, "%2A").replace(/-/g, "%2D").replace(/_/g, "%5F").replace(/\./g, "%2E").replace(/!/g, '%21').replace(/~/g, '%7E').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
//    };

//    /*
//    this.toString = function(t1,t2){
//        t1 = t1 || '=';
//        t2 = t2 || '&';
//        var result = [];
//        for(var key in model){
//            if(model.hasOwnProperty(key)){
//                result.push(encodeURI(key) + t1 + encodeURI(model[key]));
//            }
//        }
//        return result.join(t2) || '';
//    } 
//    */
//    this.set = set;
//    this.get = get;
//    this.remove = remove;
//    this.toString = function (t1, t2) {
//        t1 = t1 || '=';
//        t2 = t2 || '&';
//        var result = [];
//        for (var index = 0; index < names.length; index++) {
//            if (values[index]) {
//                result.push(encodeURI(names[index]) + t1 + encodeURI(values[index]));
//            }
//        }
//        return result.join(t2) || '';
//    }

//}
