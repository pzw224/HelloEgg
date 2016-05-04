NEG.Module('NEG.Widget.Popup', function (require) {
    var jq = require('NEG.ThirdParty.jQuery');
    var maskBuilder = require('NEG.Widget.Mask');

    var defaultOption = {
        hideWhenClickMask: true,
        maskStyle: {
            "background-color": "black",
            "opacity": "0.5",
            "z-index": "10000"
        },
        popupStyle: {
            "background-color": "white",
            "opacity": "1",
            "z-index": "20000"
        },
        needMask: true,
        autoCenterAfterResize: false
    };

    var events = {
        "BEFORE_SHOW": "Widget_Popup_beforeShow",
        "AFTER_SHOW": "Widget_Popup_afterShow",
        "BEFORE_HIDE": "Widget_Popup_beforeHide",
        "AFTER_HIDE": "Widget_Popup_afterHide",
        "BEFORE_RESIZE": "Widget_Popup_beforeResize",
        "AFTER_RESIZE": "Widget_Popup_afterResize"
    };

    var checkConfig = function (config) {
        return NEG.utility.isDefined(config.content);
    };


    var Popup = function (config, option) {
        var theSelf = this;
        var popup = maskBuilder({
            size: (NEG.utility.isDefined(option.popupStyle.width) && NEG.utility.isDefined(option.popupStyle.height)) ? { width: option.popupStyle.width, height: option.popupStyle.height } : { 'height': 1, 'width': 1 },
            position: (NEG.utility.isDefined(option.popupStyle.left) && NEG.utility.isDefined(option.popupStyle.top)) ? { left: option.popupStyle.left, top: option.popupStyle.top } : { left: 0, top: 0 }
        }, {
            hideWhenClick: false,
            needIFrame: false,
            style: option.popupStyle
        });

        jq(popup.dom).append(jq(config.content));

        var popupMask;
        if (option.needMask) {
            popupMask = maskBuilder({ target: window.document }, {
                style: option.maskStyle,
                hideWhenClick: option.hideWhenClickMask,
                supportResize: true
            });
            popupMask.on("BEFORE_HIDE", function () {
                NEG(theSelf).trigger(events.BEFORE_HIDE);
                popup.hide();
                NEG(theSelf).trigger(events.AFTER_HIDE);
            });
        } else {
            popupMask = null;
        }

        var thePopup = jq(popup.dom);
        var getCenterPostion = function () {
            var win = jq(window);
            return {
                left: win.scrollLeft() + (win.width() - thePopup.width()) / 2,
                top: win.scrollTop() + (win.height() - thePopup.height()) / 2
            };
        };

        this.mask = popupMask;
        this.dom = popup.dom;


        var resizeFn = function () {
            NEG(theSelf).trigger(events.BEFORE_RESIZE);
            option.autoCenterAfterResize && (NEG.utility.isDefined(option.popupStyle.left) || NEG.utility.isDefined(option.popupStyle.top)) || thePopup.css(getCenterPostion());
            NEG(theSelf).trigger(events.AFTER_RESIZE);
        };

        this.show = function () {
            NEG(this).trigger(events.BEFORE_SHOW);
            popupMask && popupMask.show();
            jq(window).on("resize", resizeFn);
            popup.show();
            (option.popupStyle.width && option.popupStyle.height) || (thePopup.css("height", "auto"), thePopup.css("width", "auto"));
            (NEG.utility.isDefined(option.popupStyle.left) || NEG.utility.isDefined(option.popupStyle.top)) || thePopup.css(getCenterPostion());
            NEG(this).trigger(events.AFTER_SHOW);
        };

        this.hide = function () {
            NEG(this).trigger(events.BEFORE_HIDE);
            popupMask && popupMask.hide();
            jq(window).off("resize", resizeFn);
            popup.hide();
            NEG(this).trigger(events.AFTER_HIDE);
        };

        this.on = function (eventName, fn) {
            var eName = events[eventName];
            if (eName && fn) {
                NEG(this).on(eName, fn);
            }
        };

        this.off = function (eventName, fn) {
            var eName = events[eventName];
            if (eName && fn) {
                NEG(this).off(eName, fn);
            }
        };
    };

    var popupBuilder = function (config, option) {
        if (NEG.utility.isType(config, 'Object') && checkConfig(config)) {
            option || (option = {});
            //merge maskStyle
            if (option.maskStyle) {
                NEG.blend(
                    option.maskStyle,
                    defaultOption.maskStyle,
                    { cover: false, mergePrototype: false }
                );
            }
            //merge popupStyle
            if (option.popupStyle) {
                NEG.blend(
                    option.popupStyle,
                    defaultOption.popupStyle,
                    { cover: false, mergePrototype: false }
                );
            }

            NEG.blend(
                option,
                defaultOption,
                { cover: false, mergePrototype: false }
            );

            var popup;
            popup = new Popup(config, option);
            return popup;
        }
    };

    return popupBuilder;
});