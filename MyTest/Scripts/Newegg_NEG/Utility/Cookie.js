NEG.Module('Utility.Cookie',function(require){
   
    var helper = {
        encode : function(str){
            //var blackList = ['(', ')', '<', '>', '@', ',', ';', ',', '"', '/', '[', ']', '?', '=', '{', '}','_'];
            var whiteList = ['#'];
            str = encodeURIComponent(str).replace(/_/g,'%5F');
            for (var i = 0; i < whiteList.length; i++) {
                //str = str.replace(encodeURIComponent(whiteList[i]),whiteList[i]);
                str = str.replace(encodeURIComponent(whiteList[i]), whiteList[i]);
            };

            return str;
            
        }
    };

    var cookie = {
        set : function(name,value,option) {
            option = option || {};
            //var cookieString = encodeURIComponent(name) + "=" + helper.encode(value);
            var cookieString = helper.encode(name) + "=" + helper.encode(value);
            //option.exp && (cookieString += ";expires=" + new Date(option.exp-new Date().getTimezoneOffset()*60*1000).toGMTString());
            cookieString += ";expires=" + (option.exp ? new Date(option.exp).toGMTString() : 0);
            option.domain && (cookieString += ";domain=" + option.domain);
            option.path && (cookieString += ";path=" + option.path);
            option.secure && (cookieString += ";secure");
            document.cookie = cookieString;
        }
       , get: function (name) {
            name = helper.encode(name);
           //var allCookieString = decodeURIComponent(document.cookie);
            allCookieString = document.cookie;
            var reg = new RegExp("\\b" + name + "=([^;]*)");
            var value = (value = allCookieString.match(reg)) && value[1];
            return value ? decodeURIComponent(value) :  '';
       }
       ,remove : function(name) {
            name && cookie.set(name,null,{exp:new Date()-1});
       }

    };

    var subCookie = {

    };

    return cookie;
});
