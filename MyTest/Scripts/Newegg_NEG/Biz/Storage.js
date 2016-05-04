NEG.Module('Biz.Storage', function (require) {

    var NEG_STORAGE_COOKIENAME = "NEG_STORAGE";

    function constructor(name) {
        var me = arguments.callee;

        if (!(this instanceof me)) {
            return new me(name);
        }

        var cookie = require("Utility.DimensionCookie");

        var cookieStorage = function () {
            this.options = {
                expires: 30 * 24 * 3600
            }
        }
        cookieStorage.prototype = {
            init: function () {
                var date = new Date();
                date.setTime(date.getTime() + this.options.expires);
                this.setItem("expires", date.toGMTString());
            },
            findItem: function (key) {
                if (cookie(name).getItem(key) === "undefined") {
                    return false;
                }
                return true;
            },
            getItem: function (key) {
                return cookie(name).getItem(key);
            },
            setItem: function (key, value) {
                cookie(name).setItem(key, value, this.options.expires);
            },
            removeItem: function (o) {
                if (this.findItem(o)) {
                    return cookie(name).removeItem(o);
                }
                return cookie(name).removeItem();
            }
        }

        var cStorage = new cookieStorage();

        var api = {
            getItem: function (key) {
                if (window.localStorage) {
                    return window.localStorage.getItem(key);
                }
                return cStorage.getItem(key);
            },
            setItem: function (key, value) {
                if (window.localStorage) {
                    return window.localStorage.setItem(key, value);
                }
                return cStorage.setItem(key, value);
            },
            removeItem: function (key) {
                if (window.localStorage) {
                    return window.localStorage.removeItem(key);
                }
                return cStorage.removeItem(key);
            }
        }

        NEG.merge(this, api);
    }

    return constructor(NEG_STORAGE_COOKIENAME);

});


