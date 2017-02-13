// 计算 -- 概览页面js
var index_flag = 0;
var abstractCtrl = angular.module('abstractCtrl', []);
abstractCtrl.controller('abstractController', function($scope, $http, $route) {
    $("#first_page").css({
        "color": "#fff",
        "background-color": "#428bca"
    });
    $scope.refresh = function() {
        $route.reload();
    }
    $("head title").text("概况");
    $scope.$parent.loadScript('js/lib/echarts.min.js');
    $scope.$parent.loadScript('js/config.js');
    $scope.$parent.loadScript('js/tools/tool.js');

    $scope.usages = [];
    $scope.numInfos = [{ number: "0", name: "user_num" }, { number: "0", name: "physical_num" },
        { number: "0", name: "tenant_num" }, { number: "0", name: "server_num" },
        { number: "0", name: "network_num" }, { number: "0", name: "subnet_num" },
        { number: "0", name: "router_num" }
    ];
    var url = config['host'] + "/v1.0/admin/abstract?token=" + window.localStorage.token;
    $http.get(url).then(function(response) {
        $scope.usages = response.data.tenants_usage_info;
        console.log($scope.usages);
        var num_infos = response.data.num_info;
        var numInfoTemp = $scope.numInfos;
        for (var i = 0; i < 7; i++) {
            var name = numInfoTemp[i].name;
            numInfoTemp[i].number = num_infos[name];
        }
        $scope.numInfos = numInfoTemp;
        $scope.simplePageCount = $scope.usages.length;
    });

    // $scope.queryInfo = function() {
    //     $.ajax({
    //         type: "GET",
    //         url: config['host'] + "/v1.0/admin/abstract?token=" + window.localStorage.token,
    //         success: function(data) {
    //             console.log(data);
    //             $scope.usages = JSON.parse(data).tenant_usages;
    //             // console.log($scope.usages);
    //             var num_infos = JSON.parse(data).num_info;
    //             var numInfoTemp = $scope.numInfos;
    //             for (var i = 0; i < 7; i++) {
    //                 var name = numInfoTemp[i].name;
    //                 numInfoTemp[i].number = num_infos[name];
    //             }
    //             $scope.numInfos = numInfoTemp;
    //             console.log($scope.numInfos);
    //             //$scope.simplePageCount = $scope.usages.length;
    //         },
    //         error: function() {
    //             createAndHideAlert({
    //                 "message": "操作失败！",
    //                 "className": "alert-danger"
    //             });
    //         }
    //     });
    // }();

});
