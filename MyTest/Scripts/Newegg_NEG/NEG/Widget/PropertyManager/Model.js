NEG.Module("NEG.Widget.PropertyManager.Model", function (require) {

    var defaultOption = {

    };

    var events = {
        //EventArguments��{resultInfo:[], propertyStatus:[{name:'PropertyName1',values:[{value:'PropertyValue1',valid:true},{value:'PropertyValue2',valid:false}]}],selectedProperty:[]}
        "BEFORE_PROPERTY_INIT": "Widget_PropertyManager_Model_Before_Property_Init",
        //��propertyManager.Model��ʼ��ʱ������
        "AFTER_PROPERTY_INIT": "Widget_PropertyManager_Model_After_Property_Init",
        //��propertyManager.Model changePropertyǰ������
        "BEFORE_PROPERTY_CHANGE": "Widget_PropertyManager_Model_Before_Property_Change",
        //��propertyManager.Model changeProperty�󣬴���
        "AFTER_PROPERTY_CHANGE": "Widget_PropertyManager_Model_After_Property_Change"
    };

    var buildArray = function (arg) {
        var result = [];
        if (arg) {
            var length = arg.length;
            for (var i = 0; i < length; i++) {
                result.push(arg[i]);
            }
        }
        return result;
    };

    var getPossibleProperties = function (properties) {
        var res = [];
        if (properties && properties.length > 0) {
            var length = properties.length;
            for (var i = 0; i < length  ; i++) {
                var temp = properties[i];
                var tempRes = { exclude: temp.name, include: [] };
                var j;
                for (j = 0; j < i; j++) {
                    tempRes.include.push(properties[j]);
                }
                for (j = i + 1; j < length; j++) {
                    tempRes.include.push(properties[j]);
                }
                res.push(tempRes);
            }
        }
        return res;
    };

    var getIntersection = function (infos) {
        var curResult = (function () {
            var infoLen = infos.length;
            var minLen = infos[0].length;
            var minIndex = 0;
            for (var i = 1; i < infoLen; i++) {
                if (infos[i].length < minLen) {
                    minLen = infos[i].length;
                    minIndex = i;
                }
            }
            var temp = infos[minIndex];
            infos.splice(minIndex, 1);
            return temp;
        })();
        while (infos.length > 0) {
            var infoLen = infos.length;
            var minLen = infos[0].length;
            var minIndex = 0;
            for (var i = 1; i < infoLen; i++) {
                if (infos[i].length < minLen) {
                    minLen = infos[i].length;
                    minIndex = i;
                }
            }
            var temp = [];
            var toBeComparedInfos = infos[minIndex];
            var resLen = curResult.length;
            for (var j = 0; j < resLen; j++) {
                var tempLen = toBeComparedInfos.length;
                for (var k = 0; k < tempLen; k++) {
                    if (curResult[j] === toBeComparedInfos[k]) {
                        temp.push(curResult[j]);
                    }
                }
            }
            curResult = temp;

            infos.splice(minIndex, 1);
        }
        return curResult;
    };

    var getUnion = function (properties) {
        var curResult = [];
        while (properties.length > 0) {
            var toBeComparedProperty = properties[0];
            var resLen = curResult.length;
            var notExist = true;
            for (var j = 0; j < resLen; j++) {
                var theCurResult = curResult[j];
                if (theCurResult.name == toBeComparedProperty.name && theCurResult.value == toBeComparedProperty.value) {
                    notExist = false;
                    break;
                }
            }
            if (notExist) {
                curResult.push(toBeComparedProperty);
            }

            properties.splice(0, 1);
        }
        return curResult;
    };

    var checkProperties = function (properties, propertiesIndex) {
        var result = [];
        if (properties && properties.length > 0) {
            var len = properties.length;
            for (var i = 0; i < len; i++) {
                var theProperty = properties[i];
                propertiesIndex[theProperty.name][theProperty.value] && (result.push(theProperty));
            }
        }
        return result;
    };


    var PropertyManager = function (config, option) {
        var instance = this;
        //�ڲ�����:{
        //      'PropertyName1':{'Value11':[],'Value12':[],'Value13':[]},
        //      'PropertyName2':{'Value21':[],'Value22':[],'Value23':[]},  
        //      'PropertyName3':{'Value31':[],'Value32':[],'Value33':[]}  
        //      }
        var _propertiesIndex = {};
        var _allInfo = [];
        var _curSelectedProperties = [];
        var _curPropertyStatus = [];
        var _curResultInfos = [];

        //���������Property��items
        var getPropertyStatusAndResultInfo = function (properties) {
            var result = { resultInfo: [], propertyStatus: [] };

            var filteredResult = filterBindingInfos(properties);

            var curProperties = (function () {
                var temp = NEG.cast([]);
                var len = filteredResult.length;
                for (var l = 0; l < len; l++) {
                    temp.addRange(filteredResult[l].map);
                }
                return temp.source;
            })();
            //�ȹ��˳������property��item
            result.resultInfo = (function () {
                var res = [];
                var len = filteredResult.length;
                for (var l = 0; l < len; l++) {
                    res.push(filteredResult[l].info);
                }
                return res;
            })();
            //��ȡ(n-1)C(n)���������
            //possibeProperites:[{exclude:'�ߴ�',include:[{name:'��ɫ',value:'��'},{name:'����',value:'32GB'}]}]
            var possibleProperties = getPossibleProperties(properties);
            var possiblePropertyLength = possibleProperties.length;
            var possibleResult = [];
            for (var i = 0; i < possiblePropertyLength; i++) {
                var thePossibleProperty = possibleProperties[i];
                var temp = filterBindingInfos(thePossibleProperty.include);
                var tempLen = temp.length;
                for (var j = 0; j < tempLen; j++) {
                    var values = NEG.cast([]);
                    var map = temp[j].map;
                    var mapLen = map.length;
                    for (var k = 0; k < mapLen; k++) {
                        var theMap = map[k];
                        if (theMap.name == thePossibleProperty.exclude && values.indexOf(theMap.value) == -1) {
                            possibleResult.push(theMap);
                            values.push(theMap.value);
                        }
                    }
                }
            }
            var resultInfoForPossibleProperties = (function () {
                var temp = NEG.cast([]);
                if (possibleResult.length == 0) {
                    var len = config.availableMap.length;
                    for (var l = 0; l < len; l++) {
                        temp.addRange(config.availableMap[l].map);
                    }
                } else {
                    temp.addRange(possibleResult);
                    temp.addRange(curProperties);
                }
                return getUnion(temp.source);
            })();
            result.propertyStatus = checkProperties(resultInfoForPossibleProperties, _propertiesIndex);
            return result;
        };

        var filterBindingInfos = function (properties) {
            var res;
            if (properties && properties.length > 0) {
                var selectedInfos = [];
                var len = properties.length;
                for (var i = 0; i < len ; i++) {
                    var temp;
                    var propertyValueIndex = _propertiesIndex[properties[i].name];
                    propertyValueIndex && (temp = propertyValueIndex[properties[i].value]);
                    temp && (selectedInfos.push(temp));
                }
                res = selectedInfos.length > 0 ? getIntersection(selectedInfos) : selectedInfos;
            } else {
                res = config.availableMap;
            }
            return res;
        };


        var updateCurrentStatus = function (properties) {
            _curSelectedProperties = buildArray(properties);
            var temp = getPropertyStatusAndResultInfo(properties);
            _curPropertyStatus = temp.propertyStatus;
            _curResultInfos = temp.resultInfo;
        };

        var getCurStatusForEventArgs = function (argument) {
            return { resultInfo: buildArray(_curResultInfos), propertyStatus: buildArray(_curPropertyStatus), selectedProperty: buildArray(_curSelectedProperties), target: argument ? argument.target : null };
        };

        this.init = function (selectProperties, needFireEvent) {
            (typeof needFireEvent == "undefined" || needFireEvent) && NEG(instance).trigger(events["BEFORE_PROPERTY_INIT"], getCurStatusForEventArgs(selectProperties));

            updateCurrentStatus(selectProperties);

            (typeof needFireEvent == "undefined" || needFireEvent) && NEG(instance).trigger(events["AFTER_PROPERTY_INIT"], getCurStatusForEventArgs(selectProperties));
        };

        //��ѡ������״̬�󣬵���changeStatus([{name:'�ߴ�',value:'��'}��{name:'��ɫ',value:'��'}])
        //���ض�Ӧ������������info
        this.changeProperty = function (selectProperties, needFireEvent) {
            (typeof needFireEvent == "undefined" || needFireEvent) && NEG(instance).trigger(events["BEFORE_PROPERTY_CHANGE"], getCurStatusForEventArgs(selectProperties));

            updateCurrentStatus(selectProperties);

            (typeof needFireEvent == "undefined" || needFireEvent) && NEG(instance).trigger(events["AFTER_PROPERTY_CHANGE"], getCurStatusForEventArgs(selectProperties));

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

        this.searchInInfos = function (searchFn) {
            var result = [];
            var infoLength = config.availableMap.length;
            for (var i = 0; i < infoLength; i++) {
                var theMap = config.availableMap[i];
                if (searchFn(theMap.info)) {
                    result.push(theMap.map);
                }
            }
            return result;
        };

        this.searchInfosByProperty = function (property) {
            var result = null;
            if (NEG.utility.isDefined(property) && NEG.utility.isDefined(property.name) && NEG.utility.isDefined(property.value)) {
                result = (function () {
                    var res = [];
                    var temp = filterBindingInfos([property]);
                    if (temp.length > 0) {
                        var len = temp.length;
                        for (var i = 0; i < len; i++) {
                            res.push(temp[i].info);
                        }
                    }
                    return res;
                })();
            }
            return result;
        };

        //�����ڲ���ݽṹ,Ϊÿһ��property����һ����value����Ӧ�����е�info��match��ϵ
        (function () {
            var pLength = config.properties.length;
            for (var i = 0; i < pLength; i++) {
                var property = config.properties[i];
                var theName = property.name;
                var thePropertyMatch = _propertiesIndex[theName];
                if (theName && (!NEG.utility.isDefined(thePropertyMatch))) {
                    thePropertyMatch = _propertiesIndex[theName] = {};
                }
                var vLength = property.value.length;
                for (var j = 0; j < vLength; j++) {
                    thePropertyMatch[property.value[j]] = [];
                }
            }
            var infoLength = config.availableMap.length;
            for (var j = 0; j < infoLength; j++) {
                var theInfo = config.availableMap[j];
                var mLength = theInfo.map.length;
                var addFlag = (function () {
                    var res = true;
                    for (var t = 0; t < mLength; t++) {
                        var temp = theInfo.map[t];
                        var propertyMap = _propertiesIndex[temp.name];
                        if (!propertyMap || !propertyMap[temp.value]) {
                            res = false;
                            break;
                        }
                    }
                    return res;
                })();
                if (addFlag) {
                    for (var k = 0; k < mLength; k++) {
                        var theProperty = theInfo.map[k];
                        var propertyMap = _propertiesIndex[theProperty.name];
                        var propertyValueMap = propertyMap[theProperty.value];
                        if (propertyMap && propertyValueMap) {
                            propertyValueMap.push(theInfo);
                        }
                    }
                    _allInfo.push(theInfo.info);
                }
            }
        })();
    };


    //config.properties ���property������property
    //properties:[{name:'�ߴ�',value:['��','��','С']}��{name:'��ɫ',value:['��','��','��','��']},{name:'����',value:['16GB','32GB','64GB']}0,
    //              {name:'����',value:["1": [6,12,24],"2": [8,12,36]]}]     ---[6,8,12,24,36]
    //availableMap:[{info:{item:111,suscription:6},map:[{name:'�ߴ�',value:'��'},{name:'��ɫ',value:'��'},{name:'����',value:'32GB'}��{name:'����',value:6}]},
    //              {info:{item:111,suscription:12},map:[{name:'�ߴ�',value:'��'},{name:'��ɫ',value:'��'},{name:'����',value:'32GB'}��{name:'����',value:12}]} 
    //              {info:{item:111,suscription:36},map:[{name:'�ߴ�',value:'��'},{name:'��ɫ',value:'��'},{name:'����',value:'32GB'}��{name:'����',value:36}]} 

    //              {info:{item:222,suscription:12},map:[{name:'�ߴ�',value:'��'},{name:'��ɫ',value:'��'},{name:'����',value:'64GB'}��{name:'����',value:12}]]},
    //              {info:{item:333},map:[{name:'�ߴ�',value:'С'},{name:'��ɫ',value:'��'},{name:'����',value:'16GB'}��{name:'����',value:36}]]},
    //              {info:{item:444},map:[{name:'�ߴ�',value:'��'},{name:'��ɫ',value:'��'},{name:'����',value:'16GB'}]}]
    var checkConfig = function (config) {
        return NEG.utility.isDefined(config.properties) && config.properties.length > 0
                    && NEG.utility.isDefined(config.availableMap) && config.availableMap.length > 0;
    };

    var processConfig = function (config) {
        var res = {};
        var propertyNames = [];
        res.properties = (function () {
            var processedProperties = [];
            var propertyLen = config.properties.length;
            for (var i = 0; i < propertyLen; i++) {
                var propertyTemp = config.properties[i];
                var processedProperty = {};
                processedProperty.name = propertyTemp.name;
                processedProperty.value = propertyTemp.value;
                propertyNames.push(processedProperty.name);
                processedProperties.push(processedProperty);
            }
            return processedProperties;
        })();

        var castedPropertyName = NEG.cast(propertyNames);
        res.availableMap = (function () {
            var processedMap = [];
            var curMapLen = config.availableMap.length;
            for (var i = 0; i < curMapLen; i++) {
                var curMap = config.availableMap[i];
                var flag = true;
                var mLen = curMap.map.length;
                var theNamesInMap = [];
                for (var j = 0; j < mLen; j++) {
                    var theName = curMap.map[j].name;
                    if (!theName || castedPropertyName.indexOf(theName) == -1 || NEG.cast(theNamesInMap).indexOf(theName) != -1) {
                        flag = false;
                        break;
                    }
                    theNamesInMap.push(theName);
                }
                if (flag) {
                    processedMap.push(curMap);
                }
            }
            return processedMap;
        })();
        return res;
    };

    var propertyManagerBuilder = function (config, option) {
        var res = null;
        if (checkConfig(config)) {
            var processedConfig = processConfig(config);
            res = new PropertyManager(processedConfig, option);
        }
        return res;
    };

    return propertyManagerBuilder;
});