// 物理主机界面 -- 资源使用
angular.module('myApp')
    .controller('physicalHostsUsageCtrl', ['$scope', 'PhysicalHostsService',
        function($scope, PhysicalHostsService) {
            // 初始化
            $scope.itemPerPage = 4;
            $scope.currentPage = 1;
            $scope.sortType = 'hypervisor_hostname';
            $scope.sortReverse = false;

            // 获取物理主机资源
            PhysicalHostsService.getResourceSummary().then(function(response) {
                // 请求成功
                $scope.hypervisors = response.data;
            });
        }
    ])
