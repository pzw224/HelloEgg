NEG.Module('Widget.Popup', function (require) {
    var $ = require('Utility.JQuery');
    var Popup = function (target, option) {
        //var me = arguments.callee;
        var me = Popup;
        var $this = this;
        if (!(this instanceof me)) {
            return new me(target, option);
        };

        var $window = $(window)

        //   ,$target = $(target).clone(true);
        /*
        var popupContent = NEG.isType(target, 'String') ? target
                            : target.addEventListener ? target.cloneNode(true)
                                : $(target.outerHTML)[0];
        */
        var popupContent = $(target).clone().get(0);

        $(popupContent).css({
            position: 'relative'
        });


        var _option = {
            position: {
                x: null
               , y: null
            }
           , relative: window
           , zIndex: 'auto'
           , maskColor: "#fff"
           , maskOpacity: 0.01
           , openEffect: null
           , closeEffect: null
           , closeOnClick: true
        };

        NEG.merge(_option, option);

        var $doc = $(document);
        var createMask = function () {
            var $mask = $('<div style=' + '"display:none"' + '>');
            var $ifm = $('<iframe>');
            var doclayout = { width: $doc.width(), height: $doc.height() };
            $mask.css({
                width: doclayout.width
               , height: doclayout.height
               , position: 'absolute'
               , top: 0
               , left: 0
               , backgroundColor: _option.maskColor || '#fff'
               , opacity: _option.maskOpacity || 0.1
            });

            $ifm.css({
                width: doclayout.width
               , height: doclayout.height
               , opacity: 0.1
               , position: 'absolute'
               , top: 0
               , left: 0
            });
            $mask.append($ifm);
            return $mask;
        };

        var $mask = createMask();
        var $popup = $('<div>');
        $popup.append($mask);
        $popup.append(popupContent);
        $popup.appendTo(document.body);

        $popup.css({
            position: 'absolute'
          , top: 0
          , left: 0
        });

        $(popupContent).hide();


        $window.on('resize', function (e) {
            $mask.css({ width: $doc.width(), height: $doc.height() });
            $(popupContent).css({
                left: $window.scrollLeft() + ($window.width() - $(popupContent).width()) / 2
               , top: $window.scrollTop() + ($window.height() - $(popupContent).height()) / 2
            })
        });

        this.show = function () {

            if (!_option.position.x) {
                _option.position.x = $window.scrollLeft() + ($window.width() - $(popupContent).width()) / 2;
            }
            if (!_option.position.y) {
                _option.position.y = $window.scrollTop() + ($window.height() - $(popupContent).height()) / 2
            }

            $(popupContent).css({
                left: _option.position.x
               , top: _option.position.y
               , zIndex: _option.zIndex
            });

            $(popupContent).show();
            $mask.show();
            _option.openEffect ? _option.openEffect.call($popup[0], $popup[0]) : $popup.show();
            return this;
        };

        this.close = function () {
            _option.closeEffect ? _option.closeEffect.call($popup[0], $popup[0]) : $popup.hide();
            return this;
        };

        if (_option.closeOnClick && $mask) {
            $mask.find("iframe").contents().on("click", function () {
                $this.close();
            })
        }
        this.target = popupContent;
        this.mask = $mask;
        
    };

    return Popup;
});