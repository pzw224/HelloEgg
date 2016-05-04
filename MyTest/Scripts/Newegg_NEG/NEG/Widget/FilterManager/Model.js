NEG.Module("NEG.Widget.FilterManager.Model", function (require) {

    var defaultOption = {

    };

    var events = {
        "AFTER_ADD_FILTERS": "Widget_FilterManager_Model_After_Add_Filters",
        "AFTER_REMOVE_FILTERS": "Widget_FilterManager_Model_After_Remove_Filters",
        "AFTER_RESET_FILTERS": "Widget_FilterManager_Model_After_Reset_Filters",
        "AFTER_REPLACE_FILTERS": "Widget_FilterManager_Model_After_Replace_Filters"
    };

    var checkConfig = function (config) {
        var result;
        result = NEG.utility.isDefined(config.filterParas) && config.filterParas.length > 0;
        for (var i = 0; i < config.filterParas.length; i++) {
            var obj = config.filterParas[i];
            if (!NEG.utility.isType(obj, "String") && NEG.cast(obj).trim() != "") {
                result = false;
                break;
            }
        }
        return result;
    };

    var copyJson = function (obj) {
        var res = {};
        for (var prop in obj) {
            var temp = obj[prop];
            var isBaseType = typeof (temp) == "undefined" || typeof (temp) == "number" || typeof (temp) == "string" || typeof (temp) == "boolean" || typeof (temp) == "function";
            if (isBaseType) {
                res[prop] = obj[prop];
            } else {
                res[prop] = copyJson(obj[prop]);
            }
        }
        return res;
    };

    var checkFilter = function (theFilter) {
        return NEG.utility.isType(theFilter.para, "String") && ((NEG.utility.isDefined(theFilter.value) && theFilter.value != "") || NEG.utility.isDefined(theFilter.values));
    };

    var processFilter = function (filters) {
        var tempFilters = [].concat(filters);
        var result = [], addedPara = [];
        for (var i = 0; i < tempFilters.length; i++) {
            var filter = tempFilters[i];
            if (checkFilter(filter)) {
                var theFilter = (function () {
                    var res;
                    var index = NEG.cast(addedPara).indexOf(filter.para);
                    if (index == -1) {
                        addedPara.push(filter.para);
                        res = { para: filter.para, values: [], allValues: [] };
                        result.push(res);
                    } else {
                        res = result[index];
                    }
                    return res;
                })();
                var theValuesAdded = theFilter.allValues;
                if (NEG.utility.isDefined(filter.value)) {
                    if (NEG.cast(theValuesAdded).indexOf(filter.value) == -1) {
                        var copyedObj = copyJson(filter);
                        delete (copyedObj["para"]);
                        theFilter.values.push(copyedObj);
                        theValuesAdded.push(filter.value);
                    }
                } else {
                    for (var k = 0; k < filter.values.length; k++) {
                        var theValue = filter.values[k];
                        if (NEG.utility.isDefined(theValue.value) && theValue.value !== "") {
                            if (NEG.cast(theValuesAdded).indexOf(theValue) == -1) {
                                var copyedObj = copyJson(theValue);
                                delete (copyedObj["para"]);
                                theFilter.values.push(copyedObj);
                                theValuesAdded.push(theValue.value);
                            }
                        } else {
                            if (NEG.cast(theValuesAdded).indexOf(theValue) == -1) {
                                theFilter.values.push({ value: theValue });
                                theValuesAdded.push(theValue);
                            }
                        }
                    }
                }
            }
        }
        return result;
    };

    var FilterManager = function (config, option) {
        var instance = this;
        var filterParas;
        var filterCache = {};

        var init = function () {
            filterParas = config.filterParas.slice();
            for (var i = 0; i < filterParas.length; i++) {
                var cacheItem = filterCache[i] = {};
                cacheItem.para = filterParas[i];
                cacheItem.values = [];
                cacheItem.valueObjMatch = {};
            }
        };

        this.addFilters = function (theFilters, fireEvent) {
            if (theFilters) {
                var filters = processFilter(theFilters), addedFilters = [];
                for (var i = 0; i < filters.length; i++) {
                    var filter = filters[i];
                    var index = NEG.cast(filterParas).indexOf(filter.para);
                    var theCacheItem = filterCache[index];
                    if (theCacheItem) {
                        var toBeAddedFilter = { para: filter.para, values: [] };
                        for (var j = 0; j < filter.values.length; j++) {
                            var theValue = filter.values[j];
                            if (!NEG.utility.isDefined(theCacheItem.valueObjMatch[theValue.value])) {
                                theCacheItem.values.push(theValue);
                                toBeAddedFilter.values.push(theValue);
                                theCacheItem.valueObjMatch[theValue.value] = theValue;
                            }
                        }
                        toBeAddedFilter.values.length > 0 && addedFilters.push(toBeAddedFilter);
                    }
                }
                (typeof fireEvent == "undefined" || fireEvent) && NEG(instance).trigger(events["AFTER_ADD_FILTERS"], addedFilters);
            }
        };

        this.removeFilters = function (theFilters, fireEvent) {
            if (theFilters) {
                var filters = processFilter(theFilters), removedFilters = [];
                for (var i = 0; i < filters.length; i++) {
                    var filter = filters[i];
                    var index = NEG.cast(filterParas).indexOf(filter.para);
                    var theCacheItem = filterCache[index];
                    if (theCacheItem) {
                        var toBeRemovedFilter = { para: filter.para, values: [] };
                        for (var k = 0; k < filter.values.length; k++) {
                            var theValue = filter.values[k];
                            var toBeRemoveValue = theCacheItem.valueObjMatch[theValue.value];
                            if (NEG.utility.isDefined(toBeRemoveValue)) {
                                toBeRemovedFilter.values.push(toBeRemoveValue);
                                var theIndex = NEG.cast(theCacheItem.values).indexOf(toBeRemoveValue);
                                theCacheItem.values.splice(theIndex, 1);
                                delete (theCacheItem.valueObjMatch[theValue.value]);
                            }
                        }
                        toBeRemovedFilter.values.length > 0 && removedFilters.push(toBeRemovedFilter);
                    }
                }
                (typeof fireEvent == "undefined" || fireEvent) && NEG(instance).trigger(events["AFTER_REMOVE_FILTERS"], removedFilters);
            }
        };

        this.replaceFilters = function (theFilters, fireEvent) {
            var changedFilters = [];
            if (theFilters) {
                var filters = processFilter(theFilters);
                for (var i = 0; i < filters.length; i++) {
                    var theFilter = filters[i];
                    var index = NEG.cast(filterParas).indexOf(theFilter.para);
                    var theCacheItem = filterCache[index];
                    var theChangedFilter = { para: theFilter.para, values: [] };
                    if (theCacheItem) {
                        for (var theVal in theCacheItem.valueObjMatch) {
                            var toBeRemoveValue = theCacheItem.valueObjMatch[theVal];
                            if (NEG.cast(theFilter.allValues).indexOf(toBeRemoveValue.value) == -1) {
                                theChangedFilter.values.push(toBeRemoveValue);
                                var theIndex = NEG.cast(theCacheItem.values).indexOf(toBeRemoveValue);
                                theCacheItem.values.splice(theIndex, 1);
                                delete (theCacheItem.valueObjMatch[theVal]);
                            }
                        }
                        for (var j = 0; j < theFilter.values.length; j++) {
                            var theValue = theFilter.values[j];
                            var theCachedValue = theCacheItem.valueObjMatch[theValue.value];
                            if (NEG.utility.isDefined(theCachedValue)) {
                                //update
                                var theIndex = NEG.cast(theCacheItem.values).indexOf(theCachedValue);
                                theCacheItem.values.splice(theIndex, 1);
                                theCacheItem.valueObjMatch[theValue.value] = theValue;
                                theCacheItem.values.push(theValue);
                            } else {
                                //add
                                theCacheItem.values.push(theValue);
                                theChangedFilter.values.push(theValue);
                                theCacheItem.valueObjMatch[theValue.value] = theValue;
                            }
                        }
                        if (theCacheItem.values.length == 0) {
                            filterCache[index].values = [];
                            filterCache[index].valueObjMatch = {};
                        }

                    }
                    (theChangedFilter.values.length > 0) && changedFilters.push(theChangedFilter);
                }
            }
            (typeof fireEvent == "undefined" || fireEvent) && NEG(instance).trigger(events["AFTER_REPLACE_FILTERS"], changedFilters);
        };

        this.resetFilters = function (fireEvent) {
            var changedFilters = this.getFilters();
            filterCache = {};
            for (var i = 0; i < filterParas.length; i++) {
                var cacheItem = filterCache[i] = {};
                cacheItem.para = filterParas[i];
                cacheItem.values = [];
                cacheItem.valueObjMatch = {};
            }
            (typeof fireEvent == "undefined" || fireEvent) && NEG(instance).trigger(events["AFTER_RESET_FILTERS"], changedFilters);
        };

        this.getFilters = function (para) {
            var result;
            if (para) {
                var index = NEG.cast(filterParas).indexOf(para);
                if (index > -1) {
                    var theCacheItem = filterCache[index];
                    if (theCacheItem) {
                        result = { para: theCacheItem.para, values: [] };
                        for (var m = 0; m < theCacheItem.values.length; m++) {
                            result.values.push(copyJson(theCacheItem.values[m]));
                        }
                    }
                }
            } else {
                result = [];
                for (var index in filterCache) {
                    var theCacheItem = filterCache[index];
                    if (theCacheItem) {
                        if (theCacheItem.values.length > 0) {
                            var temp = { para: theCacheItem.para, values: [] };
                            for (var m = 0; m < theCacheItem.values.length; m++) {
                                temp.values.push(copyJson(theCacheItem.values[m]));
                            }
                            result.push(temp);
                        }
                    }
                }
            }
            return result;
        };

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

        init();
    };

    var filterManagerBuilder = function (config, option) {
        var res = null;
        if (checkConfig(config)) {
            res = new FilterManager(config, option);
        }
        return res;
    };

    return filterManagerBuilder;
});