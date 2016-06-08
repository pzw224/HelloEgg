NEG.Module('Widget.Switch.Effect',function(require){
    var switchEffect = {
            solid : function (activeIndex,items){
                  var itemCount = items.length;
                  var activeIndex = activeIndex || 0;
                  var activeItem = items[activeIndex%itemCount];
                  var lastItem = items[activeIndex===0?itemCount-1:activeIndex-1];
                  
                  for (var i = items.length - 1; i >= 0; i--) {
                    items[i].style.display = 'none'
                  };

                  //在用户未指定样式时 此处默认考虑替换为透明度控制
                  activeItem.style.display = 'block';
                  if (activeItem !== lastItem) {
                      lastItem.style.display = 'none';
                  }
                  //activeItem.style.zIndex = 10;
                  //lastItem.style.zIndex = 0;
              }

           ,scrollX : function (items,option){
                var _container = document.createElement('div');
                container.appendChild(_container);
                _container.appendChild(triggers);
                _container.style.overflow = 'hidden';
                triggers.style.display = 'inline-block';

            } 
    };
    return switchEffect;
});


NEG.Module('Widget.Switch',function(require){
    var switchEffect = require('Widget.Switch.Effect');
    var jQuery = require('Utility.JQuery');
    function Switch(container,option){
        var me = arguments.callee;
        if (!(this instanceof me)) {
            return new me(container,option);
        }

        var _option = {
                contents:[]
               ,triggers:[]
               ,triggerEvent:'click'
               ,pauseEvent:'mouseover'
               ,interval:1000
               ,autoPlay:true
               ,step : 1
               ,activeIndex:0
               ,effect:switchEffect.solid
               ,switchBefor : null
               ,switchAfter : null
               ,stopByHover : true
            }
        NEG.merge(_option,option);

        _option.effect = generateEffect(_option.effect);
        
        function generateEffect(effect){
            return function(){
                if(_option.switchBefor && _option.switchBefor() || !_option.switchBefor){
                    effect.apply(this,[].slice.call(arguments,0));
                }
                _option.switchAfter && _option.switchAfter()
            }
        }

        //为 Triggers 绑定切换事件
        function bindTriggers(){
            var triggerCallback = function(e){
                        api.stop();
                        _option.activeIndex = NEG.utility.Array.indexOf(_option.triggers,this);
                        _option.effect(_option.activeIndex,_option.contents);
                        _option.activeIndex = (_option.activeIndex+_option.step)%_option.contents.length;
                        _option.autoPlay && play();
                };

/*
            if(_option.triggerEvent === "mouseover"){
                jQuery(_option.triggers).hover(triggerCallback);
            }else{
                jQuery(_option.triggers).bind(_option.triggerEvent,triggerCallback);
            }
*/
            (_option.triggerEvent === "mouseover") ?
                jQuery(_option.triggers).hover(triggerCallback) 
               :jQuery(_option.triggers).bind(_option.triggerEvent,triggerCallback);
            


            /*    
            if(_option.triggers.length>0){
                for (var i = _option.triggers.length - 1; i >= 0; i--) {
                    var activeTrigger = _option.triggers[i];
                    NEG(activeTrigger).on(_option.triggerEvent,function(e){
                        api.stop();
                        _option.activeIndex = NEG.ArrayIndexOf(_option.triggers,this);
                        _option.effect(_option.activeIndex,_option.contents);
                        _option.activeIndex = (_option.activeIndex+_option.step)%_option.contents.length;
                        _option.autoPlay && play();
                    })
                };
            }*/
        };
        bindTriggers();


        //为 panels 绑定暂停事件
        ;(function(){
            _option.stopByHover && function(){
                jQuery(_option.contents).hover(
                    function(){
                        _option.autoPlay && api.stop();
                    }

                   ,function(){
                        _option.autoPlay && play();
                   }
                );
            }();
        })();



        var timeHandle;
        function play(activeIndex) {
           //此处计划由NEG框架提供一条公用动画时间轴，用以替代组件各自私有的计时器
            //neg.base.TimeLine(function(){effect()},interval);
           timeHandle && window.clearInterval(timeHandle);
           activeIndex = activeIndex || _option.activeIndex;
           timeHandle = window.setInterval(function(){
               _option.autoPlay || window.clearInterval(timeHandle);
               _option.effect(_option.activeIndex,_option.contents);
               _option.activeIndex = (_option.activeIndex+_option.step)%_option.contents.length;
           },_option.interval); 
        }
        _option.autoPlay && play();

        var Event = {
            SWITCHBEFOR : new String('switch_befor')
           ,SWITCHAFTER : new String('switch_after')
        };
        var api = {
            play : play
           ,stop  : function(){window.clearInterval(timeHandle)}
           ,switchTo : function(activeIndex){
               _option.activeIndex = activeIndex % _option.contents.length;
               _option.effect(activeIndex, _option.contents);
           }
           ,activeIndex : function(){return _option.activeIndex}
           ,Event : Event
        }        
        NEG.merge(this,api);        
    }
    return Switch;
});