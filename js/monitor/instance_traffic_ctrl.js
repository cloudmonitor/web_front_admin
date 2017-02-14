/**
 * Created by lwj on 2017/2/13.
 */
// 云主机资源监控界面 -- 控制器
angular.module('myApp')
    .controller('InstanceTrafficCtrl', ['$scope', '$http',
        function($scope, $http) {
            $scope.$parent.loadScript('js/tools/tool.js');
            $scope.$parent.loadScript('js/lib/echarts.min.js');
            $scope.$parent.loadScript('js/lib/moment.min.js');
            $scope.$parent.loadScript('js/monitor/instance_traffic.js');
            $("head title").text("云主机流量监控");
        }
    ]);
