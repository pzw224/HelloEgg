NEG.Module('Biz.Cookie.Config',function(require) {
    var siteCookieInfo = Web.Config.SiteCookieInfo; //Web.Config.SiteCookieInfo 目前由服务端输出到页面
    var cookieEnvironment = Web.Config.Environment.Cookies; //目前由服务端输出到页面
    var config = {
        bizUnit : siteCookieInfo.bizUnit,
        enableReformattedCookie : siteCookieInfo.enableReformattedCookie,
        writeReformattedCookie : siteCookieInfo.siteCookieInfo,
        EnableCookieNameMapping : cookieEnvironment.EnableCookieNameMapping,
        CookieMapping : Web.Config.CookieMapping,
        version : cookieEnvironment.EnableCookieNameMapping ? "#5" : "#4"
    };
    return config;
});NEG.Module('Biz.Cookie.CookieName', function (require) {
    var name = {
        CFG: "NV_CONFIGURATION",
        LOGIN: (Web.Config.SiteCookieInfo.bizUnit == "B2B") ? "NV_B2BCUSTOMERLOGIN" : "NV_CUSTOMERLOGIN",
        CART: "NV_CARTINFO",
        CPCOMBO: "CELL_PHONE_COMBO",
        CPPACKAGE: "CELL_PHONE_PACKAGE",
        PRDLIST: "NV_PRDLIST",
        CUSTOMER_REVIEW: "NV_CUSTOMERREVIEWCOOKIE",
        DEVICEINFO: "NV_DVINFO",
        GOOGLEANALYTICS: "NV_GOOGLE_ANALYTICS",
        ANTIPRICE: "NV_Anti",
        UTMA: "__utma",
        CustomerInfoInternalUser: "NV_CUSTOMERLOGININTERNALUSER",
        NEGSTORAGE: "NEG_STORAGE"
    };

    return name;
});NEG.Module('Biz.Cookie.SubCookie',function(require){
    var subCookies = {      
            AID:"ww",
            AutoSplit:"s0",
            bCILead:"w13",
            BestMatch:"wn",
            CardNumber:"s68",
            CartID:"s60",
            CartNo:"s59",
            CCatalogStyle:"ws",
            CELL_PHONE_ITEM:"wz",
            CELL_PHONE_PLAN:"w0",
            CellPhoneZipCode:"wy",
            CMP:"wt",
            CMP_Survey:"w9",
            CONTACTWITH:"si",
            CusReviewPageSize:"w15",
            CusReviewSortBy:"w16",
            CustomerNumber:"s61",
            CustPagesize:"wm",
            DEFAULTSHOPPINGURL:"sv",
            DEPA:"wd",
            EnableAction:"w7",
            FinalTotalMoney:"s6",
            FV:"wo",
            ID:"sn",
            ISB2BINTERNALLOGIN:"w29",
            IsFromGoogle:"w14",
            IsHttps:"s77",
            IsInputMaxQty:"s8",
            ISREMEMBER:"sj",
            ItemViewed:"wf",
            jftid:"w23",
            JUMPEDLOCATION:"sr",
            JUMPEDSERVER:"sq",
            JumpFlag:"s55",
            LANGUAGE:"w30",
            Line1:"w2",
            Line2:"w3",
            Line3:"w4",
            Line4:"w5",
            Line5:"w6",
            LoginFlag:"s54",
            LOGINID4:"sc",
            LOGINID5:"sb",
            LOGINID6:"sd",
            LoginName:"s62",
            Lpage:"w20",
            M1:"s27",
            M10:"s36",
            M11:"s37",
            M12:"s38",
            M13:"s39",
            M14:"s40",
            M2:"s28",
            M3:"s29",
            M4:"s30",
            M5:"s31",
            M6:"s32",
            M7:"s33",
            M8:"s34",
            M9:"s35",
            MsclkID:"w25",
            multipollid:"s75",
            MyNewegg_State:"w27",
            NV_B2BCUSTOMER:"sm",
            NV_CONTACTUS_COOKIE:"s74",
            NV_SHOPPINGCARTID:"s9",
            NVS_ACADEMICSFSIGN:"su",
            NVS_AGREENEWSLETTER_PCODE:"s10",
            NVS_APOSIGN:"s5",
            NVS_BML_PROMPT_FLAG:"s73",
            NVS_COMPLETEORDER_PCMAG:"s2",
            NVS_COMPLETEORDER_RUSHORDERFEE:"s1",
            NVS_CORELSFSIGN:"st",
            NVS_CURPAGE:"s4",
            NVS_CUSTOMER_COUNTY:"sf",
            NVS_CUSTOMER_PAYPALEMAILADDRESS:"s7",
            NVS_CUSTOMER_PROMOTION_CODE:"sx",
            NVS_CUSTOMER_SHIPPING_METHOD:"s12",
            NVS_CUSTOMER_SHIPPING_METHOD1:"s13",
            NVS_CUSTOMER_SHIPPING_METHOD10:"s22",
            NVS_CUSTOMER_SHIPPING_METHOD11:"s23",
            NVS_CUSTOMER_SHIPPING_METHOD12:"s24",
            NVS_CUSTOMER_SHIPPING_METHOD13:"s25",
            NVS_CUSTOMER_SHIPPING_METHOD14:"s26",
            NVS_CUSTOMER_SHIPPING_METHOD2:"s14",
            NVS_CUSTOMER_SHIPPING_METHOD3:"s15",
            NVS_CUSTOMER_SHIPPING_METHOD4:"s16",
            NVS_CUSTOMER_SHIPPING_METHOD5:"s17",
            NVS_CUSTOMER_SHIPPING_METHOD6:"s18",
            NVS_CUSTOMER_SHIPPING_METHOD7:"s19",
            NVS_CUSTOMER_SHIPPING_METHOD8:"s20",
            NVS_CUSTOMER_SHIPPING_METHOD9:"s21",
            NVS_CUSTOMER_SHIPPINGSTATE:"sg",
            NVS_CUSTOMER_ZIP_CODE:"se",
            NVS_FIRSTTIMETOTHISPAGE:"s3",
            NVS_MFACADEMICSFSIGN:"sw",
            NVS_NEWEGGGIFTCODES:"sy",
            NVS_NEWEGGGIFTPWDS:"sz",
            NVS_NPA_PROMPT_FLAG:"s72",
            NVS_SAMEDAYELIGIBLESTATE:"s11",
            NVS_TRUCK_SHIPPING_METHOD:"s53",
            NVS_VENDER_AITSHIPPING_METHOD:"s51",
            NVS_VENDER_SHIPPING_METHOD:"s50",
            ORDERCOMMON_SHIPPING_SETTINGFLAGM10:"s43",
            ORDERCOMMON_SHIPPING_SETTINGFLAGM11:"s44",
            ORDERCOMMON_SHIPPING_SETTINGFLAGM12:"s45",
            ORDERCOMMON_SHIPPING_SETTINGFLAGM13:"s46",
            ORDERCOMMON_SHIPPING_SETTINGFLAGM14:"s47",
            ORDERCOMMON_SHIPPING_SETTINGFLAGM8:"s41",
            ORDERCOMMON_SHIPPING_SETTINGFLAGM9:"s42",
            P:"w28",
            PageStyle:"wa",
            PayoutRate:"w26",
            PCID:"w19",
            PID:"wv",
            Plan:"w1",
            Ppage:"w21",
            PrdDisplayStyle:"wh",
            PrdFieldSettings:"wi",
            PrdPageSize:"wg",
            PrdSumOrderby:"wk",
            PrdSumSortby:"wj",
            PreSONumbers:"s57",
            PromotionID:"w8",
            PronunciationNumber:"so",
            QuerySQL:"s70",
            RebateOrderBy:"wq",
            RebateSortBy:"wp",
            REFERENCEURL:"wu",
            ReviewSortType:"wc",
            ROI_mpuid:"sp",
            sCICPNCode:"w12",
            sCIITEM:"w10",
            sCISRCCode:"w11",
            SearchPanelTab:"we",
            ShoppingCartActionType:"s48",
            ShoppingCartZipCode:"s49",
            SHSIGN:"sk",
            SID:"wx",
            SoAmounts:"s63",
            SONumbers:"s56",
            SortBy:"wl",
            SSSC:"s79",
            Switching:"s78",
            TEST_STATUS:"w24",
            Theme:"wb",
            TRACKING_PIXEL:"w22",
            TransactionID:"s67",
            TRANSACTIONSERVERID:"ss",
            TransNo:"sl",
            UploadID:"sa",
            VENDER_AUTOSPLIT:"s52",
            VideoID:"w17",
            VideoItem:"w18",
            VoucherNumber:"s58",
            WishListSubmitRestrict:"s76",
            Layout:"w32",
            Compare:"w31",
            Token:"w33",
            CaptchaGuid:"w34",
            SurveyFlag:"w35",
            SurveyVisit:"w36",
            Tid:"w39",
            ItemNo:"s92",
            BlackOut:"w40",
            SmartSort:"w42",
            ShellshockerTransNO:"w44",
            ShellshockerItemType:"w45",
            HomePage2011:"w46",
            ItemOrdered:"w47",
            ItemSearchKeyWords:"w48",
            EnhanceCrossSell:"w49",
            InvodoVideoFlag: "w50"
        };
    return subCookies;    
});NEG.Module('Biz.Cookie',function(require) {
    var cookie = require("Utility.Cookie");
    var cookieNameMap = require("Biz.Cookie.CookieName");
    var subCookieMap = require("Biz.Cookie.SubCookie");
    var cookieConfig = require("Biz.Cookie.Config");    
    var JSON = window.JSON || require("Utility.JSON");
    var regx=/^#\d+/i;
    
    var cookieNameReflection = function () {
        var reflection={};
        for(var key in cookieNameMap){
            reflection[cookieNameMap[key]] = key;
        };
        return reflection;
    }();

    var subCookieReflection = function () {
        var reflection={};
        for(var key in subCookieMap){
            reflection[subCookieMap[key]] = key;
        };
        return reflection;
    }();


    var bizCookie = function(cookieName){

        var me = arguments.callee;
        if ( !(this instanceof me)){
            /*if(!cookieNameReflection[cookieName]){
                throw cookieName + " is not a Newegg cookie name!";
            }*/
            return new me(cookieName);
        }

        var context = this;
        function checkSubCookie(name) {
            if(name && !subCookieReflection[name]){
                //throw name + " is not a Newegg sub cookie name!";
            }else if(!name){
                throw "miss cookie name!";
            }
            return !!subCookieReflection[name];
        }

        var version = cookie.get(cookieName).match(regx)+'';

        function internalDecoders (value,version) {
            switch(version){
                case "#1" :
                    value = value.replace(/"Expired":/g,"\"Exp\":");
                    break;
                case "#2" :    
                    value = value.replace(/%7B/ig,"{").replace(/%7D/ig,"}").replace(/%22/ig,"\"").replace(/%2C/ig,",").replace(/%3A/ig,":").replace(/%2F/ig,"/").replace(/%20/ig," ");
                    break;
                case "#3" :
                    value = value.replace(/\?7B\?/ig,"{").replace(/\?7D\?/ig,"}").replace(/\?22\?/ig,"\"").replace(/\?2C\?/ig,",").replace(/\?3A\?/ig,":").replace(/\?2F\?/ig,"/").replace(/\?20\?/ig," ");
                    break;
                case "#4" :
                    value = value.replace(/\+/ig,"%20");
                    break;
                default :
                    value = value.replace(/\+/ig, " ");
                    break;
            }
            return value;
        }
        
        function getCookieObject(cookieName) {
            var cookieObject = createNegCookieTemplate();
            var cookieString = internalDecoders(cookie.get(cookieName).replace(regx, ''), version);
            //var historyCookie = JSON.parse(cookie.get(cookieName).replace(regx,'') || null) || {};
            var historyCookie = JSON.parse(cookieString || null) || {};
            var currentSite = NEG.merge(cookieObject.Sites,historyCookie.Sites)[cookieConfig.bizUnit]; 
            var cookieOption = getCookieOption(cookieName);
            //cookieOption.exp = context.getExpDate(cookieObject) || cookieOption.exp;
            return {data:cookieObject,currentSite:currentSite,option:cookieOption};
        }

        function createNegCookieTemplate(bizUnit) {
            // newegg cookie 结构参考： #5{"Sites":{"USA":{"Values":{"wf":"9SIA06S06"},"Exp":"1428288699"}}}
            bizUnit = bizUnit || cookieConfig.bizUnit;
            var cookieTemplate = {};
            NEG.NS('Sites',cookieTemplate)[bizUnit]={Values:{},Exp:0};
            return cookieTemplate;
        }

        function getCookieValueString(cookieObject){

            return cookieConfig.version + JSON.stringify(cookieObject);   
        }

        function getCookieOption(cookieName) {
            var config = cookieConfig.CookieMapping[cookieName] || [];
            var cookieOption = {
                domain : config[0],
                exp : config[1] && new Date/1000 + config[1],
                path : config[2],
                secure : config[3]
            };
            return cookieOption;
        }
        
        this.getExpDate = function(cookieObject){
            cookieObject = cookieObject || this.get(cookieName).data;
            var site;
            var maxExpDate = 0;//new Date/1000;
            for(site in cookieObject.data.Sites){
                maxExpDate = Math.max(maxExpDate,cookieObject.data.Sites[site].Exp,cookieObject.option.exp);
            }
            return maxExpDate*1000;
        };

        this.get = function(key){
            var value;
            var cookieObject = getCookieObject(cookieName);
            if(key) {
                value = (new Date/1000 < cookieObject.currentSite.Exp) && checkSubCookie(key) ? cookieObject.currentSite.Values[key] : '';
            }else{
                value = cookieObject.currentSite.Values || cookieObject.currentSite.Value;
            }
            return value || '';
        };

        this.set = function(key,value,exp){
            checkSubCookie(key);
            var negCookie = getCookieObject(cookieName);
            negCookie.currentSite.Values[key] = value;

            negCookie.currentSite.Exp = (exp !== undefined) ? parseInt(exp) : parseInt(negCookie.currentSite.Exp || negCookie.option.exp);
            var valueString = getCookieValueString(negCookie.data);
            negCookie.option.exp = context.getExpDate(negCookie);
            cookie.set(cookieName,valueString,negCookie.option);
        };

        this.remove = function(key){
            //checkSubCookie(key);
            var negCookie = getCookieObject(cookieName);
            if(key){
                delete negCookie.currentSite.Values[key];
            }else{
                delete negCookie.data.Sites[cookieConfig.bizUnit];
            }
            var valueString = getCookieValueString(negCookie.data);
            cookie.set(cookieName,valueString,negCookie.option);                
        };
    };

    bizCookie.names = cookieNameMap;
    bizCookie.subNames = subCookieMap;
    return bizCookie;
});