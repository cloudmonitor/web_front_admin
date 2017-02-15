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
    var curr_url = '#' + window.location.href.split("#")[1];
    $scope.numInfos = [
        { number: "0", name: "user_num", desc: "用户", color: "panel-primary", photo: "fa fa-users", hrefURL: "#/identity/userInfo" },
        { number: "0", name: "tenant_num", desc: "租户", color: "panel-green", photo: "fa fa-building", hrefURL: "#/tenant/resource" },
        { number: "0", name: "image_num", desc: "镜像", color: "panel-yellow", photo: "fa fa-bars", hrefURL: "#/image/summary" },
        { number: "0", name: "physical_num", desc: "物理主机", color: "panel-red", photo: "fa fa-server", hrefURL: "#/physicalHosts/usage" },
        { number: "0", name: "server_num", desc: "云主机", color: "panel-red", photo: "fa fa-desktop", hrefURL: "#/cloudHosts" },
        { number: "0", name: "network_num", desc: "网络", color: "panel-yellow", photo: "fa fa-wifi", hrefURL: "#/tenant/resource" },
        { number: "0", name: "subnet_num", desc: "子网", color: "panel-green", photo: "fa fa-share-alt", hrefURL: "#/tenant/resource" },
        { number: "0", name: "router_num", desc: "路由器", color: "panel-primary", photo: "fa fa-paper-plane-o", hrefURL: "#/tenant/resource" }
    ];
    var url = config['host'] + "/v1.0/admin/abstract?token=" + window.localStorage.token;
    $http.get(url).then(function(response) {
        $scope.usages = response.data.tenants_usage_info;
        // console.log($scope.usages);
        var num_infos = response.data.num_info;
        var numInfoTemp = $scope.numInfos;
        for (var i = 0; i < $scope.numInfos.length; i++) {
            var name = numInfoTemp[i].name;
            numInfoTemp[i].number = num_infos[name];
        }
        $scope.numInfos = numInfoTemp;
        $scope.simplePageCount = $scope.usages.length;
        $scope.subnets_used = 0;
        $scope.subnets_all = 0;
        $scope.networks_used = 0;
        $scope.networks_all = 0;
        $scope.floatingips_used = 0;
        $scope.floatingips_all = 0;
        $scope.memory_mb = 0;
        $scope.memory_all = 0;
        $scope.security_groups_rule_used = 0;
        $scope.security_groups_rule_all = 0;
        $scope.instance_num = 0;
        $scope.instance_all = 0;
        $scope.vcpus = 0;
        $scope.vcpus_all = 0;
        $scope.security_groups_used = 0;
        $scope.security_groups_all = 0;
        $scope.routers_used = 0;
        $scope.routers_all = 0;
        $scope.ports_used = 0;
        $scope.ports_all = 0;
        for (var i = 0; i < $scope.usages.length; i++) {
            $scope.subnets_used += $scope.usages[i].subnets_used;
            $scope.subnets_all += $scope.usages[i].quotas.subnet;

            $scope.networks_used += $scope.usages[i].networks_used;
            $scope.networks_all += $scope.usages[i].quotas.network;

            $scope.floatingips_used += $scope.usages[i].floatingips_used;
            $scope.floatingips_all += $scope.usages[i].quotas.floatingip;

            $scope.memory_mb += $scope.usages[i].memory_mb;
            $scope.memory_all += $scope.usages[i].quotas.ram;

            $scope.security_groups_rule_used += $scope.usages[i].security_groups_rule_used;
            $scope.security_groups_rule_all += $scope.usages[i].quotas.security_group_rule;

            $scope.instance_num += $scope.usages[i].instance_num;
            $scope.instance_all += $scope.usages[i].quotas.instances;

            $scope.vcpus += $scope.usages[i].vcpus;
            $scope.vcpus_all += $scope.usages[i].quotas.cores;

            $scope.security_groups_used += $scope.usages[i].security_groups_used;
            $scope.security_groups_all += $scope.usages[i].quotas.security_group;

            $scope.routers_used += $scope.usages[i].routers_used;
            $scope.routers_all += $scope.usages[i].quotas.router;

            $scope.ports_used += $scope.usages[i].ports_used;
            $scope.ports_all += $scope.usages[i].quotas.port;

        }
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
