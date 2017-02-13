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
    // $scope.$parent.loadScript('js/index.js');
    $scope.$parent.loadScript('js/tools/tool.js');
    Date.prototype.Format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    $scope.startTime = "2017-01-01";
    $scope.endTime = new Date().Format("yyyy-MM-dd");
    $('#datetimepicker').datetimepicker({
        format: 'yyyy-mm-dd',
        sweekStart: 0,
        autoclose: true,
        startView: 2,
        minView: 2,
        startDate: $scope.startTime,
        maxView: new Date(),
        endDate: new Date()
    });
    $('#datetimepicker1').datetimepicker({
        format: 'yyyy-mm-dd',
        sweekStart: 0,
        autoclose: true,
        startView: 2,
        minView: 2,
        startDate: $scope.startTime,
        endDate: new Date(),
        maxView: new Date()
    });

    $scope.usages = [];
    $scope.numInfos = [];
    $scope.queryInfo = function() {
        var startTime = (new Date($scope.startTime) > new Date($scope.endTime) ? $scope.endTime : $scope.startTime) + " 00:00:00.000000";
        var endTime = (new Date($scope.startTime) < new Date($scope.endTime) ? $scope.endTime : $scope.startTime) + " 00:00:00.000000";
        console.log(startTime, endTime);
        $.ajax({
            type: "GET",
            url: config['host'] + "/v1.0/admin/abstract?token=" + window.localStorage.token + "&start_time=" + startTime + "&end_time=" + endTime,
            success: function(data) {
                console.log(data);
                $scope.usages = JSON.parse(data).tenant_usages;
                // console.log($scope.usages);
                $scope.numInfos = JSON.parse(data).num_info;
                // console.log($scope.numInfos);
                $scope.simplePageCount = $scope.usages.length;
            },
            error: function() {
                createAndHideAlert({
                    "message": "操作失败！",
                    "className": "alert-danger"
                });
            }
        });
    }();

});
