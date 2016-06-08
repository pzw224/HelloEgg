NEG.Module("NEG.Utility.UrlBuilder", function (require) {

    var queryStringBuilder = require("NEG.Utility.QueryStringBuilder");

    var urlBuilder = function (url) {
        var me = arguments.callee;

        if (!(this instanceof me)) {
            return new me(url);
        }

        if (!url) { throw "url is need for NEG.Utility.UrlBuilder" }

        var urlArray = url.split("?");

        var host = urlArray[0], queryString = queryStringBuilder(urlArray.length > 1 ? urlArray[1] : "");

        var api = {
            getHost: function () { return host; },
            getQueryString: function () { return queryString.toString(); },
            setParameter: function (key, value) {queryString.set(key, value);},
            getParameter: function (key) {
                return queryString.get(key);
            },
            toString: function () {
                return this.getHost() + "?" + this.getQueryString();
            }
        }

        NEG.merge(this, api);
    }

    return urlBuilder;

});