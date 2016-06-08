NEG.Module("Utility.DimensionCookie", function (require) {
    var cookie = require("Utility.Cookie");
    var JSON = window.JSON || require("Utility.JSON");

    function dimensionCookie(cookieName) {
        var me = arguments.callee;

        if (!(this instanceof me)) {
            return new me(cookieName);
        }
        var cookieValue = cookie.get(cookieName);
        var cookieObject = JSON.parse(cookie.get(cookieName) || null) || {};

        var api = {
            getItem: function (key) {
                return cookieObject[key] === undefined ? "" : cookieObject[key];
            },
            setItem: function (key, value) {
                cookieObject[key] = value;
                cookie.set(cookieName, JSON.stringify(cookieObject));
            },
            removeItem: function (key) {
                if (cookieObject[key] === undefined) {
                    //NOTHING TODO
                } else {
                    delete cookieObject[key];
                    cookie.set(cookieName, JSON.stringify(cookieObject));
                }
            },
            clear: function () {
                cookie.removeItem(cookieName);
            }
        }

        NEG.merge(this, api);
    }

    return dimensionCookie;
});
