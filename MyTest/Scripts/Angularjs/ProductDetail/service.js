/// <reference path="../angular.js" />
angular.module("myapp.service", [])
/********************service****************/
    // 1、factory() 2、service() 3、provider()
    // services作为单例对象在需要到的时候被创建，只有在应用生命周期结束的时候，controller在不需要的时候就被销毁了，在使用路由的时候，通过controller传递数据是不可靠的
    // factory()- 在service里面当我们仅仅需要的是一个方法和数据的集合且不需要处理复杂的逻辑的时候，factory()是一个非常不错的选择。
    // service()- service()方法很适合使用在功能控制比较多的service里面
    // provider()- 当我们希望在应用开始前对service进行配置的时候就需要使用到provider()。比如，我们需要配置services在不同的部署环境里面（开发，演示，生产）使用不同的后端处理的时候就可以使用到了
    // provider()- 我们打算发布开源provider()也是首选创建service的方法，这样就可以使用配置的方式来配置services而不是将配置数据硬编码写到代码里面。
    .factory('User', function ($http) { // injectables go here
        var backendUrl = "http://localhost:55427";
        var service = {    // our factory definition
            user: { email: "无" },
            setName: function (newName) {
                service.user['name'] = newName;
            },
            setEmail: function (newEmail) {
                service.user['email'] = newEmail;
            },
            save: function () {
                return $http.post(backendUrl + '/users', {
                    user: service.user
                });
            }
        };
        //注意，factory需要返回一个对象，即调用时是不会new的
        return service;
    })
    .service('serviceUser', function ($http) { // injectables go here
        var self = this; // Save reference
        this.user = { email: "无" };
        this.backendUrl = "http://localhost:55427";
        this.setName = function (newName) {
            self.user['name'] = newName;
        }
        this.setEmail = function (newEmail) {
            self.user['email'] = newEmail;
        }
        this.save = function () {
            return $http.post(self.backendUrl + '/users', {
                user: self.user
            })
        }

    })
    .provider('Users', function () {
        //注意provider的名称，在config和controller里注入名称不同，且this.$get返回的对象只能在controller里使用,而this定义的属性，只能在config中被访问
        this.backendUrl = "http://localhost:55427";
        this.setBackendUrl = function (newUrl) {
            if (newUrl) this.backendUrl = newUrl;
        }
        this.$get = function ($http) { // injectables go here
            var self = this;
            var service = {
                user: {},
                setName: function (newName) {
                    service.user['name'] = newName;
                },
                setEmail: function (newEmail) {
                    service.user['email'] = newEmail;
                },
                setBackEndUrl: function () {
                    this.user["backendUrl"] = self.backendUrl;
                },
                save: function () {
                    return $http.post(self.backendUrl + '/users', {
                        user: service.user
                    })
                }
            };
            return service;
        }
    });
/***********************end****************/