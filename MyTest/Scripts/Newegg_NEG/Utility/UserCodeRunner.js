NEG.Module('Utility.UserCodeRunner',function(require) {
    var userCodeRunner = function() {
        var docwriteTag = 'docwrite';
        var userScriptTag = 'userscript';
        var userStyleTag = 'userstyle'
        var userCodeTag = 'code';
        //var nativeWriteMethod = document.write;
        var scriptPlaceholder ;

        

        /*
        document.body.appendChild(document.createElement(userScriptTag));
        document.body.appendChild(document.createElement(userStyleTag));
        document.body.appendChild(document.createElement(userCodeTag));
        document.body.appendChild(document.createElement(docwriteTag));
        */


        function nodeListToArray(nodes){
            var arr, length;
            try {
                // works in every browser except IE
                arr = [].slice.call(nodes);
                return arr;
            } catch(err){
                // slower, but works in IE
                arr = [];
                length = nodes.length;
                for(var i = 0; i < length; i++){
                     arr.push(nodes[i]);
                 }  
                return arr;
            }
        } 

        var loadJS = function() {
            var js = document.createElement('script');
            var head = document.getElementsByTagName('head')[0];
            var _loadJS = function(src) {
                js.src = src;
                var jsList = nodeListToArray(head.getElementsByTagName('script'));
                var isLoaded;
                for (var i = jsList.length - 1; i >= 0; i--) {
                    var activeScript = jsList[i];
                    isLoaded = activeScript.src && activeScript.src === src;
                };
                isLoaded || head.appendChild(js)
            };
            return _loadJS;
        }();

        var loadCSS = function() {
            var css = document.createElement('link');
            var head = document.getElementsByTagName('head')[0];
            var _loadCSS = function(href) {
                css.href = href;
                var cssList = nodeListToArray(head.getElementsByTagName('link'));
                for (var i = cssList.length - 1; i >= 0; i--) {
                    var activeLink = cssList[i];
                    activeLink.href && activeLink.href === href && head.appendChild(css);
                };
            };
            return _loadCSS;
        }();        
   
        var filterJs = function(str) {
            var testJsFile  = /<script.*?\bsrc\s*=\s*[\'"](.*?)['"].*?>.*?<\s*\/script\s*>/ig;
            str = str.replace(testJsFile,function(script,src){
                src && loadJS(src);
                return '';
            });
            return str;
        };
   
        
        var docWriteSubstitute = function(str) {
            str = filterJs(str);
            var strNode = document.createElement(docwriteTag);
            strNode.innerHTML = str;
            scriptPlaceholder && scriptPlaceholder.parentNode.insertBefore(strNode,scriptPlaceholder);
        };


        var renderUserCode = function(userCodeElement) {
            var userCodes = userCodeElement ? ([]).concat(userCodeElement) : document.getElementsByTagName(userCodeTag);
            userCodes = nodeListToArray(userCodes);
            for(var codeIndex=0, frameLength = userCodes.length, activeUserCode; codeIndex<frameLength; codeIndex++) {
                activeUserCode = userCodes[codeIndex];
                //if (!userCodeElement && activeUserCode.getAttribute('type') === "text/user-code") {
                if (userCodeElement || activeUserCode.getAttribute('type') === "text/user-code") {
                    parseUserCode(activeUserCode);
                    activeUserCode.parentNode.removeChild(activeUserCode);
                }
            }
            //document.write = nativeWriteMethod;            
        }


        
        
        function parseUserCode(userCode) {
            //var userCodeContainer = document.createElement('div');
            var userCodeContainer = document.createElement('userCodeZone');
            userCode.parentNode.insertBefore(userCodeContainer, userCode);
            userCode.style.display = "none";
            
            var scriptList = [];
            var jsFilesList = [];
            var styleList = [];

            //remove userCode comment tag 
            userCode = userCode.innerHTML.replace(/(^\s*?<!--)|(-->\s*?$)/g, '');
            //remove multi-line comment
            userCode = userCode.replace(/(?!['"])\/\*[\w\W]*?\*\//igm, '');

            //remove single line comment
            userCode = userCode.replace(/(['"])[\w\W]*?\1|((['"])[\w\W]*?)\/\/[\w\W]*?\2|\/\/[\w\W]*?(\r|\n|$)/g, function (str, isString) {
                return isString ? str : ''
            });

            //get user script
            //userCode = userCode.replace(/(?!['"])<script.*?>([\w\W]*?)<\/script>(?!['"])/gim, function(scriptBlock,script) {
            userCode = userCode.replace(/(?!['"])<script.*?>([\w\W]*?)<\/script>(?!['"])/gim, function (scriptBlock, script) {
                var hasSrc = script ? false : scriptBlock.match(/<script.*?(?:\bsrc\s*?=\s*?['"](.+?)['"]).*?>[\w\W]*?<\s*\/script\s*>/i);
                hasSrc && jsFilesList.push(hasSrc[1]);//loadJS(hasSrc[1]);
                script && scriptList.push(script);
                return script && document.createElement(userScriptTag).outerHTML;
            });

            //fix user style for IE 7~8
            userCode = !document.createStyleSheet ? userCode :userCode.replace(/(?!['"])<style.*?>([\w\W]+?)<\/style>(?!['"])/gim, function(userStyle,cssText) {
                styleList.push(cssText);
                return document.createElement(userStyleTag).outerHTML;
            });            
            
            userCodeContainer.innerHTML = userCode;
            //scriptList.length>0 && NEG.loadJS(jsFilesList, function () {runUserScript(userCodeContainer,scriptList)});
            if (jsFilesList.length > 0) {
                NEG.loadJS(jsFilesList, function () {
                    runUserScript(userCodeContainer, scriptList);
                });
            } else if (scriptList.length > 0) {
                runUserScript(userCodeContainer, scriptList);
            }
            styleList.length>0 && runUserStyle(userCodeContainer,styleList);
        }


        function runUserScript(userCode, scriptList) {
            var nativeWriteMethod = document.write;
            document.write = docWriteSubstitute;

            elements = nodeListToArray(userCode.childNodes)
            for(var i=0;i<elements.length;i++){
                var activeElement = elements[i];
                if(activeElement.nodeName.toLowerCase() === userScriptTag) {
                    //var placeholder = document.createDocumentFragment();
                    scriptPlaceholder = activeElement;
                    //Function(scriptList.shift())();
                    (function (userScript) { eval(userScript) })(scriptList.shift());

                    /*
                    var script = document.createElement('script');
                    script.text = scriptList.shift();
                    scriptPlaceholder.parentNode.replaceChild(script, scriptPlaceholder);
                    */
                }
                scriptPlaceholder && scriptPlaceholder.parentNode.removeChild(scriptPlaceholder);
                scriptPlaceholder = null;
                
            }

            document.write = nativeWriteMethod;
        }

        //fix user style for IE 7~8
        function runUserStyle(userCode,styleList) {
            /*
            elements = nodeListToArray(userCode.childNodes)
            for(var i=0;i<elements.length;i++){
                var activeElement = elements[i];
                if(activeElement.nodeName.toLowerCase() === userStyleTag) {
                    var styleSheet = document.createStyleSheet()
                    styleSheet.cssText  = styleList.shift();
                }                
            } 
            */          

           while(styleList.length>0){
            var styleSheet = document.createStyleSheet()
                    styleSheet.cssText  = styleList.shift();
           }
           
        }        

         return renderUserCode;
    }();

    return {run:userCodeRunner};
});