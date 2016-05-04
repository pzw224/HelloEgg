angular.module("myapp.route", ['ngRoute', 'myapp.service'])
//路由
    .config(function ($routeProvider, UsersProvider) {
        UsersProvider.setBackendUrl("http://www.irwall.com");
        $routeProvider
        .when('/', {
            controller: 'MainController',
            templateUrl: 'Content.html',
        })
        .when('/productlist/item', {
            controller: 'ProjectListController',
            templateUrl: 'ProductList.html',
        })
        .when('/productlist/item1/:item', {
            controller: 'MainController',
            templateUrl: 'ProductList.html'
        })
        .when('/error', {
            templateUrl: 'Error.html'
        })
        .otherwise({
            redirectTo: '/error'
        });
    });