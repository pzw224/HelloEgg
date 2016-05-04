NEG.Module('Biz.InvodoVideo',function(require) {
    var bizCookie = require('Biz.Cookie');
    //bizCookie(bizCookie.names.PRDLIST).get(bizCookie.subNames.ItemSearchKeyWords)

    //usingNamespace("Biz.Product")["video"] = {
    var invodoVideo = {
        setCookie: function() {
            var cookieName = bizCookie.names.DEVICEINFO;
            cookieName && bizCookie(cookieName).set("InvodoVideoFlag", "1") 
        },
        getCookie: function() {
            var strData = bizCookie(bizCookie.names.DEVICEINFO).get(bizCookie.subNames.InvodoVideoFlag);
            return strData;
        },
        conversion: function(pageName, number, qty) {
            var data = invodoVideo.getCookie();
            if(data == "1") {
                Invodo.conversion("cartAdd", {
                    p: pageName,
                    masterProduct: number,
                    quantity: qty
                });
            };
        },
        conversionName: function(pageName, number, qtyName) {
            var qty = document.getElementsByName(qtyName)[0].value || 0;
            var data = invodoVideo.getCookie();
            if(data == "1") {
                Invodo.conversion("cartAdd", {
                    p: pageName,
                    masterProduct: number,
                    quantity: qty
                });
            };
        },/*
        conversionCrossTable: function(pageName, mItem) {
            var data = invodoVideo.getCookie();
            if(data == "1") {
                var itemList = Biz.Product.CrossTable.getSelectedItem(mItem);
                if(itemList.length > 0) {
                    for(var i = 0; i < itemList.length; i++) {
                        Invodo.conversion("cartAdd", {
                            p: pageName,
                            masterProduct: itemList[i],
                            quantity: 1
                        });
                    }
                }
            };
        },*/
        conversionCrossItemList: function(vItem, itemList) {
            var data = invodoVideo.getCookie();
            if(data == "1") {
                itemList.push(vItem);
                var len = itemList.length;
                for(var i = 0; i < len; i++) {
                    Invodo.conversion("cartAdd", {
                        p: "ShoppingItem_" + vItem,
                        masterProduct: itemList[i],
                        quantity: 1
                    });
                }
            };
        },
        isCookie: function(affiliate) {
            var data = invodoVideo.getCookie();
            var src = "http://e.invodo.com/3.0/js/invodo.js?a=" + affiliate;
            if(data == "1") {
                NEG.loadJS(src);
            };
        }
    };

    return invodoVideo;
});