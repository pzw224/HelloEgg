NEG.Module("NEG.Widget.RangeSlider", function (require) {

    var isSupportTouch = ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch;

    var touchEvents = {
        touchStart: isSupportTouch ? "touchstart" : "mousedown",
        touchMove: isSupportTouch ? "touchmove" : "mousemove",
        touchEnd: isSupportTouch ? "touchend" : "mouseup"
    }
    var jq = require("NEG.ThirdParty.jQuery");

    var events = {
        "ON_CHANGE": "Widget_Slider_onChange",
        "AFTER_CHANGED": "Widget_Slider_afterChange"
    };

    var defaultOption = {
        isContinuous: true,
        //isHorizontal:true,
        btnStyle: {
            "background": "#f6f6f6",
            "border": "1px solid #cccccc",
            "width": "16px",
            "height": " 1.2em",
            "cursor": "default",
            "top": "-0.2em",
            "-moz-border-radius": "4px",
            "-webkit-border-radius": "4px",
            "border-radius": "4px"
        },
        statusBarStyle: {
            "background": "#f6a828",
            "-moz-border-radius": "4px",
            "-webkit-border-radius": "4px",
            "border-radius": "4px",
            "top": "0.1em",
            "height": " 0.8em"
        },
        backgroundStyle: {
            "background": "#eeeeee",
            "-moz-border-radius": "4px",
            "-webkit-border-radius": "4px",
            "border-radius": "4px",
            "height": "1em",
            "top": "-0.1em"
        },
        btnHoverStyle: {
            "border": "1px solid #fbcb09",
            "background": "#fdf5ce"
        },
        style: {
            'height': '16px',
            'width': '100px'
        }
    };

    var defaultCoverOption = {
        btnStyle: {
            "position": "absolute",
            "z-index": 2

        },
        statusBarStyle: {
            "position": "absolute",
            "border-width": "0px",
            "border-left-width": "0px",
            "border-right-width": "0px",
            "border-top-width": "0px",
            "border-bottom-width": "0px",
            "z-index": 1
        },
        backgroundStyle: {
            "border-width": "0px",
            "border-left-width": "0px",
            "border-right-width": "0px",
            "border-top-width": "0px",
            "border-bottom-width": "0px"
        },
        btnHoverStyle: {

        },
        style: {
            "position": "relative",
            "display": "block",
            "box-sizing": "content-box"
        }
    };

    /* static  end*/

    var checkConfig = function (config) {
        return NEG.utility.isDefined(config.data) && NEG.utility.isType(config.data.min, "Number") && NEG.utility.isType(config.data.max, "Number") && config.data.min < config.data.max;
    };

    var getDomBorder = function (jQueryDom) {
        var left = jQueryDom.css("border-left-width") || 0;
        var right = jQueryDom.css("border-right-width") || 0;
        var top = jQueryDom.css("border-top-width") || 0;
        var bottom = jQueryDom.css("border-bottom-width") || 0;
        return { left: parseInt(left), right: parseInt(right), top: parseInt(top), bottom: parseInt(bottom) };
    };

    var getDomLength = function (jQueryDom) {
        var board = getDomBorder(jQueryDom);
        var width = jQueryDom.innerWidth();
        return board.left + board.right + width;
    };


    var HorizontalSlider = function (config, option) {
        var theInstance = this, theInstanceDom;
        var background, leftBtn, rightBtn, statusBar;

        var checkValue = function (value) {
            var result = NEG.utility.isType(value.min, "Number") && NEG.utility.isType(value.max, "Number") && value.min <= value.max;
            if (result) {

                (value.min < config.data.min) && (value.min = config.data.min);
                (value.max > config.data.max) && (value.max = config.data.max);
            }
            return result;
        };

        var createUI = function () {
            theInstanceDom = jq("<div />");
            background = jq("<div />");
            leftBtn = jq("<a />");
            rightBtn = jq("<a />");
            statusBar = jq("<div />");

            background.append(leftBtn);
            background.append(rightBtn);
            background.append(statusBar);

            theInstanceDom.append(background);
        };

        var setStyle = function () {
            theInstanceDom.css(option.style);
            background.css(option.backgroundStyle);
            leftBtn.css(option.btnStyle);
            rightBtn.css(option.btnStyle);
            statusBar.css(option.statusBarStyle);
            statusBar.css("width", "100%");
            leftBtn.css("left", -getDomLength(leftBtn) / 2);
            rightBtn.css("left", parseInt(option.style.width) + getDomLength(rightBtn) / 2 - getDomLength(leftBtn));
        };

        var changeUI = function (btnPos, btnDom) {
            jq(btnDom).css('left', btnPos.offsetLeft);
            if (btnDom === leftBtn) {
                statusBar.css('left', btnPos.offsetLeft + getDomLength(leftBtn) / 2);
            }
            statusBar.width(rightBtn.offset().left + getDomLength(rightBtn) / 2 - leftBtn.offset().left - getDomLength(leftBtn) / 2);
        };

        var getBoundary = (function () {
            var fContinuous = function () {
                var dataScope = config.data.max - config.data.min;
                var backgroundOffset = background.offset(),
                    rbl = getDomLength(rightBtn),
                    lbl = getDomLength(leftBtn),
                    rbOffset = rightBtn.offset(),
                    lbOffset = leftBtn.offset();
                var statusLength = getDomLength(background) - lbl / 2 - rbl / 2;
                var resultBig, resultSmall;
                var minLength = lbOffset.left + lbl / 2.0 - backgroundOffset.left;
                var maxLength = rbOffset.left - lbOffset.left - lbl + minLength;
                resultSmall = minLength / statusLength * dataScope + config.data.min;
                resultBig = maxLength / statusLength * dataScope + config.data.min;
                resultBig < resultSmall && (resultBig = resultSmall);
                return { max: resultBig, min: resultSmall };
            };
            var fDisContinuous = function () {
            };
            return option.isContinuous ? fContinuous : fDisContinuous;
        })();

        var bindEvent = (function () {
            var bContinuous = function () {
                var leftBtnMinLeft = function () {
                    return background.offset().left - getDomLength(leftBtn) / 2;
                };
                var rightBtnMaxLeft = function () {
                    return background.offset().left + getDomLength(background) - getDomLength(rightBtn) / 2;
                };

                var btnNoHoverStyle = (function () {
                    var res = {};
                    for (var theStyle in option.btnHoverStyle) {
                        res[theStyle] = leftBtn.css(theStyle);
                    }
                    return res;
                })();
                leftBtn.hover(function () {
                    jq(this).css(option.btnHoverStyle);
                }, function () {
                    jq(this).css(btnNoHoverStyle);
                });
                rightBtn.hover(function () {
                    jq(this).css(option.btnHoverStyle);
                }, function () {
                    jq(this).css(btnNoHoverStyle);
                });


                background.click(function (eClick) {
                    if (eClick.target === leftBtn[0] || eClick.target === rightBtn[0]) {
                        return;
                    }
                    var mousePosX = Math.floor(eClick.pageX);
                    var btn, btnleft, btnOffsetLeft;
                    var backgroundOffset = background.offset(),
                        rbl = getDomLength(rightBtn),
                        lbl = getDomLength(leftBtn),
                        rbOffset = rightBtn.offset(),
                        lbOffset = leftBtn.offset();


                    var isLeftArea = mousePosX < lbOffset.left, isRightArea = mousePosX > rbOffset.left + rbl;
                    var getBtn = function () {
                        if (isLeftArea) {
                            return leftBtn;
                        } else if (isRightArea) {
                            return rightBtn;
                        } else {
                            return (mousePosX - lbOffset.left - lbl - rbOffset.left + mousePosX) < 0 ? leftBtn : rightBtn;
                        }
                    };
                    btn = getBtn();

                    if (btn === leftBtn) {
                        btnleft = mousePosX - lbl / 2;
                        statusBar.css("left", mousePosX - backgroundOffset.left);
                        (btnleft + lbl > rbOffset.left) && (btnleft = rbOffset.left - lbl);
                    } else {
                        btnleft = mousePosX - rbl / 2;
                        (btnleft < lbOffset.left + lbl) && (btnleft = lbOffset.left + lbl);
                    }
                    btnOffsetLeft = btnleft - backgroundOffset.left;
                    changeUI({ offsetLeft: btnOffsetLeft }, btn);
                    NEG(theInstance).trigger(events["AFTER_CHANGED"], getBoundary());
                });



                var startDrag = function (dom, event, isLeft) {
                    var stopDrag = function () {
                        NEG(theInstance).trigger(events["AFTER_CHANGED"], getBoundary());
                        jq(document).unbind('blur');
                        NEG(document).off(touchEvents.touchMove, onTouchMove);
                        jq(document).unbind(touchEvents.touchEnd);
                    };


                    jq(document).blur(function (blurE) {
                        stopDrag(dom, blurE);
                    });

                    jq(document).bind(touchEvents.touchEnd, function (eUp) {
                        stopDrag(dom, eUp);
                    });


                    var initialMousePos = {
                        x: isSupportTouch ? event.targetTouches[0].pageX : event.pageX
                    };


                    var onTouchMove = function (eMove) {

                        isSupportTouch ? eMove.preventDefault() : eMove.stopPropagation();

                        var curMousePos = {
                            x: isSupportTouch ? eMove.targetTouches[0].pageX : eMove.pageX
                        };

                        var dx = curMousePos.x - initialMousePos.x;
                        var curBtnPosLeft = initialDomPos.left + dx,
                            lbl = getDomLength(leftBtn),
                            backgroundOffset = background.offset(),
                            rightBtnOffset = rightBtn.offset(),
                            leftBtnOffset = leftBtn.offset(),
                            theLeftBtnMinLeft = leftBtnMinLeft(),
                            theRightBtnMaxLeft = rightBtnMaxLeft();
                        var curBtnOffsetLeft;
                        if (isLeft) {
                            if (curBtnPosLeft <= theLeftBtnMinLeft) {
                                curBtnOffsetLeft = theLeftBtnMinLeft - backgroundOffset.left;
                            } else if (curBtnPosLeft + lbl >= rightBtnOffset.left) {
                                curBtnOffsetLeft = rightBtnOffset.left - lbl - backgroundOffset.left;
                            } else {
                                curBtnOffsetLeft = curBtnPosLeft - backgroundOffset.left;
                            }
                        } else {
                            if (curBtnPosLeft >= theRightBtnMaxLeft) {
                                curBtnOffsetLeft = theRightBtnMaxLeft - backgroundOffset.left;
                            } else if (curBtnPosLeft <= leftBtnOffset.left + lbl) {
                                curBtnOffsetLeft = leftBtnOffset.left + lbl - backgroundOffset.left;
                            } else {
                                curBtnOffsetLeft = curBtnPosLeft - backgroundOffset.left;
                            }
                        }
                        changeUI({ offsetLeft: curBtnOffsetLeft }, isLeft ? leftBtn : rightBtn);
                        NEG(theInstance).trigger(events["ON_CHANGE"], getBoundary());

                        if (window.getSelection) {
                            window.getSelection().removeAllRanges();
                        } else if (document.selection) {
                            document.selection.empty();
                        }
                    };

                    var initialDomPos = jq(dom).offset();
                    NEG(document).on(touchEvents.touchMove, onTouchMove);
                };

                NEG(leftBtn[0]).on(touchEvents.touchStart, function (e) {
                    startDrag(this, e, true);
                });

                NEG(rightBtn[0]).on(touchEvents.touchStart, function (e) {
                    startDrag(this, e, false);
                });
            };

            var bDiscontinuous = function () {
            };

            return option.isContinuous ? bContinuous : bDiscontinuous;
        })();


        createUI();
        setStyle();
        bindEvent();


        //begin interface
        this.dom = theInstanceDom;

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

        this.setValue = (function () {
            var sContinuous = function (value) {
                if (checkValue(value)) {
                    var dataScope = config.data.max - config.data.min;
                    var rbl = getDomLength(rightBtn),
                        lbl = getDomLength(leftBtn);
                    var statusLength = getDomLength(background) - lbl / 2 - rbl / 2;
                    var leftBtnOffset = (value.min - config.data.min) / dataScope * statusLength - lbl / 2;
                    var rightBtnOffset = (value.max - config.data.min) / dataScope * statusLength - rbl / 2 + lbl;
                    changeUI({ offsetLeft: leftBtnOffset }, leftBtn);
                    changeUI({ offsetLeft: rightBtnOffset }, rightBtn);
                }
            };
            var sDiscontinuous = function (value) {

            };
            return option.isContinuous ? sContinuous : sDiscontinuous;
        })();
    };


    var sliderBuilder = function (theConfig, theOption) {
        var slider;

        if (checkConfig(theConfig)) {
            theOption || (theOption = {});
            for (var cssType in defaultOption) {
                var defaultItem = defaultOption[cssType];
                var theOptionItem = theOption[cssType];
                if (NEG.utility.isType(defaultItem, "Object")) {
                    if (!NEG.utility.isDefined(theOptionItem)) {
                        theOption[cssType] = {};
                        theOptionItem = theOption[cssType];
                    }
                    NEG.blend(
                        theOptionItem,
                        defaultItem,
                        { cover: false, mergePrototype: false }
                    );

                    defaultCoverOption[cssType] && NEG.blend(
                        theOptionItem,
                        defaultCoverOption[cssType],
                        { cover: true, mergePrototype: false }
                    );
                }
            }
            NEG.blend(
                theOption,
                defaultOption,
                { cover: false, mergePrototype: false }
            );
            slider = new HorizontalSlider(theConfig, theOption);
        }
        return slider;
    };

    return sliderBuilder;
});

