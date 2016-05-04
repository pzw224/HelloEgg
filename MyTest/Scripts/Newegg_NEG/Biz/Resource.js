NEG.Module('Biz.Resource',function(require) {
    //Web.UI.ResourceManager
    var resource = {
        Image: {
            build: function(fileName) {
                if(!fileName) {
                    return;
                }

                var imagePath = Web.Config.Environment.Path.Images + fileName;
                switch(window.location.protocol) {
                case "http:" :
                    return Web.Config.Environment.Url.HttpCache + imagePath;
                case "https:" :
                    return Web.Config.Environment.Url.HttpsCache + imagePath;
                default:
                    return imagePath;
                };
            }
        },

        Url: {
            build: function(p) {
                if(!p) {
                    return;
                }

                switch(window.location.protocol) {
                case "http:" :
                    return resource.Url.www(p);
                case "htps:" :
                    return resource.Url.secure(p);
                default:
                    return p;
                };
            },
            combine: function(url, qs) {
                return url + ((qs.length > 0) ? "?" + qs : qs);
            },
            www: function(p) {
                return Web.Config.Environment.Url.WWW + p;
            },
            shopper: function(p) {
                return Web.Config.Environment.Url.Shopper + p;
            },
            secure: function(p) {
                return Web.Config.Environment.Url.Secure + p;
            }
        }
    };
    return resource;
});