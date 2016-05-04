NEG.Module('NEG.Utility.QueryStringBuilder', function (require) {

    var encodeURI = function (str) {
        try {
            str = str ? decodeURIComponent(str) : '';
        } catch (e) { };

        return encodeURIComponent(str).replace(/\*/g, "%2A").replace(/-/g, "%2D").replace(/_/g, "%5F").replace(/\./g, "%2E").replace(/!/g, '%21').replace(/~/g, '%7E').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
    };

    var queryString = function (baseQueryString) {
        var me = arguments.callee;
        if (!(this instanceof me)) {
            return new me(baseQueryString);
        }

        function getIndex(key) {
            key = key && key.toLowerCase();
            return NEG.utility.Array.indexOf(keyMap, key);
        }

        var keyMap = [];
        var names = [];
        var values = [];
        var model = {};

        var set_value = function (key, value) {
            if (key && value) {
                var index = getIndex(key);
                if (index >= 0 && index < values.length) {
                    values[index] = value;
                } else {
                    names.push(key);
                    values.push(value);
                    keyMap.push(key.toLowerCase());
                }
            }
            return value;
        }
        this.set = set_value;

        var getValueByKey = function (key) {
            var result = key ? values[getIndex(key)] : "";
            return result;
        };

        var getCollection = function () {
            var res = {};
            for (var i = 0; i < names.length; i++) {
                var key = names[i];
                res[key] = getValueByKey(key);
            }
            return res;
        }

        this.get = function (key) {
            if (arguments.length == 1) {
                return getValueByKey(key)
            } else {
                return getCollection();
            }
        }

        this.remove = function (key) {
            var _model = model;
            var index = getIndex(key);
            if (key && index > -1) {
                names.splice(index, 1);
                values.splice(index, 1);
                keyMap.splice(index, 1);
            } else if (!key) {
                names = [];
                values = [];
                keyMap = [];
            }
        }

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


        if (baseQueryString) {
            var collections = baseQueryString.split('&');
            if (collections) {
                for (var i = collections.length - 1; i >= 0; i--) {
                    var keyValue = collections[i];
                    var keyValueArr = keyValue && keyValue.split('=');
                    var key = keyValueArr && keyValueArr[0];
                    var value = keyValueArr && keyValueArr[1];
                    if (key) {
                        set_value(key, value);
                    }
                };
            }
        }

    }
    return queryString;
});