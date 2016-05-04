NEG.Module("NEG.Widget.Viewport", function () {
    var events = {
        FIRSTIN: "FIRSTIN" + new Date().getTime(),
        IN: "IN" + new Date().getTime(),
        BOTTOM: "BOTTOM" + new Date().getTime(),
        RIGHT: "RIGHT" + new Date().getTime()
    }

    var viewportEvent = {
        CHANGE: "CHANGE" + new Date().getTime(),
        CHANGED: "CHANGED" + new Date().getTime()
    }

    var eventHandleProxy = {
        FIRSTIN: function (elements, handle) {
            return function () {
                var element = this;
                NEG(element).off(events.FIRSTIN);
                handle.call(element);
            }
        }
    }

    var help = {
        getViewport: function () {
            var StandardsMode = /css.compat/i.test(document.compatMode);
            var doc = StandardsMode ? document.documentElement : document.body;
            var scrollHost = document.documentElement.scrollTop > 0 ? document.documentElement : document.body
            var area = {
                width: doc.clientWidth,
                height: doc.clientHeight,
                top: scrollHost.scrollTop,
                right: scrollHost.scrollLeft + doc.clientWidth,
                bottom: scrollHost.scrollTop + doc.clientHeight,
                left: scrollHost.scrollLeft
            }
            return area;
        }

       , offset: function (dom) {
           var bodyRect = document.body.getBoundingClientRect();
           var domRect = dom.getBoundingClientRect();
           var globalPosition = {
               top: Math.abs(bodyRect.top - domRect.top),
               right: Math.abs(bodyRect.left - domRect.left) + dom.offsetWidth,
               bottom: Math.abs(bodyRect.top - domRect.top) + dom.offsetHeight,
               left: Math.abs(bodyRect.left - domRect.left)
           };
           return globalPosition
       }
    };


    var control = {
        bindScroll: function (elements) {
            var scrollHandle;
            var delay = 300; //millisecond 
            var viewportChangehandle = function () {
                scrollHandle && clearTimeout(scrollHandle);
                scrollHandle = setTimeout(function () {
                    NEG.trigger(viewportEvent.CHANGE, help.getViewport());
                    NEG.trigger(viewportEvent.CHANGED);
                }, delay);
            };
            NEG(document).on("scroll", viewportChangehandle);
            NEG(window).on("scroll", viewportChangehandle);
            NEG(window).on("resize", viewportChangehandle);
        },

        bindChange: function (elements) {
            NEG(elements).on(viewportEvent.CHANGE, function () {
                var element = this;
                var viewportRect = help.getViewport();
                var elementOffset = help.offset(element);

                var fromTop = elementOffset.top < viewportRect.top && elementOffset.bottom > viewportRect.top;
                var inSide = elementOffset.top > viewportRect.top && elementOffset.bottom < viewportRect.bottom;
                var fromBottom = elementOffset.top < viewportRect.bottom && elementOffset.bottom > viewportRect.bottom
                var cross = elementOffset.top + element.offsetHeight > viewportRect.bottom && elementOffset.top < viewportRect.top;
                if (fromTop || inSide || fromBottom || cross) {
                    NEG(element).trigger(events.FIRSTIN);
                    NEG(element).trigger(events.IN);
                }
                if (elementOffset.bottom < viewportRect.bottom && elementOffset.bottom > viewportRect.top) {
                    NEG(element).trigger(events.BOTTOM);
                }
                if (elementOffset.right < viewportRect.right && elementOffset.right > viewportRect.left) {
                    NEG(element).trigger(events.RIGHT);
                }
            });
        }

    };







    var viewport = function (elements) {
        var activeHost = this;
        if (!(activeHost instanceof viewport)) {
            return new viewport(elements);
        }

        NEG.domReady(function () {
            control.bindScroll(elements);
            control.bindChange(elements);
        });

        this.on = function (event, handle) {
            if (events[event]) {
                var handleProxy = eventHandleProxy[event];
                handle = handleProxy ? handleProxy(elements, handle) : handle;
                NEG(elements).on(events[event], handle);
            }

            if (viewportEvent[event]) {
                NEG.on(viewportEvent[event], handle);
            }
        }

    };

    return viewport;
});