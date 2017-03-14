var myApp = angular.module('myApp', ['ngRoute', 'abstractCtrl', 'projectsCtrl', 'userCtrl', 'angularUtils.directives.dirPagination', 'ngFileUpload']);

// 路由跳转 
var router_all;
myApp.config(function($routeProvider) {
    $routeProvider
    // 默认加载的主页  计算--概览
        .when('/', {
            templateUrl: 'pages/abstract/abstract.html',
            controller: 'abstractController'
        })
        .when('/identity/projects/detail/:projectInfo', {
            templateUrl: 'pages/identity/projects_detail.html',
            controller: 'projectsDetailController'
        })
        .when('/identity/projects', {
            templateUrl: 'pages/identity/projects.html',
            controller: 'projectsController'
        })
        .when('/identity/userInfo', {
            templateUrl: 'pages/identity/userInfo.html',
            controller: 'userInfoController'
        })
        .when('/cloudHosts', {
            templateUrl: 'pages/cloud_hosts/cloud_hosts.html',
            controller: 'CloudHostsCtrl'
        })
        .when('/cloudHostsDetail', {
            templateUrl: 'pages/cloud_hosts/cloud_hosts_detail.html',
            controller: 'CloudHostsDetailCtrl'
        })
        .when('/physicalHosts/usage', {
            templateUrl: 'pages/physical_hosts/physical_hosts_usage.html',
            controller: 'physicalHostsUsageCtrl'
        })
        .when('/image/summary', {
            templateUrl: 'pages/image/image_summary.html',
            controller: 'imageSummaryCtrl'
        })
        .when('/tenant/resource', {
            templateUrl: 'pages/tenant_resource/tenant_resource.html',
            controller: 'TenantResourceCtrl'
        })
        .when('/monitor/instance_resource', {
            templateUrl: 'pages/monitor/instance_resource.html',
            controller: 'InstanceResourceCtrl'
        })
        .when('/monitor/instance_traffic', {
            templateUrl: 'pages/monitor/instance_traffic.html',
            controller: 'InstanceTrafficCtrl'
        })
        .when('/monitor/tenant_traffic', {
            templateUrl: 'pages/monitor/tenant_traffic.html',
            controller: 'TenantTrafficCtrl'
        })
        .when('/monitor/cloud_traffic', {
            templateUrl: 'pages/monitor/cloud_traffic.html',
            controller: 'CloudTrafficCtrl'
        })
        .when('/tenant/resource/:tenantId', {
            templateUrl: 'pages/tenant_resource/tenant_resource.html',
            controller: 'TenantResourceCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

});

//----------------------------控制器-----------------------------------------//
// 根控制器
myApp.controller('myCtrl', myCtrl);

myApp.run(function($rootScope, $location, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (localStorage.token == undefined) {
            localStorage.login_flag = "token";
            window.location.href = $location.absUrl().split("#")[0] + "login.html";
            return;
        }
        var expires = getTimeStr(JSON.parse(localStorage.token).expires);
        $.ajax({
            type: "OPTIONS",
            url: "/",
            complete: function(x) {
                var server_time = getTimeStr(new Object(x.getResponseHeader("Date")).expires);
                if (new Date(server_time).getTime() > new Date(expires).getTime()) {
                    localStorage.login_flag = "expires";
                    window.location.href = $location.absUrl().split("#")[0] + "login.html";
                }
            }
        })
    });
});
// -----------------------------控制器函数实现-----------------------------------------//
function myCtrl($scope) {
    $scope.loadScript = function(url, type, charset) {
        if (type === undefined) type = 'text/javascript';
        if (url) {
            var script = document.querySelector("script[src*='" + url + "']");
            // if (!script) {
            var body = document.getElementsByTagName("body");
            if (body && body.length) {
                var body = body[0];
                if (body) {
                    if (script) {
                        body.removeChild(script);
                    }
                    script = document.createElement('script');
                    script.setAttribute('src', url);
                    script.setAttribute('type', type);
                    if (charset) script.setAttribute('charset', charset);
                    body.appendChild(script);
                }
            }
            // }
            return script;
        }
    };
}
