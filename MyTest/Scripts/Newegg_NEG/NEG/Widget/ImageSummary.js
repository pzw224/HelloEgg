NEG.Module("NEG.Widget.ImageSummary", function (require) {
    var jq = require("NEG.ThirdParty.JQuery");

    var events = {
        "CONTENT_CREATED": "Widget_ImageSummary_contentCreated",
        "IMAGE_CHANGED": "Widget_ImageSummary_imageChanged"
    };

    var internalEvents = {
        "IMAGE_CHANGED": "Widget_ImageSummary_Itnl_imageChanged"
    };

    var defaultOption = {
        thumbnailStyle: {
            width: '35px',
            height: '32px',
            display: 'inline',
            'vertical-align': 'middle',
            'text-align': '-webkit-match-parent',
            'margin': '0 2px',
            border: '1px solid #ccc',
            padding: '2px 2px 5px 2px',
            cursor: 'pointer'
        },
        style: {

        },
        thumbnailBarStyle: {
            'list-style': 'none',
            'padding': '0',
            'margin': '0 auto',
            clear: 'both',
            'text-align': 'center'
        },
        contentStyle: {
            margin: '2px 20px ',
            clear: 'right',
            overflow: 'hidden',
            display: 'block',
            width: '300px',
            height: '225px'
        }
    };

    var necessaryStyle = {
        'display': 'inline-block'
    };

    var necessaryThumbnailBarStyle = {
        'display': 'block'
    };

    var DetailView = function (config, option, eventObj) {
        var instance = this;
        var dom = jq("<div>");

        var contentCache = {};
        var getContent = function (args) {
            var theC = contentCache[args.index];
            if (!theC) {
                theC = jq("<div>");
                theC.append(jq(args.content));
                theC.hide();
                contentCache[args.index] = theC;
                dom.append(theC);
                NEG(eventObj).trigger(events["CONTENT_CREATED"], { index: args.index, config: config.imgList[args.index], target: contentCache[args.index][0] });
            }
            return theC;
        };

        dom.css(option.contentStyle);

        NEG(eventObj).on(internalEvents["IMAGE_CHANGED"], function (target, args) {
            instance.display(args);
        });

        this.dom = dom;
        this.display = function (args) {
            var theContent = getContent(args);
            for (var item in contentCache) {
                contentCache[item].hide();
            }
            jq(theContent).show();
        };
        this.initialize = function () {
            instance.display({ index: 0, content: config.imgList[0].content });
            //NEG(eventObj).trigger(events["CONTENT_CREATED"], { index: 0, config: config.imgList[0], target: contentCache[0][0] });
        };
    };

    var ImgListView = function (config, option, eventObj) {
        var flist = config.imgList;
        var dom = jq("<ul>");
        var objList = { jqList: [], domList: [] };
        var length = flist.length > 4 ? 4 : flist.length;
        for (var i = 0; i < length; i++) {
            var theImageConfig = flist[i];
            var temp = jq("<li>");
            var theTitle = NEG.utility.isDefined(theImageConfig.title) ? theImageConfig.title : "";
            var img = jq("<img  title='" + theTitle + "' alt='" + theTitle + "' src='" + theImageConfig.thumbnailSrc + "' />");
            temp.append(img);
            temp.css(option.thumbnailStyle[i]);

            dom.append(temp);
            objList.domList.push(temp[0]);
            objList.jqList.push(temp);

            temp.mousemove(function () {
                var index = NEG.cast(objList.domList).indexOf(this);
                var selectedConfig = flist[index];
                NEG(eventObj).trigger(internalEvents["IMAGE_CHANGED"], { index: index, content: selectedConfig.content });
                NEG(eventObj).trigger(events["IMAGE_CHANGED"], { index: index, config: selectedConfig, target: this });
            });
        }

        dom.css(option.thumbnailBarStyle);

        this.dom = dom;
    };

    var ImageSummary = function (config, option) {
        var instance = this;
        var detailView, imgListView;
        var build = function () {
            var theDom = jq("<div>");

            var detailViewOption = function () {
                return {
                    contentStyle: option.contentStyle
                };
            }();

            detailView = new DetailView(config, detailViewOption, instance);

            var imgListViewOption = function () {
                return {
                    thumbnailStyle: option.thumbnailStyle,
                    thumbnailBarStyle: option.thumbnailBarStyle
                };
            }();
            imgListView = new ImgListView(config, imgListViewOption, instance);


            theDom.append(detailView.dom);
            theDom.append(imgListView.dom);

            theDom.css(option.style);

            return theDom[0];
        };

        this.dom = build();

        this.on = function (eventName, fn) {
            var eName = events[eventName];
            if (eName && fn) {
                NEG(instance).on(eName, fn);
            }
        };

        this.off = function (eventName, fn) {
            var eName = events[eventName];
            if (eName && fn) {
                NEG(instance).off(eName, fn);
            }
        };
        this.initialize = function () {
            detailView.initialize();
        };
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

            option.style || (option.style = {});
            NEG.blend(
                option.style,
                defaultOption.style,
                { cover: false, mergePrototype: false }
            );
            NEG.blend(
                option.style,
                necessaryStyle,
                { cover: true, mergePrototype: false }
            );
            option.thumbnailBarStyle || (option.thumbnailBarStyle = {});
            NEG.blend(
                option.thumbnailBarStyle,
                defaultOption.thumbnailBarStyle,
                { cover: false, mergePrototype: false }
            );
            NEG.blend(
                option.thumbnailBarStyle,
                necessaryThumbnailBarStyle,
                { cover: true, mergePrototype: false }
            );

            NEG.blend(
                option,
                defaultOption,
                { cover: false, mergePrototype: false }
            );

            var imgSummary = new ImageSummary(config, option);
            return imgSummary;
        }
    };

    return builder;
})