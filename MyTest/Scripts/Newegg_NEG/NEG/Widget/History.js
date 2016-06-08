/*
Author: Mike Cao
*/
NEG.Module("NEG.Widget.History", function (require) {
    var jQuery = require("Utility.JQuery");
    var supportHtml5 = history.pushState;
    var locationHelper = {
        getQueryString: function () {
            if (!location.search) return '';
            if (location.search.indexOf('?') == 0) {
                return location.search.substring(1);
            }
            return location.search;
        },
        getHash: function () {
            return location.hash.replace(/^#!/, "") || "";
        },
        setHash: function (hash) {
            if (!hash && !location.hash) return;
            if ('#!' + hash == location.hash) return;
            locationHelper.hashEventBlocked = true;
            if (hash) {
                location.hash = "#!" + hash;
            } else {
                location.hash = '';
            }
        },
        hashEventBlocked: false
    };
    var historyHelper, eventsProxy, inited = false, pageRefrashed = false;
    var initState = { 'queryString': locationHelper.getQueryString(), 'hash': locationHelper.getHash() };

    if (supportHtml5) {
        /*考虑该需求：进入一个带有querystring/或者hash的页面，然后进行ajax，然后回退*/
        history.state || history.replaceState(initState, document.title, location.href);

        eventsProxy = {
            init: function (handle) {
                if (!inited) {
                    jQuery(document).ready(function () {
                        if (!pageRefrashed) {
                            handle.call(this, initState);
                            pageRefrashed = true;
                        }
                    });
                    inited = true;
                }
            },
            historyChanged: function (handle) {
                NEG(window).on("popstate", function (e) {
                    var state = e.state;
                    if (state) {
                        pageRefrashed = false;
                        /*考虑该需求：进入页面P，记历史记录A,进入页面Q，Q带有querystring，记历史记录B,从B回退到A，然后再从A前进到B，此时Q页面会刷新，并触发change事件*/
                        handle.call(this, state);
                    }
                });
            }
        };
        historyHelper = {
            addHistory: function (search, title, theUrl) {
                var t = title || document.title, state, url;
                if (location.hash) {
                    url = theUrl || location.href.split("#!")[0];
                    state = { 'hash': search, 'queryString': locationHelper.getQueryString() };
                } else {
                    state = { 'hash': "", 'queryString': search };
                    var temp = location.href.split("?");
                    url = theUrl || (search ? (temp[0] + "?" + search) : temp[0]);
                }
                history.pushState(state, t, url);
                pageRefrashed = false;
            },
            on: function (event, handle) {
                var eventProxy = eventsProxy[event];
                if (eventProxy) {
                    eventProxy(handle);
                }
            },
            supportHTML5: true
        };
    } else {
        eventsProxy = {
            init: function (handle) {
                if (!inited) {
                    jQuery(document).ready(function () {
                        handle.call(this, initState);
                    });
                    inited = true;
                }
            },
            historyChanged: function (handle) {
                NEG(window).on("hashchange", function () {
                    if (!locationHelper.hashEventBlocked) {
                        handle.call(this, { 'queryString': locationHelper.getQueryString(), 'hash': locationHelper.getHash() });
                    } else {
                        locationHelper.hashEventBlocked = false;
                    }
                });
            }
        };
        historyHelper = {
            addHistory: function (queryString) {
                locationHelper.setHash(queryString);
            },
            on: function (event, handle) {
                var eventProxy = eventsProxy[event];
                if (eventProxy) {
                    eventProxy(handle);
                }
            },
            supportHTML5: false
        };
    }

    return historyHelper;
});