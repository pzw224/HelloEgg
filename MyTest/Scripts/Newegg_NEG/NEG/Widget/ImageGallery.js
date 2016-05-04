NEG.Module("NEG.Widget.ImageGallery", function (require) {
    var jq = require("NEG.ThirdParty.JQuery");
    var popupBuilder = require("NEG.Widget.Popup");

    var blankImgSrc = base.baseURL + "NEG/Resource/Widget/ImageGallery/none.gif";
    var sprProduct = base.baseURL + "NEG/Resource/Widget/ImageGallery/spr_product.6.6.2.png";
    var imageGalleryPng = base.baseURL + "NEG/Resource/Widget/ImageGallery/imageGallery.png";

    var events = {
        "BEFORE_SHOW": "Widget_ImageGallery_beforeShow",
        "AFTER_SHOW": "Widget_ImageGallery_afterShow",
        "BEFORE_HIDE": "Widget_ImageGallery_beforeHide",
        "AFTER_HIDE": "Widget_ImageGallery_afterHide",
        "IMAGE_CHANGED": "Widget_ImageGallery_imageChanged"
    };

    var defaultOption = {
        hideWhenClickMask: true,
        popupStyle: {
            width: '992px',
            height: '579px',
            'border-radius': '7px',
            padding: '15px',
            border: '1px solid black',
            '-webkit-border-horizontal-spacing': '0px',
            '-webkit-border-vertical-spacing': '0px',
            'background-image': 'none',
            'background-origin': 'padding-box',
            'background-color': 'white'
        },
        needMask: true,
        maskStyle: null,
        KeyboardEnable: true,
        thumbnailStyle: {
            width: '60px',
            height: '45px',
            display: 'block',
            padding: 0
        }
    };

    var internalEvents = {
        "IMAGE_CHANGED": "Widget_ImageGallery_Itnl_imageChanged",
        "SHOW_PREVIOUS": "Widget_ImageGallery_Itnl_showPrevious",
        "SHOW_NEXT": "Widget_ImageGallery_Itnl_showNext"
    };

    var DetailedView = function (config, option, eventObj) {
        var instance = this;
        var dom = jq("<div>");
        var slideLeft = jq("<div>");
        var leftImg = jq("<img alt='Previous Image' src='" + blankImgSrc + "' />");
        slideLeft.append(leftImg);
        leftImg.css({
            width: '30px',
            height: '50px',
            background: 'url(' + imageGalleryPng + ') no-repeat',
            'background-position': '0 top'
        });
        slideLeft.css({
            "float": "left",
            "cursor": "pointer",
            "display": "inline-block",
            "position": "relative",
            "top": "200px"
        });
        slideLeft.click(function () {
            NEG(eventObj).trigger(internalEvents["SHOW_PREVIOUS"]);
        });

        var slideRight = jq("<div>");
        var rightImg = jq("<img alt='Next Image' src='" + blankImgSrc + "' />");
        slideRight.append(rightImg);
        rightImg.css({
            width: '30px',
            height: '50px',
            background: 'url(' + imageGalleryPng + ') no-repeat',
            'background-position': '-50px top'
        });
        slideRight.css({
            "float": "left",
            "cursor": "pointer",
            "display": "inline-block",
            "position": "relative",
            "top": "200px"
        });
        slideRight.click(function () {
            NEG(eventObj).trigger(internalEvents["SHOW_NEXT"]);
        });

        var contentCache = {};
        var content = jq("<div>");
        var getContent = function (args) {
            var theC = contentCache[args.index];
            if (!theC) {
                theC = jq(args.content);
                theC.css({
                    width: '660px',
                    height: '525px'
                });
                content.append(theC);
                contentCache[args.index] = theC;
            }
            return theC;
        };

        content.css({ 'display': 'inline-block' });

        dom.append(slideLeft);
        dom.append(content);
        dom.append(slideRight);

        dom.css({
            "float": "left",
            "width": "725px",
            "height": "535px",
            "position": "relative",
            "left": "-10px",
            "display": "block",
            "top": "10px"
        });
        slideLeft.css("visibility", "hidden");

        NEG(eventObj).on(internalEvents["IMAGE_CHANGED"], function (target, args) {
            instance.display(args);
            slideRight.css("visibility", "visible");
            slideLeft.css("visibility", "visible");
            args.index == 0 && (slideLeft.css("visibility", "hidden"));
            args.index + 1 == config.imgList.length && (slideRight.css("visibility", "hidden"));
        });

        this.dom = dom;
        this.display = function (args) {
            var theContent = getContent(args);
            for (var item in contentCache) {
                contentCache[item].hide();
            }
            jq(theContent).show();
        };
        instance.display({ index: 0, content: config.imgList[0].content });
    };

    var ImageListView = function (config, option, eventObj) {
        var instance = this;
        var flist = config.imgList;
        var dom = jq("<ul>");
        var objList = { jqList: [], domList: [] };
        var selectedIndex = 0;
        for (var i = 0; i < flist.length; i++) {
            var theImage = flist[i];
            var temp = jq("<li>");
            var theTitle = NEG.utility.isDefined(theImage.title) ? theImage.title : "";
            var img = jq("<img  title='" + theTitle + "' alt='" + theTitle + "' src='" + theImage.thumbnailSrc + "' />");

            img.css(option.thumbnailStyle[i]);
            temp.append(img);
            temp.css({
                display: 'list-item',
                'text-align': '-webkit-match-parent',
                "float": "left",
                "border": i == 0 ? "1px solid blue" : "1px solid #ccc",
                "margin": "0 5px 5px 0"
            });
            objList.domList.push(temp[0]);

            temp.hover(function () {
                selectedIndex == NEG.cast(objList.domList).indexOf(this) > -1 || jq(this).css({
                    border: '1px solid black'
                });
            }, function () {
                jq(this).css({
                    border: selectedIndex == NEG.cast(objList.domList).indexOf(this) > -1 ? '1px solid blue' : '1px solid #ccc'
                });
            });
            temp.click(function () {
                resetSelected();
                setSelected(this);
                selectedIndex = NEG.cast(objList.domList).indexOf(this);
                var selectedConfig = flist[selectedIndex];
                var index = NEG.cast(objList.domList).indexOf(this);
                NEG(eventObj).trigger(internalEvents["IMAGE_CHANGED"], { index: index, content: selectedConfig.content });
                NEG(eventObj).trigger(events["IMAGE_CHANGED"], { index: index, config: selectedConfig });
            });
            dom.append(temp);
            objList.jqList.push(temp);
        }

        dom.css({
            'float': 'right',
            width: '201px',
            'list-style': 'none',
            'display': 'block',
            'position': 'relative',
            top: '10px'
        });

        var resetSelected = function () {
            jq("li", dom).css({
                border: '1px solid #ccc'
            });
        };
        var setSelected = function (target) {
            jq(target).css({
                border: '1px solid blue'
            });
        };

        NEG(eventObj).on(internalEvents["SHOW_PREVIOUS"], function () {
            instance.movePrevious();
        });
        NEG(eventObj).on(internalEvents["SHOW_NEXT"], function () {
            instance.moveNext();
        });

        this.moveNext = function () {
            selectedIndex = (selectedIndex + 1) % flist.length;
            objList.jqList[selectedIndex].trigger("click");
        };
        this.movePrevious = function () {
            selectedIndex = (selectedIndex - 1 + flist.length) % flist.length;
            objList.jqList[selectedIndex].trigger("click");
        };

        this.dom = dom;
    };

    var ImageGallery = function (config, option) {
        var instance = this;
        var isShow = false;
        var popup, detailedView, imageListView;

        var build = function () {

            var title = function () {
                var res = jq("<span>");
                var img = jq("<img src='" + blankImgSrc + "' />");
                img.css({
                    'background-image': 'url(' + sprProduct + ')',
                    'background-position': '-40px -360px',
                    'float': 'left',
                    width: '30px',
                    margin: '-6px 4px 0 -4px'
                });
                var text = jq("<span>Image Gallery</span>");
                text.css({
                    color: '#636669',
                    display: 'inline',
                    'float': 'none',
                    'font-family': "helvetica, arial, sans-serif",
                    'font-size': "17px",
                    'font-style': "normal",
                    'font-variant': "normal",
                    'font-weight': "normal",
                    'line-height': "20px",
                    'margin-bottom': "8px"
                });
                res.append(img).append(text);
                return res;
            }();
            var closeBtn = function () {
                var res = jq("<a>");
                var img = jq("<img alt='close window' src=" + blankImgSrc + " />");
                img.css({
                    width: '18px',
                    height: '18px',
                    'background-image': 'url(' + sprProduct + ')',
                    'background-position': '-150px -440px',
                    margin: '-8px -4px 0 0'
                });
                res.css({
                    "float": "right",
                    "cursor": "pointer"
                });
                res.append(img);
                res.click(function () {
                    popup.hide();
                });
                return res;
            }();
            var content = function () {
                var theConent = jq("<div>");
                var pictureDetailedViewOption = function () {
                    return {
                    };
                }();
                detailedView = new DetailedView(config, pictureDetailedViewOption, instance);
                var imageListViewOption = function () {
                    return {
                        thumbnailStyle: option.thumbnailStyle
                    };
                }();
                imageListView = new ImageListView(config, imageListViewOption, instance);
                theConent.append(detailedView.dom);
                theConent.append(imageListView.dom);
                return theConent;
            }();
            var footer = function () {
                var res = jq("<div>close window</div>");
                res.css({ 'text-align': 'center', clear: 'both' });
                res.hover(function () {
                    jq(this).css("color", 'blue');
                }, function () {
                    jq(this).css("color", 'black');
                });
                res.css({ 'cursor': "pointer" });
                res.click(function () {
                    popup.hide();
                });
                return res;
            }();

            popup = function () {
                var popupConfig = function () {
                    return { content: content };
                }();

                var popupOption = function () {
                    var res = {
                        needMask: option.needMask,
                        hideWhenClickMask: option.hideWhenClickMask,
                        popupStyle: option.popupStyle,
                        autoCenterAfterResize: true
                    };
                    option.maskStyle && (res.maskStyle = option.maskStyle);
                    return res;
                }();

                return popupBuilder(popupConfig, popupOption);
            }();

            var popupDom = jq(popup.dom);

            popupDom.append(title).append(closeBtn).append(content).append(footer);
            instance.dom = popupDom[0];
        };

        this.show = function () {
            NEG(instance).trigger(events["BEFORE_SHOW"]);
            isShow = true;
            popup.show();
            NEG(instance).trigger(events["AFTER_HIDE"]);
        };

        this.hide = function () {
            NEG(instance).trigger(events["BEFORE_HIDE"]);
            isShow = false;
            popup.hide();
            NEG(instance).trigger(events["AFTER_HIDE"]);
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

        build();

        if (option.KeyboardEnable) {
            jq(window.document).keyup(function (e) {
                if (isShow) {
                    if (e.which == 0x1B) {
                        instance.hide();
                    }
                    if (e.which == 0x25) {
                        NEG(instance).trigger(internalEvents["SHOW_PREVIOUS"]);
                    }
                    if (e.which == 0x27) {
                        NEG(instance).trigger(internalEvents["SHOW_NEXT"]);
                    }
                }
            });
        }
    };


    var checkConfig = function (config) {
        var res = NEG.utility.isType(config.imgList, 'Array') && config.imgList.length > 0;
        var length = config.imgList.length;
        var validImgList = [];
        for (var i = 0; i < length; i++) {
            var theTemp = config.imgList[i];
            var temp = NEG.utility.isDefined(theTemp.content) && NEG.utility.isDefined(theTemp.thumbnailSrc);
            temp && (validImgList.push(theTemp));
        }
        config.imgList = validImgList;
        return res;
    };

    var builder = function (config, option) {
        if (NEG.utility.isType(config, 'Object') && checkConfig(config)) {
            option || (option = {});

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
            if (NEG.utility.isType(option.thumbnailStyle, 'Object')) {
                for (var i = 0; i < config.imgList.length; i++) {
                    NEG.utility.isDefined(option.thumbnailStyle[i]) || (option.thumbnailStyle[i] = defaultOption.thumbnailStyle);
                }
            } else {
                option.thumbnailStyle = {};
                for (var i = 0; i < config.imgList.length; i++) {
                    option.thumbnailStyle[i] = defaultOption.thumbnailStyle;
                }
            }

            NEG.blend(
                option,
                defaultOption,
                { cover: false, mergePrototype: false }
            );

            var gallery = new ImageGallery(config, option);
            return gallery;
        }
    };

    return builder;
})