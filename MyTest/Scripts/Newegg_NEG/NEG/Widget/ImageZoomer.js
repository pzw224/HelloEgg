NEG.Module("NEG.Widget.ImageZoomer", function (require) {
    var jq = require("NEG.ThirdParty.jQuery");
    var maskbuilder = require("NEG.Widget.Mask");

    var defaultOption = {
        magnifierDom: '<div>',
        detailImgProperty: 'imgZoomPic',
        fixPosition: true,
        magnifierBackgroundImg: base.baseURL + "NEG/Resource/Widget/ImageZoomer/tile.gif",
        getRealImgSize: false,
        detailWindowStyle: {}
    };

    var checkConfig = function (config) {
        if (NEG.utility.isDefined(config.target) && NEG.utility.isDefined(config.imgSize) && NEG.utility.isType(config.imgSize.width, "Number") && NEG.utility.isType(config.imgSize.height, "Number")) {
            if (NEG.utility.isDefined(config.detailWindow)) {
                return true;
            } else {
                if (NEG.utility.isDefined(config.getDetailPosition) && NEG.utility.isType(config.getDetailPosition, "Function")
                    && NEG.utility.isDefined(config.getDetailSize) && NEG.utility.isType(config.getDetailSize, "Function")) {
                    var position = config.getDetailPosition();
                    var size = config.getDetailSize();
                    return NEG.utility.isType(position.top, "Number") && NEG.utility.isType(position.left, "Number")
                        && NEG.utility.isType(size.width, "Number") && NEG.utility.isType(size.height, "Number");
                }
            }
        }
        return false;
    };

    var ImageZoomer = function (theConfig, theOption) {
        var config = theConfig;
        var option = theOption;
        var target = jq(config.target);

        var ZoomWindow = function () {
            var maskPara;
            var isDomDetailWindow = NEG.utility.isDefined(config.detailWindow);
            if (isDomDetailWindow) {
                maskPara = { target: config.detailWindow };
            } else {
                maskPara = { size: config.getDetailSize(), position: config.getDetailPosition() };
            }
            var theMaskStyle = NEG.merge(option.detailWindowStyle, {
                "background-color": "white",
                "opacity": "1",
                "overflow": "hidden",
                "z-index": 20000
            });
            var theMask = maskbuilder(maskPara, {
                style: theMaskStyle,
                hideWhenClick: false
            });

            if (!isDomDetailWindow) {
                theMask.on("BEFORE_SHOW", function () {
                    var size = config.getDetailSize();
                    var position = config.getDetailPosition();
                    if (NEG.utility.isDefined(size.width) && NEG.utility.isDefined(size.height)) {
                        theMask.setSize(size);
                    }
                    if (NEG.utility.isDefined(position.top) && NEG.utility.isDefined(position.left)) {
                        theMask.setPosition(position);
                    }
                });
            }

            var zoomWindowDom = jq("<div style='position: absolute'>");
            jq(theMask.dom).append(zoomWindowDom);

            this.setImg = function (imgUrl) {
                var createImgDom = function (imgPath, size) {
                    var imgDom = jq("<img>");
                    imgDom.attr("src", imgPath);
                    imgDom.css(size);
                    return imgDom;
                };

                var getImgDom = function (imgPath, content) {
                    var result;
                    content.children("img").each(function (index, el) {
                        var dom = jq(el);
                        if (dom.attr('src') == imgPath) {
                            result = dom;
                            return;
                        }
                    });
                    return result;
                };

                var img = getImgDom(imgUrl, zoomWindowDom);
                if (!img) {
                    img = createImgDom(imgUrl, config.imgSize);
                    zoomWindowDom.append(img);
                }
                zoomWindowDom.children("img").hide();
                img.show();
            };

            this.setImgPosition = function (position) {
                zoomWindowDom.css({ left: position.left, top: position.top });
            };

            this.show = function () {
                theMask.show();
                zoomWindowDom.show();
            };

            this.getSize = function () {
                if (isDomDetailWindow) {
                    return theMask.getSize();
                } else {
                    return config.getDetailSize();
                }
            };

            this.hide = function () {
                zoomWindowDom.hide();
                theMask.hide();
            };
        };

        var Magnifier = function () {
            var element = null;;
            var position = null;
            var appendToContainer = null;
            var size = { width: 0, height: 0 };
            var init = function () {
                element = jq(option.magnifierDom);
                element.css({ position: "absolute", cursor: "pointer", background: "url(" + option.magnifierBackgroundImg + ")" });
            };
            init();

            this.show = function () {
                appendToContainer = element.appendTo(target);
            };

            this.setSize = function (theSize) {
                size = theSize;
                element.css(theSize);
            };

            this.hide = function () {
                appendToContainer && appendToContainer.remove();
            };

            this.setPosition = function (thePosition) {
                var parentRect = config.target.getBoundingClientRect();
                var offsetX = Math.min(Math.max(0, thePosition.left - parentRect.left - size.width / 2), config.target.clientWidth - size.width);
                var offsetY = Math.min(Math.max(0, thePosition.top - parentRect.top - size.height / 2), config.target.clientHeight - size.height);
                position = { left: offsetX, top: offsetY };
                element.css(position);
            };

            this.getCurrentPos = function () {
                return position;
            };

        };

        option.fixPosition && (target.css("position") == "static") && target.css("position", "relative");

        var zoomWindow = new ZoomWindow();
        var magnifier = new Magnifier();

        var unbindEvent, mouseEnterHandler, mouseMoveHandler, mouseLeaveHandler;
        var bindEvent = function () {
            var calculatePos4ZoomWindow = function (position, dom, magifierPos) {
                var imgSize = config.imgSize;
                var left = -magifierPos.left / dom.clientWidth * imgSize.width;
                var top = -magifierPos.top / dom.clientHeight * imgSize.height;
                return {
                    left: left,
                    top: top
                };
            };

            var getMagifierSize = function () {
                var imgSize = config.imgSize;
                var maskSize = zoomWindow.getSize();
                var mContainerWidth = jQuery(this).width();
                var mContainerHeight = jQuery(this).height();
                var wRatio = imgSize.width / mContainerWidth;
                var hRatio = imgSize.height / mContainerHeight;
                var ratio = Math.max(wRatio, hRatio);
                return {
                    width: Math.round(Math.min(mContainerWidth, maskSize.width / ratio)),
                    height: Math.round(Math.min(mContainerHeight, maskSize.height / ratio))
                };
            };

            mouseEnterHandler || (mouseEnterHandler = function (e) {
                zoomWindow.setImg(jQuery(this).attr(option.detailImgProperty));

                var magifierSize = getMagifierSize.apply(this);
                magnifier.setSize(magifierSize);

                var mPos = { 'left': e.clientX, 'top': e.clientY };
                magnifier.setPosition(mPos);
                var currentpos = magnifier.getCurrentPos();

                zoomWindow.setImgPosition(calculatePos4ZoomWindow(mPos, this, currentpos));

                magnifier.show();
                zoomWindow.show();
            });

            mouseMoveHandler || (mouseMoveHandler = function (e) {
                var mPos = { 'left': e.clientX, 'top': e.clientY };
                magnifier.setPosition(mPos);
                var currentPos = magnifier.getCurrentPos();
                zoomWindow.setImgPosition(calculatePos4ZoomWindow(mPos, this, currentPos));
            });

            mouseLeaveHandler || (mouseLeaveHandler = function (e) {
                zoomWindow.hide();
                magnifier.hide();
            });

            if (!unbindEvent) {
                unbindEvent = function () {
                    target.off('mouseenter', mouseEnterHandler);
                    target.off('mousemove', mouseMoveHandler);
                    target.off('mouseleave', mouseLeaveHandler);
                };
            }
            unbindEvent();

            target.on('mouseenter', mouseEnterHandler);
            target.on('mousemove', mouseMoveHandler);
            target.on('mouseleave', mouseLeaveHandler);

        };


        this.start = function () {
            bindEvent();
        };
        this.stop = function () {
            unbindEvent && unbindEvent();
        };
    };

    var imageZoomerBuilder = function (config, option) {
        var imageZoomer;

        /*为了launch 不出错而写的特殊的逻辑兼容原先的接口*/
        if (config && option && option.detailWindow && NEG.utility.isDefined(config.length) && config.length > 0) {
            for (var i = 0; i < config.length; i++) {
                var zoomer = new ImageZoomer({
                    target: config[i],
                    imgSize: { width: 1280, height: 960 },
                    detailWindow: option.detailWindow[0]
                }, defaultOption);
                zoomer.start();
            }
            return;
        }

        if (checkConfig(config) && (!config.target.length)) {
            option || (option = {});
            NEG.blend(
                option,
                defaultOption,
                { cover: false, mergePrototype: false }
            );
            imageZoomer = new ImageZoomer(config, option);
        }
        return imageZoomer;
    };

    return imageZoomerBuilder;
});