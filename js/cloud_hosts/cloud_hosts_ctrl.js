// 云主机界面 -- 控制器
angular.module('myApp')
    .filter('cloudHostsFilter', function() {
        // 云主机过滤器
        return function(tableItems, search) {
            var result = [];

            if (!search.input) {
                return tableItems;
            }

            angular.forEach(tableItems, function(item, index) {
                if (item[search.name].search(search.input) != -1) {
                    result.push(item)
                }
            });

            return result
        };
    })
    .controller('CloudHostsCtrl', ['$scope', '$http', 'CloudService',
        function($scope, $http, CloudService) {
            // 初始化
            $scope.itemPerPage = 4;
            $scope.currentPage = 1;

            var url = config['host'] + '/v1.0/admin/all_instances';

            CloudService.getCloudList(url)
                .then(function(response) {
                    $scope.vms = response.data;
                }, function(response) {
                    console.error('请求错误');
                });
        }
    ]);
