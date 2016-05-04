
NEG.Module('NEG.Widget.AutoConfigurator', function (require) {
    var jQuery = require('Utility.JQuery');

    function AutoConfigurator(option, data) {
        var me = arguments.callee
            , stripeStatus = []
            , selectedData = []
            , strip = function (StripeEnable, Key, DefaultStripeText, AutoExpand) {
                this.stripeEnable = StripeEnable
                this.stripeEventDefined = false;
                this.contentEventDefined = false;
                this.stripeKey = Key;
                this.defaultStripeText = DefaultStripeText;
                this.autoExpand = AutoExpand;
                this.contentLeaveEventDefined = !_option.enableMouseLeave;
            }
            , isCompleted = false;


        if (!(this instanceof me)) {
            return new me(option, data);
        }

        selectedData.get = function (stripe) {
            var d = this;
            for (var i = 0; i < d.length; i++) {
                if (d[i].stripe === stripe) {
                    return d[i].value;
                }
            }
        }
        , selectedData.set = function (stripe, value, target) {
            var d = this;
            for (var i = 0; i < d.length; i++) {
                if (d[i].stripe === stripe) {
                    d[i].value = value;
                    d[i].target = target;
                    return;
                }
            }
            this.push({ "stripe": stripe, "value": value, "target": target });
        }
        , selectedData.toURLPara = function () {

            var returnString = "";

            if (this && this.length && this.length > 0) {
                for (var i = 0; i < this.length - 1; i++) {

                    var stripe = this[i].value;

                    returnString += this[i].stripe + "=" + encodeURIComponent(stripe.value) + "&";
                }

                var lastStripe = this[this.length - 1].value;
                returnString += this[i].stripe + "=" + encodeURIComponent(lastStripe.value);
            }

            return returnString;
        }

        var Event = {
            buttonGo: "AutoConfigurator_Button_Go"
        };

        var _option = {
            stripeSelector: "",
            contentSelector: "",
            buttonGoSelector: "",
            strileDisableClass: "",
            buttonGoDisableClass: null,
            buttonNextSelector: "",
            activeClass: "active",
            processData: null,
            go: null,
            stripeKey: "neg-sp-data-Key",
            stripeValue: "neg-sp-data-value",
            defaultStripeText: "neg-sp-data-defaultStrip",
            autoExpandKey: "neg-sp-data-autoExpand",
            enableMouseLeave: true,
            validateData: null,
            completed: null
        }

        NEG.merge(_option, option);
        NEG.on(Event.buttonGo, _option.go);

        var stripes = jQuery(_option.stripeSelector)
            , contents = jQuery(_option.contentSelector)
            , $buttonGo = jQuery(_option.buttonGoSelector);

        _option.buttonGoDisableClass || (_option.buttonGoDisableClass = _option.strileDisableClass);

        var reStore = function (step) {

            var arrayLength = selectedData.length;

            isCompleted = false;
            if (!$buttonGo.hasClass(_option.buttonGoDisableClass)) {
                $buttonGo.addClass(_option.buttonGoDisableClass);
                NEG($buttonGo[0]).off("click", goClickHandler);
                stripeStatus.buttonGoEventDefined = false;
            }

            for (var i = step + 1; i < arrayLength ; i++) {
                selectedData.pop();
            };

            for (var i = step + 1 ; i < stripes.length; i++) {
                var $stripe = jQuery(stripes[i]);
                $stripe.addClass(_option.strileDisableClass);
                $stripe.find("[" + _option.defaultStripeText + "]").text(stripeStatus[i].defaultStripeText);

                //解除事件绑定
                if (stripeStatus[i].stripeEventDefined) {
                    stripes[i] && NEG(stripes[i]).off("click", stripeClickHandler);
                    stripeStatus[i].stripeEventDefined = false;
                }
            }

        }

        var beforeProcessData = function (step, selectedData) {
            var $preStripe = jQuery(stripes[step]);

            $preStripe.removeClass("active");

            var stripeKey = $preStripe.attr(_option.stripeKey);
            $preStripe.find("[" + _option.defaultStripeText + "]").text(selectedData.get(stripeKey).value);

            var needRefresh = selectedData.length - step > 1;
            /*重新选择了前面的filter,需要初始化后续stripe*/
            if (needRefresh) {
                reStore(step);
            }
        }

        var goClickHandler = function () {
            NEG.trigger(Event.buttonGo, selectedData);
        }

        var helper = {
            setTimeout: function (callBack, timeout, param) {
                var args = Array.prototype.slice.call(arguments, 2);
                var _cb = function () {
                    callBack.apply(null, args);
                }
                return window.setTimeout(_cb, timeout);
            },
            stopPropagation: function (e) {
                e = e || window.event;
                if (e.stopPropagation) { //W3C阻止冒泡方法 
                    e.stopPropagation();
                }
                else {
                    e.cancelBubble = true; //IE阻止冒泡方法  
                }
            }
        };

        var t = null;

        var hideContent = function (target) {
            jQuery(target).removeClass("active");
        }

        var contentLeaveHandler = function (e) {
            var stripTarget = jQuery(e.target).parents(_option.stripeSelector)[0];
            var step = NEG.ArrayIndexOf(stripes, stripTarget);

            if (jQuery(contents[step]).is(":hidden")) {
                return;
            }

            t = helper.setTimeout(hideContent, 500, stripes[step]);
        }

        var contentEnterHandler = function (e) {
            var stripeTarget = jQuery(e.target).parents(_option.stripeSelector)[0];
            var step = NEG.ArrayIndexOf(stripes, stripeTarget);
            if (jQuery(contents[step]).is(":hidden")) {
                return;
            }
            window.clearTimeout(t);
        }

        var completedHandler = function (step) {

            //show all stripe, if complete happended;
            for (var i = step; i < stripes.length; i++) {
                jQuery(stripes[i]).removeClass(_option.strileDisableClass);
                //afterProcessData(i);
            }

            $buttonGo.removeClass(_option.buttonGoDisableClass);

            if (!stripeStatus.buttonGoEventDefined) {
                NEG($buttonGo[0]).on("click", goClickHandler);
                stripeStatus.buttonGoEventDefined = true;
            }
        }

        var preProcess = function (step, target, isRefill) {
            if (!_option.validateData) {
                process(step, target, true);
            }


            if (_option.validateData
                && target
                && target.getAttribute(_option.stripeValue) != null
                && _option.validateData(step)) {

                process(step, target, isRefill);
            }
        }

        var process = function (step, target, isNeedProcessData) {

            if (!target) {
                return false;
            }

            var key = target.getAttribute(_option.stripeValue);

            if (!key) { return false; }
            // compatible if need.
            selectedData.set(stripeStatus[step].stripeKey, { "key": key, "value": key }, target);
            beforeProcessData(step, selectedData);

            //处理下一个
            step++;

            var preStep = step - 1, preStripe = stripes[preStep], nextStripe = stripes[step], preContent = contents[preStep], nextContent = contents[step];

            isNeedProcessData && _option.processData(selectedData, { "stripe": preStripe, "content": preContent }, { "stripe": nextStripe, "content": nextContent });

            afterProcessData(step);

            if (step >= stripes.length || step > stripeStatus.autoExpandLength) {
                isCompleted = true;
                _option.completed && _option.completed();
                completedHandler(step);
            }
        };

        var contentClickHandler = function (e) {
            var target = e.target || e.srcElement;

            var dataTarget = jQuery(target).attr(_option.stripeValue) != null ?
                target :
                jQuery(target).parents("[" + _option.stripeValue + "]")[0];

            //获取当前的step
            var step = NEG.ArrayIndexOf(contents, target) > -1 ?
                NEG.ArrayIndexOf(contents, target) :
                NEG.ArrayIndexOf(contents, jQuery(target).parents(_option.contentSelector)[0]);

            helper.stopPropagation(e);

            preProcess(step, dataTarget, true);
        }

        var stripeClickHandler = function (e) {

            var target = e.target || e.srcElement;

            //鼠标触发的click和 NEG.trigger 触发的click 不一致，后续check neg代码
            var step = NEG.ArrayIndexOf(stripes, target) > -1 ?
                NEG.ArrayIndexOf(stripes, target) :
                NEG.ArrayIndexOf(stripes, jQuery(target).parents(_option.stripeSelector)[0]);

            var content = contents[step], stripe = stripes[step];

            var isHidden = jQuery(content).is(":hidden");

            if (stripeStatus[step] && !stripeStatus[step].contentEventDefined) {
                NEG(content).on("click", contentClickHandler);

                stripeStatus[step].contentEventDefined = true;
            }

            if (stripeStatus[step] && !stripeStatus[step].contentLeaveEventDefined) {
                jQuery(stripe).on("mouseleave", contentLeaveHandler);
                jQuery(stripe).on("mouseenter", contentEnterHandler);

                stripeStatus[step].contentLeaveEventDefined = true;
            }

            jQuery(stripes).removeClass("active");

            if (isHidden) {
                jQuery(stripe).addClass("active");
            }
            else {
                jQuery(stripe).removeClass("active");
            }
        }

        var afterProcessData = function (step) {

            //第一个stripe 绑定click事件.
            if (!stripeStatus[step]) { return };
            if (!stripeStatus[step].stripeEventDefined) {
                stripes[step] && NEG(stripes[step]).on("click", stripeClickHandler);
                stripeStatus[step].stripeEventDefined = true;
            }

            if (step > 0) {
                jQuery(stripes[step]).removeClass(_option.strileDisableClass);
            }

            //需要自动触发的
            if (stripeStatus[step].autoExpand) {
                NEG(stripes[step]).trigger("click", "");
            }

            if (_option.enableMouseLeave) {
                clearTimeout(t);
            }
        }

        var init = function () {

            var autoExpandLength = 0;
            for (var i = 0; i < stripes.length; i++) {

                var key = stripes[i].getAttribute(_option.stripeKey);
                var stripeEnable = (i == 0);
                var defaultStripeTextList = jQuery("[" + _option.defaultStripeText + "]");
                var autoExpand = stripes[i].getAttribute(_option.autoExpandKey);
                if (autoExpand) {
                    autoExpandLength++;
                }

                stripeStatus[i] = new strip(stripeEnable, key, jQuery(defaultStripeTextList[i]).text(), autoExpand);
            }
            stripeStatus.autoExpandLength = autoExpandLength;
            afterProcessData(0);

            //if has data, do autoFll
            if (data && data.length > 0) {
                Refill(data);
            }
        }

        var Refill = function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    var stripe = jQuery("[" + _option.stripeKey + "='" + data[i].stripeKey + "']");
                    var target = stripe.find("[" + _option.stripeValue + "='" + data[i].stripeValue + "']")[0];

                    preProcess(i, target, false);
                }
            }
            else {
                reStore(0);
            }
        }

        var api = {
            Refill: Refill
        }


        NEG.merge(this, api);
        init();
    };

    return AutoConfigurator;

});
