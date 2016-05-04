NEG.Module('Biz.SearchKeywords',function(require) {
    var bizCookie = require('Biz.Cookie');

    //Biz.Common.SearchKeywords
    var searchKeywords = function() {
        var googleUrl = "google.com";
        var bingUrl = "bing.com";
        var queryName = "q";
        var queryValue = "";
        var maxKeywords = 10;
        var maxKeywordsLength = 50;
        var searchKeywordsArray = [];
        var searchMaxSplit = "|";
        var getUrlParameter = function(name) {
                return decodeURI((RegExp('[?|&]' + name + '=' + '(.+?)(&|$)').exec(document.referrer) || [, ""])[1]);
        };

        var trim = function (string) {
            
            return string && string.replace(/(^\s+)|(\s+$)/g, '');
        }

        var removeElementFromArray = function(a, ev) {
                for(var ci = 0; ci < a.length; ci++) {
                    if(a[ci].toLowerCase() == ev.toLowerCase()) {
                        a.splice(ci, 1);
                    }
                }
                return a;
            };
        var removeSpace = function(k) {
                var str = "";
                if(k.length > 0) {
                    var array = k.split(" ");
                    var s = "";
                    for(var i = 0; i < array.length; i++) {
                        s = array[i];
                        if(s.length > 0) {
                            str += trim(s) + " ";
                        }
                    }
                }
                return trim(str);
        };



        var addRecentlySearchKeywords = function(keyword) {
                keyword = keyword.replace(/[,|]/g, " ");
                keyword = removeSpace(keyword);
                //var cookieValue = Web.StateManager.Cookies.get(Web.StateManager.Cookies.Name.PRDLIST, "ItemSearchKeyWords").trim();
                var cookieValue = trim(bizCookie(bizCookie.names.PRDLIST).get(bizCookie.subNames.ItemSearchKeyWords));
                if(cookieValue.length > 0) {
                    if(cookieValue.indexOf(searchMaxSplit) > 0) {
                        maxKeywords = parseInt(cookieValue.split(searchMaxSplit)[0]);
                        cookieValue = cookieValue.split(searchMaxSplit)[1];
                        if(cookieValue.length > 0) {
                            searchKeywordsArray = cookieValue.split(",");
                            searchKeywordsArray = removeElementFromArray(searchKeywordsArray, keyword);
                            if(searchKeywordsArray.length >= maxKeywords && searchKeywordsArray.length > 0) {
                                searchKeywordsArray.splice(maxKeywords - 1, searchKeywordsArray.length - maxKeywords + 1);
                            }
                            if(searchKeywordsArray.length < maxKeywords) {
                                searchKeywordsArray.unshift(keyword);
                            }
                            cookieValue = maxKeywords.toString() + searchMaxSplit + searchKeywordsArray.toString();
                            bizCookie(bizCookie.names.PRDLIST).set(bizCookie.subNames.ItemSearchKeyWords, cookieValue);
                        }
                    }
                } else {
                    cookieValue = maxKeywords.toString() + searchMaxSplit + keyword;
                    bizCookie(bizCookie.names.PRDLIST).set(bizCookie.subNames.ItemSearchKeyWords, cookieValue);
                }
        };

        return {
            saveExternalSearchKeywords: function() {
                var referralUrl = document.referrer;
                if(referralUrl) {
                    if(referralUrl.indexOf(googleUrl) > 0) {
                        queryValue = getUrlParameter(queryName);
                    } else if(referralUrl.indexOf(bingUrl) > 0) {
                        queryValue = getUrlParameter(queryName);
                    }
                    if(queryValue.length > 0 && queryValue.length <= maxKeywordsLength) {
                        addRecentlySearchKeywords(queryValue);
                    }
                }
            },
            saveInternalSearchKeywords: function(keyword) {
                if(keyword.length > 0 && keyword.length <= maxKeywordsLength) {
                    addRecentlySearchKeywords(keyword);
                }
            }
        };
    }();
    return searchKeywords;
});