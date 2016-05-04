NEG.Module("NEG.Widget.Mask", function(require) {
    var jq = require("NEG.ThirdParty.jQuery");

    var defaultOption = {
        style: {
            "background-color": "black",
            "opacity": "0.5",
            "z-index": "99999"
        },
        needIFrame: false,
        hideWhenClick: true,
        supportResize: false
    };
    var events = {
        "BEFORE_SHOW": "Widget_Mask_beforeShow",
        "AFTER_SHOW": "Widget_Mask_afterShow",
        "BEFORE_HIDE": "Widget_Mask_beforeHide",
        "AFTER_HIDE": "Widget_Mask_afterHide",
        "BEFORE_RESIZE": "Widget_Mask_beforeResize",
        "AFTER_RESIZE": "Widget_Mask_afterResize"
    };

    var maskCurId = 0;
    var domList = {}, domsList = {}, domMaskList = {}, domsMaskList = {};


    var checkConfig = function(theConfig) {
        return NEG.utility.isDefined(theConfig.target)
            || (
                NEG.utility.isDefined(theConfig.size)
                    && NEG.utility.isDefined(theConfig.size.width) && NEG.utility.isDefined(theConfig.size.height)
                    && NEG.utility.isDefined(theConfig.position)
                    && NEG.utility.isDefined(theConfig.position.top) && NEG.utility.isDefined(theConfig.position.left));
    };

    var getDomSize = function(targetDom) {
        var width, height;
        if (targetDom !== document.body) {
            var jTargetDom = jq(targetDom);
            width = jTargetDom.innerWidth() + parseInt(jTargetDom.css("border-left-width")) + parseInt(jTargetDom.css("border-right-width"))
            height = jTargetDom.innerHeight() + parseInt(jTargetDom.css("border-top-width")) + parseInt(jTargetDom.css("border-bottom-width"));
        } else {
            width = jq(document).width();
            height = jq(document).height();
        }

        return { "width": width, "height": height };
    };

    var getDomPosition = function(targetDom) {
        var res = jq(targetDom).offset();
        return { top: res.top, left: res.left }
    };

    var adjustMask = function(theDom, position, size) {
        theDom.css("height", size.height);
        theDom.css("width", size.width);
        theDom.css("top", position.top);
        theDom.css("left", position.left);
    };

    var getMultiDomSizeAndPosition = function(targets) {
        var boundryTopLeftPoint, boundryBottomRightPoint;
        var domSize, domPosition, topLeft, bottomRight;

        for (var i = 0; i < targets.length; i++) {
            domSize = getDomSize(targets[i]);
            domPosition = getDomPosition(targets[i]);
            topLeft = { top: domPosition.top, left: domPosition.left }
            bottomRight = { top: domPosition.top + domSize.height, left: domPosition.left + domSize.width };

            if (boundryTopLeftPoint) {
                boundryTopLeftPoint.left > topLeft.left && (boundryTopLeftPoint.left = topLeft.left);
                boundryTopLeftPoint.top > topLeft.top && (boundryTopLeftPoint.top = topLeft.top);
            } else {
                boundryTopLeftPoint = topLeft;
            }
            if (boundryBottomRightPoint) {
                boundryBottomRightPoint.left < bottomRight.left && (boundryBottomRightPoint.left = bottomRight.left);
                boundryBottomRightPoint.top < bottomRight.top && (boundryBottomRightPoint.top = bottomRight.top);
            } else {
                boundryBottomRightPoint = bottomRight;
            }
        }
        return {
            size: {
                height: boundryBottomRightPoint.top - boundryTopLeftPoint.top,
                width: boundryBottomRightPoint.left - boundryTopLeftPoint.left
            },
            position: boundryTopLeftPoint
        };
    };

    var Mask = function(config, theOption) {
        var theSelf = this;
        var option = theOption;
        var theDom;
        var maskSize = config.size && { width: config.size.width, height: config.size.height },
            maskPosition = config.position && { top: config.position.top, left: config.position.left };

        theDom = jq("<div></div>");
        theDom.hide();
        jq(document.body).append(theDom);


        var resizeFn = (function() {
            var result;
            if (config.target) {
                if (config.target.length && config.target.length > 0) {
                    result = function() {
                        NEG(theSelf).trigger(events.BEFORE_RESIZE);
                        theDom.hide();
                        var sizeAndPosition = getMultiDomSizeAndPosition(config.target);
                        domSize = sizeAndPosition.size;
                        domPosition = sizeAndPosition.position;
                        adjustMask(theDom, domPosition, domSize);
                        theDom.show();
                        NEG(theSelf).trigger(events.AFTER_RESIZE);
                    };
                } else {
                    result = function() {
                        NEG(theSelf).trigger(events.BEFORE_RESIZE);
                        theDom.hide();
                        var jTheTarget = jQuery(config.target);
                        jTheTarget.css("position") == "static" && jTheTarget.css("position", "relative");
                        if (jTheTarget.css("display") != "none") {
                            domSize = getDomSize(config.target);
                            domPosition = getDomPosition(config.target);
                            adjustMask(theDom, domPosition, domSize);
                        }
                        theDom.show();
                        NEG(theSelf).trigger(events.AFTER_RESIZE);
                    };
                }
            } else {
                result = function() {
                    NEG(theSelf).trigger(events.BEFORE_RESIZE);
                    NEG(theSelf).trigger(events.AFTER_RESIZE);
                };
            }
            return result;
        })();

        if (option.needIFrame) {
            var iframe = jq("<iframe>");
            theDom.append(iframe);

        } else {
            if (option.hideWhenClick) {
                theDom.click(function() {
                    NEG(theSelf).trigger(events.BEFORE_HIDE);
                    theDom.hide();
                    option.supportResize && jq(window).off("resize", resizeFn);
                    NEG(theSelf).trigger(events.AFTER_HIDE);
                });
            }
            theDom.css(option.style);
        }
        theDom.css("position", "absolute");
        theDom.css("float", "left");

        this.dom = theDom[0];
        this.targetDoms = (function() {
            return config.target && ([].concat(config.target));
        })();


        this.show = function() {
            NEG(this).trigger(events.BEFORE_SHOW);
            var domSize, domPosition;
            if (config.target) {
                if (config.target.length && config.target.length > 0) {
                    var sizeAndPosition = getMultiDomSizeAndPosition(config.target);
                    domSize = sizeAndPosition.size;
                    domPosition = sizeAndPosition.position;
                } else {
                    var jTheTarget = jQuery(config.target);
                    jTheTarget.css("position") == "static" && jTheTarget.css("position", "relative");
                    if (jTheTarget.css("display") != "none") {
                        domSize = getDomSize(config.target);
                        domPosition = getDomPosition(config.target);
                    }
                }
                if ((!domSize) || (!domPosition)) {
                    return;
                }
            } else {
                domSize = maskSize;
                domPosition = maskPosition;
            }
            option.supportResize && jq(window).on("resize", resizeFn);

            adjustMask(theDom, domPosition, domSize);
            theDom.show();
            NEG(this).trigger(events.AFTER_SHOW);
        };
        this.hide = function() {
            NEG(this).trigger(events.BEFORE_HIDE);
            theDom.hide();
            option.supportResize && jq(window).off("resize", resizeFn);
            NEG(this).trigger(events.AFTER_HIDE);
        };

        this.getSize = function() {
            if (config.target) {
                if (config.target.length && config.target.length > 0) {
                    return getMultiDomSizeAndPosition(config.target).size;
                } else {
                    return getDomSize(config.target);
                }
            } else {
                return maskSize;
            }
        };

        this.setSize = function(size) {
            if (!config.target && size && NEG.utility.isDefined(size.width) && NEG.utility.isDefined(size.height)) {
                maskSize = size;
            }
        };

        this.getPosition = function() {
            if (config.target) {
                if (config.target.length && config.target.length > 0) {
                    return getMultiDomSizeAndPosition(config.target).position;
                } else {
                    return getDomPosition(config.target);
                }
            } else {
                return maskPosition;
            }
        };

        this.setPosition = function(position) {
            if (!config.target && position && NEG.utility.isType(position.top, "Number") && NEG.utility.isType(position.left, "Number")) {
                maskPosition = position;
            }
        };

        this.on = function(eventName, fn) {
            var eName = events[eventName];
            if (eName && fn) {
                NEG(this).on(eName, fn);
            }
        };
        this.off = function(eventName, fn) {
            var eName = events[eventName];
            if (eName && fn) {
                NEG(this).off(eName, fn);
            }
        };
    };

    var maskBuilder = function(config, option) {
        if (NEG.utility.isType(config, 'Object') && checkConfig(config)) {
            option || (option = {});
            if (option.style) {
                NEG.blend(
                    option.style,
                    defaultOption.style,
                    { cover: false, mergePrototype: false }
                );
            }
            NEG.blend(
                option,
                defaultOption,
                { cover: false, mergePrototype: false }
            );
            var mask;
            if (config.target) {
                config.target === document && (config.target = document.body);
                var isExist = false, index;

                if (config.target.length && config.target.length > 0) {
                    for (var id in domsList) {
                        index = id;
                        var doms = domsList[id].slice();
                        var j = 0, domFinded = true;
                        for (var j = 0; (j < config.target.length) && domFinded; j++) {
                            domFinded = false;
                            for (var i = 0; i < doms.length; i++) {
                                if (config.target[j] === doms[i]) {
                                    doms.splice(i, 1);
                                    domFinded = true;
                                    break;
                                }
                            }
                            if (!domFinded) {
                                break;
                            }
                        }
                        if (doms.length == 0 && domFinded) {
                            isExist = true;
                        }
                    }
                    if (isExist) {
                        mask = domsMaskList[index];
                    } else {
                        mask = new Mask(config, option);
                        domsList[maskCurId] = config.target;
                        domsMaskList[maskCurId] = mask;
                        maskCurId++;
                    }
                } else {
                    for (var id in domList) {
                        index = id;
                        if (config.target === domList[id]) {
                            isExist = true;
                            break;
                        }
                    }
                    if (isExist) {
                        mask = domMaskList[index];
                    } else {
                        mask = new Mask(config, option);
                        domList[maskCurId] = config.target;
                        domMaskList[maskCurId] = mask;
                        maskCurId++;
                    }
                }

            } else {
                mask = new Mask(config, option);
            }
            return mask;
        }
    };

    return maskBuilder;
});