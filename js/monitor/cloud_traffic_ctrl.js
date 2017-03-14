/**
 * Created by lwj on 2017/2/13.
 */
// 云主机资源监控界面 -- 控制器
angular.module('myApp')
    .controller('CloudTrafficCtrl', ['$scope', '$http',
        function($scope, $http) {
            $scope.$parent.loadScript('js/tools/tool.js');
            $scope.$parent.loadScript('js/lib/echarts.min.js');
            $scope.$parent.loadScript('js/lib/moment.min.js');
            $scope.$parent.loadScript('js/monitor/cloud_traffic.js');
            $("head title").text("云平台流量监控");
        }
    ]);
