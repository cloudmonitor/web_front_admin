var projectsCtrl = angular.module('projectsCtrl', []);
projectsCtrl.controller('projectsController', function($scope, $http, $route) {
    $scope.$parent.loadScript('js/lib/echarts.min.js');
    $scope.$parent.loadScript('js/config.js');
    // $scope.$parent.loadScript('js/index.js');
    $scope.$parent.loadScript('js/tools/tool.js');
    $scope.refresh = function() {
        $route.reload();
    }
    $("head title").text("项目");
    $scope.qiandaoInfos = [["test", "test", "test", "test", "test"], ["test", "test", "test", "test", "test"]];


});
