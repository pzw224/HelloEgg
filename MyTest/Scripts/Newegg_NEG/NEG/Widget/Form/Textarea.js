NEG.Module("NEG.Widget.Form.Textarea", function (require) {
    var jQuery = require("Utility.JQuery");

    var textareaProxy = (function () {
        var avatars = {};
        var removeDelayHandle;
        var proxy = {
            create: function () {
                var createNew = function () {
                    var defaultStyle = "word-break:break-word;position:absolute;right:200%";
                    var containerAvatar = document.createElement("div");
                    containerAvatar.style.cssText = defaultStyle;
                    document.body.appendChild(containerAvatar);

                    var textAvatar = document.createElement("span");
                    textAvatar.style.cssText = defaultStyle;
                    textAvatar.innerHTML = "A";
                    document.body.appendChild(textAvatar);

                    avatars.container = containerAvatar;
                    avatars.text = textAvatar;
                    return avatars;
                };
                removeDelayHandle && clearTimeout(removeDelayHandle);
                return avatars.container && avatars.text ?
                    avatars :
                              createNew();
            }

           , remove: function (delay) {
               delay = delay || 5000; // defaule delay 5 seconds
               var _remove = function () {
                   var containerAvatar = avatars.container;
                   var textAvatar = avatars.text;
                   containerAvatar && containerAvatar.parentElement.removeChild(containerAvatar);
                   textAvatar && textAvatar.parentElement.removeChild(textAvatar);
                   avatars.container = null;
                   avatars.text = null;
               };
               removeDelayHandle = setTimeout(_remove, delay);
           }

           , reset: function (textareaElement) {
               proxy.create();
               var $originElement = jQuery(textareaElement);

               // clone style
               jQuery(avatars.container).css({
                   width: $originElement.width()
                  , font: $originElement.css("font")
                  , padding: $originElement.css("pading")
               });

               jQuery(avatars.text).css({
                  font: $originElement.css("font")
               });

               // copy content text
               avatars.container.innerHTML = textareaElement.value.replace(/\n/g, '<br style="padding:0;margrin:0;font-size:0" />');
               return avatars;

           }

          , rows: function (textareaElement) {
              var avatars = proxy.reset(textareaElement);
              var contentHeight = avatars.container.clientHeight;

              // get line-height
              var lineHeight = avatars.text.offsetHeight;

              // calculated line number
              var lineNum = Math.ceil(contentHeight / lineHeight);
              
              // remove proxy
              proxy.remove();

              return lineNum;
          }
        };

        return function (textareaElement) {
            return {
                rows: proxy.rows(textareaElement)
            };
        };
    }());


    var Textarea = function (textareaElement) {

        var api = {
            rows: function () {
                var proxy = textareaProxy(textareaElement);
                return proxy.rows;
            }
        };

        // set attribute
        api.rows.toString = api.rows;
        return api;
    }

    return Textarea;
});