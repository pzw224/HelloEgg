NEG.Module("NEG.Widget.Scroll", function () {
   
    var help = {
        getViewport :   function  (){
                            var StandardsMode = /css.compat/i.test(document.compatMode);
                            var doc = StandardsMode?document.documentElement:document.body;
                            var scrollHost = document.documentElement.scrollTop > 0 ? document.documentElement : document.body
                            var area = {
                                    width:doc.clientWidth,
                                    height:doc.clientHeight,
                                    top:scrollHost.scrollTop,
                                    right:scrollHost.scrollLeft + doc.clientWidth ,  
                                    bottom:scrollHost.scrollTop + doc.clientHeight , 
                                    left:scrollHost.scrollLeft
                            }
                            return area;
                        }

       ,offset      :   function (dom) {
                            var bodyRect = document.body.getBoundingClientRect();
                            var domRect =  dom.getBoundingClientRect();
                            var globalPosition = {
                                top: Math.abs(bodyRect.top - domRect.top),
                                right:Math.abs(bodyRect.left - domRect.left) + dom.offsetWidth,
                                bottom:Math.abs(bodyRect.top - domRect.top) + dom.offsetHeight ,
                                left:Math.abs(bodyRect.left - domRect.left)
                            };
                            return globalPosition
                        }                
    };   

    var fps = 1000 / 60;
    var scrollHandle;
   var api = {
       to : function(htmlElement) {
           scrollHandle && clearTimeout(scrollHandle);
           //var duration  = 100
           var easing = 0.1;
           
           (function go(){
                var targetTop = help.offset(htmlElement).top;
                var currentTop = help.getViewport().top;
                var distance = targetTop - currentTop;
                var vy = distance * easing;
                Math.abs(vy)>1 && (scrollHandle=setTimeout(go, fps));
                //distance * (startTime /= duration) * startTime
                if(Math.abs(vy)<=1) {
                    window.scrollTo(0,targetTop);
                } else {
                    window.scrollBy(0, vy);
                }
           }());
           
       }
   }
   return api; 
});