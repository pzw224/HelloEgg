NEG.Module("NEG.Widget.FilterManager.UI", function (require) {
    var filterManagerModelBuilder = require("NEG.Widget.FilterManager.Model");
    var jq = require("NEG.ThirdParty.jQuery");


    var defaultOption = {
        widgetDomStyle: {},
        filterStyle: {
            border: '1px solid #DED9E1',
            background: 'none repeat scroll 0 0 #EAF1FA',
            'border-radius': '2px 2px 2px 2px',
            display: 'inline-block',
            margin: '1px 6px 1px 0px',
            'font-size': '1.1em',
            padding: '0 3px 4px 10px'
        },
        detailedFilterStyle: {
            display: 'inline-block',
            padding: '0 8px 0 2px'
        },
        resetDomStyle: {
            border: '1px solid #DED9E1',
            'border-radius': '2px 2px 2px 2px',
            display: 'inline-block',
            margin: '1px 6px 1px 0px',
            background: 'none repeat scroll 0 0 #FFFFFF',
            padding: '6px 12px 4px',
            'font-size': '1.1em',
            cursor: 'pointer'
        },
        filters: {},
        displayExclude: {},
        paraNameMatch: {},
        displayOrder: []
    };

    var events = {
        "FILTER_CHANGED": "Widget_FilterManager_UI1_Filter_Changed",
        "AFTER_ADD_FILTERS": "Widget_FilterManager_UI1_After_Add_Filters",
        "AFTER_REMOVE_FILTERS": "Widget_FilterManager_UI1_After_Remove_Filters",
        "AFTER_REPLACE_FILTERS": "Widget_FilterManager_UI1_After_Replace_Filters",
        "AFTER_RESET_FILTERS": "Widget_FilterManager_UI1_After_Reset_Filters"
    };

    var checkConfig = function (config) {
        var result = true;
        result = NEG.utility.isDefined(config.filterParas) && config.filterParas.length > 0;
        var length = config.filterParas.length;
        for (var i = 0; i < length ; i++) {
            var temp = config.filterParas[i];
            if (!NEG.utility.isType(temp, "String") && NEG.cast(temp).trim() != "") {
                result = false;
                break;
            }
        }
        return result;
    };

    var FilterManager = function (config, option) {
        var instance = this;
        var widgetDom, resetDom;
        var model;
        var filterDomMatch = {};

        var removeHandler = function (e) {
            var sender = jq(e.target || e.srcElement);
            model.removeFilters({ para: sender.attr('para'), value: sender.attr('value') });
        };

        var createParaFilter = function (para) {
            var res, dom;
            var theName = option.paraNameMatch[para];
            theName = NEG.utility.Encoding.encodeHTML(NEG.utility.isDefined(theName) ? theName : para);
            dom = jq("<dd class='search-filter'><span >" + theName + ':&nbsp;&nbsp;' + "</span></dd>");
            dom.css(option.filterStyle);
            res = {
                "filterDom": dom,
                valueDomMatch: {}
            };
            filterDomMatch[para] = res;
            return res;
        };

        var createDetailedFilter = function (para, value, name, theParaDomMatch) {
            var theName = NEG.utility.isDefined(name) ? name : NEG.utility.Encoding.encodeHTML(value);
            var res = jq("<a  href='javascript:void(0)' title='Remove this filter' >" + theName + "</a>");
            var sup = jq("<sup para='" + para + "' value='" + NEG.utility.Encoding.encodeHTML(value) + "'>X</sup>");

            sup.appendTo(res);
            //sup.click(function (e) {
            //    var sender = jq(e.target || e.srcElement);
            //    model.removeFilters({ para: sender.attr('para'), value: sender.attr('value') });
            //});
            res.css(option.detailedFilterStyle);
            res.appendTo(theParaDomMatch.filterDom.find('span'));
            return res;
        };

        var intnl_CreateFilter = function (filters) {
            for (var i = 0; i < filters.length; i++) {
                var theFilter = filters[i];
                if (option.displayExclude[theFilter.para]) {
                    continue;
                }
                var theDomMatch = filterDomMatch[theFilter.para];
                if (!theDomMatch) {
                    theDomMatch = createParaFilter(theFilter.para);
                }
                for (var j = 0; j < theFilter.values.length; j++) {
                    var theValue = theFilter.values[j];
                    theDomMatch.valueDomMatch[theValue.value] = createDetailedFilter(theFilter.para, theValue.value, theValue.name, theDomMatch);
                    theDomMatch.filterDom.append(theDomMatch.valueDomMatch[theValue.value]);
                }

            }
        };

        var intnl_DeleteFilter = function (filters) {
            for (var i = 0; i < filters.length; i++) {
                var theFilter = filters[i];
                if (option.displayExclude[theFilter.para]) {
                    continue;
                }
                var theDomMatch = filterDomMatch[theFilter.para];
                if (theDomMatch) {
                    for (var j = 0; j < theFilter.values.length; j++) {
                        var theValue = theFilter.values[j];
                        var theDom = theDomMatch.valueDomMatch[theValue.value];
                        theDom.remove();
                        delete (theDomMatch.valueDomMatch[theValue.value]);
                        var length = 0;
                        for (var val in theDomMatch.valueDomMatch) {
                            length++;
                        }
                        if (length == 0) {
                            delete (filterDomMatch[theFilter.para]);
                        }
                    }
                }
            }
        };

        var intnl_ReplaceFilter = function (filters) {
            var curFiltersCache = function (theFiltersArray) {
                var res = {};
                for (var j = 0; j < theFiltersArray.length; j++) {
                    var theFilter = theFiltersArray[j];
                    if (!res[theFilter.para]) {
                        res[theFilter.para] = [];
                    }
                    for (var k = 0; k < theFilter.values.length; k++) {
                        res[theFilter.para].push(theFilter.values[k].value);
                    }
                }
                return res;
            }(model.getFilters());

            for (var i = 0; i < filters.length; i++) {
                var theFilter = filters[i];
                var curFiltersCacheValue = curFiltersCache[theFilter.para];
                for (var i = 0; i < theFilter.values.length; i++) {
                    if (option.displayExclude[theFilter.para]) {
                        continue;
                    }
                    var theVal = theFilter.values[i].value;
                    var isAdd = (NEG.cast(curFiltersCacheValue).indexOf(theVal) != -1);
                    var theDomMatch = filterDomMatch[theFilter.para];
                    //filters Ϊfiltermanager.model�����ӻ���ɾ���ֵ����������м������ҵõ����value����Ϊ����
                    if (isAdd) {
                        if (!theDomMatch) {
                            theDomMatch = createParaFilter(theFilter.para);
                        }
                        theDomMatch.valueDomMatch[theVal] = createDetailedFilter(theFilter.para, theVal, theFilter.values[i].name, theDomMatch);
                        theDomMatch.filterDom.append(theDomMatch.valueDomMatch[theVal]);
                    } else {
                        if (theDomMatch) {
                            var theDom = theDomMatch.valueDomMatch[theVal];
                            theDom.remove();
                            theDomMatch.valueDomMatch[theVal] = null;
                        }
                    }
                }
            }
        };

        var render = function () {
            var length = 0;
            widgetDom.children().remove();
            var theSorted = { unSorted: [] };
            for (var para in filterDomMatch) {
                if (option.displayExclude[para]) {
                    continue;
                }
                var index = NEG.cast(option.displayOrder).indexOf(para);
                if (index != -1) {
                    theSorted[index] = para;
                    length++;
                } else {
                    theSorted.unSorted.push(para);
                }
            }
            if (length > 0 || theSorted.unSorted.length > 0) {
                if (length > 0) {
                    for (var i = 0; i < length; i++) {
                        theSorted[i] && widgetDom.append(theSorted[i]);
                    }
                } else {
                    for (var j = 0; j < theSorted.unSorted.length; j++) {
                        var theFilterDomMatch = filterDomMatch[theSorted.unSorted[j]];
                        widgetDom.append(theFilterDomMatch.filterDom);
                        var theSups = theFilterDomMatch.filterDom.find("sup");
                        theSups.unbind("click", null, removeHandler);
                        theSups.click(removeHandler);
                    }
                }
                resetDom.click(function () {
                    model.resetFilters();
                });
                widgetDom.append(resetDom);
                widgetDom.show();
            } else {
                widgetDom.hide();
            };
            theSorted = null;
        };

        var initializeEvent = function () {
            model.on("AFTER_ADD_FILTERS", function (target, changedFilters) {
                intnl_CreateFilter(changedFilters);
                NEG(instance).trigger(events["AFTER_ADD_FILTERS"], changedFilters);
                render();
            });
            model.on("AFTER_REMOVE_FILTERS", function (target, changedFilters) {
                intnl_DeleteFilter(changedFilters);
                NEG(instance).trigger(events["AFTER_REMOVE_FILTERS"], changedFilters);
                render();
            });
            model.on("AFTER_REPLACE_FILTERS", function (target, changedFilters) {
                intnl_ReplaceFilter(changedFilters);
                NEG(instance).trigger(events["AFTER_REPLACE_FILTERS"], changedFilters);
                render();
            });
            model.on("AFTER_RESET_FILTERS", function (target, changedFilters) {
                filterDomMatch = {};
                NEG(instance).trigger(events["AFTER_RESET_FILTERS"], changedFilters);
                render();
            });
        };


        (function () {
            var modelConfig = function () {
                return {
                    filterParas: config.filterParas
                };
            }();
            model = filterManagerModelBuilder(modelConfig);

            widgetDom = jq("<dl>");
            widgetDom.css(option.widgetDomStyle);

            resetDom = jq("<dd <a href='javascript:void(0)'>Reset</a></dd>");
            resetDom.css(option.resetDomStyle);

            initializeEvent();
            model.addFilters(option.filters);
        })();

        this.addFilters = function (filters) {
            model.addFilters(filters);
        };

        this.removeFilters = function (filters) {
            model.removeFilters(filters);
        };

        this.replaceFilters = function (filters) {
            model.replaceFilters(filters);
        };

        this.resetFilters = function (filters) {
            model.resetFilters(filters);
        };

        this.getFilters = function (arg) {
            return model.getFilters(arg);
        };

        this.dom = widgetDom[0];

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

    var filterManagerUIBuilder = function (config, option) {
        var res = null;
        var theOption;
        if (checkConfig(config)) {
            if (option) {
                theOption = option;
                NEG.utility.isDefined(theOption.widgetDomStyle) && NEG.blend(
                    theOption.widgetDomStyle,
                    defaultOption.widgetDomStyle,
                    { cover: false, mergePrototype: false }
                );

                NEG.utility.isDefined(theOption.resetDomStyle) && NEG.blend(
                    theOption.resetDomStyle,
                    defaultOption.resetDomStyle,
                    { cover: false, mergePrototype: false }
                );

                NEG.utility.isDefined(theOption.filterStyle) && NEG.blend(
                    theOption.filterStyle,
                    defaultOption.filterStyle,
                    { cover: false, mergePrototype: false }
                );
                NEG.utility.isDefined(theOption.detailedFilterStyle) && NEG.blend(
                    theOption.detailedFilterStyle,
                    defaultOption.detailedFilterStyle,
                    { cover: false, mergePrototype: false }
                );
                NEG.blend(
                    theOption,
                    defaultOption,
                    { cover: false, mergePrototype: false }
                );
            } else {
                option = defaultOption;
            }

            res = new FilterManager(config, option);
        }
        return res;
    };

    return filterManagerUIBuilder;
});