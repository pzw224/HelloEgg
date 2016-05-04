/// <reference path="../angular.js" />
var myapp = angular.module("myapp", ['myapp.route']);
//入口函数
myapp.run(function ($rootScope, $location) {
    //监视路由变化
    $rootScope.$on('$routeChangeStart', function (evt, next, current) {
        console.log("$routeChangeStart:"+$location.absUrl());
        $rootScope.rootAbsUrl = $location.absUrl();
    });
})
    .controller("HeaderController", ['$scope',function ($mycope) {
        $mycope.membership_bar_logo_text = "try";
    }])
    .controller("FooterController", function ($scope) {
        $scope.images = [
            { src: 'http://images10.newegg.com/WebResource/Themes/2005/Nest/awards_04.gif', alt: 'VeriSign' },
            { src: 'http://images10.newegg.com/WebResource/Themes/2005/Nest/blue-seal-newegginc.png', alt: 'Click for the BBB Business Review of this Computers - Supplies & Parts in Whittier CA' },
            { src: 'https://sealserver.trustwave.com/seal_image.php?customerId=337bdba159684b989be28d750101ed87&size=105x54&style=', alt: "This site is protected by Trustwave's Trusted Commerce program" },
            { src: 'http://images10.newegg.com/WebResource/Themes/2005/Nest/inc500.gif', alt: 'Inc500' }
        ];
        $scope.a_texts = [
            { a_text: "Policy & Agreement ", last: false },
            { a_text: "Privacy Policy ", last: true }
        ];
        $scope.span_texts = [
            { span_text: "© 2000-2015" },
            { span_text: "NEWEGG" },
            { span_text: "INC." },
            { span_text: "ALL RIGHTS RESERVED. " },
        ];
    })
    .controller("MainController", ['$scope','$location',function ($scope, $location) {
        $scope.nav = { all: "All Products", deals: "Deals & Services", featured: "Featured Sellers" };
        $scope.array = ["张三", "张三", "李四", "王五", "赵六"];
        $scope.selectValues = [{ id: 1, subItem: "0", label: "Search all", translate: "所有" }, { id: 0, subItem: "100006550", label: "Computer Systems", translate: "电脑系统" }, { id: 2, subItem: "100006519", label: "Components", translate: "部件" }, { id: 3, subItem: "100006521", label: "Electronics", translate: "电子仪器" }, { id: 4, subItem: "100006616", label: "Gaming", translate: "游戏" }, { id: 5, subItem: "100129453", label: "Networking", translate: "网络商品" }, { id: 6, subItem: "100018259", label: "Office Solutions", translate: "Office 产品" }, { id: 7, subItem: "100018260", label: "excel", translate: "Office 产品" }];
        $scope.selected = 0;

        $scope.name = "姓名列表：";

        $scope.routeObj = {
            absUrl: $location.absUrl(),
            url: $location.url(),
            protocol: $location.protocol(),
            host: $location.host(),
            port: $location.port(),
            path: $location.path(),
            search: $location.search()
        };

        /***************广播******************/
        //$scope.$emit(name, data) 子Controller向上广播，
        //$scope.$broadcast(name, data) 父Controller向下广播
        //$scope.on(name,function(event,data){ });接收消息
        //例：
        $scope.broadClick = function () {
            $scope.$broadcast("mainBroadcast", { pagesize: 50 });
            
        }
        $scope.$on("bindEmit", function (event, data) {
            console.log("从$emit中接收到消息，url：" + data.url);
        });
        /****************end*****************/
    }])
    .controller("ProjectListController", function ($scope, $location) {
        $scope.routeObj = {
            absUrl: $location.absUrl(),
            url: $location.url(),
            protocol: $location.protocol(),
            host: $location.host(),
            port: $location.port(),
            path: $location.path(),
            search:$location.search()
        };
        //$scope.absUrl = $location.absUrl();
        //$scope.url = $location.url();
        //$scope.protocol = $location.protocol();
        //$scope.host = $location.host();
        //$scope.port = $location.port();
        //$scope.path = $location.path();
    })
    .controller("BindController", function (User, $scope, serviceUser, Users) {
        $scope.$on("mainBroadcast", function (event, data) {
            console.log("从$broadcast中接收到消息，pagesize：" + data.pagesize);
        });
        $scope.emitClick = function () {
            $scope.$emit("bindEmit", { url: "www.baidu.com" });

        }


        $scope.result = { colorText: "" };
        //ng-class：color数据源
        $scope.color = {
            red: "red",
            yellow: "yellow",
            blue: "blue",
            gray: "gray",
            green: "green",
            orange: "orange",
            pink: "pink",
            greenyellow: "greenyellow",
            black: "black"
        }
        //变色方法
        $scope.result.changeColor = function () {
            var random = parseInt(Math.random() * 10);
            switch (random) {
                case 0: $scope.result.colorText = $scope.color.red; break;
                case 1: $scope.result.colorText = $scope.color.yellow; break;
                case 2: $scope.result.colorText = $scope.color.blue; break;
                case 3: $scope.result.colorText = $scope.color.gray; break;
                case 4: $scope.result.colorText = $scope.color.orange; break;
                case 5: $scope.result.colorText = $scope.color.pink; break;
                case 6: $scope.result.colorText = $scope.color.greenyellow; break;
                case 7: $scope.result.colorText = $scope.color.black; break;
                default: $scope.result.colorText = $scope.color.green; break;
            }
            console.log(random + ":" + $scope.result.colorText);
        }

        User.setName("王婆");
        $scope.result.user = User.user;
        serviceUser.setName("武大");
        $scope.result.serviceUser = serviceUser.user;
        Users.setName("西门");
        Users.setEmail("470407476@qq.com");
        Users.setBackEndUrl();
        $scope.result.userProvider = Users.user;

        $scope.sayHello = function (name, good, sex) {
            alert("Hello " + name + ",天气：" + good + ",sex:" + sex);
        }
    })
    .filter("captitallize", function () {
        //自定义过滤器
        return function (input) {
            if (input) {
                //首字母大写
                return input[0].toUpperCase() + input.slice(1);
            }
        }
    })
    //自定义指令
    .directive("helloWorld", function () {
        var result = {
            //A:属性 <div hello-world=products></div> 
            //E：元素 <hello-world title=products></hello-world>
            //C：样式类 <div class=hello-world:products></div>
            //M：注释 <!-- directive:hello-world products -->
            restrict: 'AECM',
            //template: "<h3>hello my directive <span ng-transclude></span></h3>",  //指令显示的内容。注意：ng-transclude一定要和transclude配合使用，否则报错
            templateUrl:'../ProductDetail/derective/HelloWorld.html',
            transclude: true, //默认为false，设置为true，指令内的元素追加在ng-transclude绑定处
            replace: true,  //true-模板内容替换指令，false-模板内容追加在指令里
            scope: {        //1、true-创建一个新的scope，继承于父scope 2、{}-创建一个封闭作用域的scope
                mm: '=myModel', // 将ngModel同指定对象绑定
                onSend: '&',  // 将引用传递给这个方法
                fromName: '@' // 储存于fromName 相关联的字符串
            },
            controller: function ($scope) {
                $scope.helloName = "摩托";
                $scope.sex = "男";
                $scope.$watch("helloName", function (newValue,oldValue) {
                    if ($scope.helloName.length > 0) {
                        console.log("helloName NewValue:" + newValue + ",oldValue:" + oldValue);
                    }
                })
            }
        };
        return result;
    })
;
