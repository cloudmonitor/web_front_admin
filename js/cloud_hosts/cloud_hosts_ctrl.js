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
            $scope.$parent.loadScript('js/tools/tool.js');
            // 初始化
            $scope.itemPerPage = 4;
            $scope.currentPage = 1;
            $scope.sortType = 'name';
            $scope.sortReverse = false;

            var url = config['host'] + '/v1.0/admin/all_instances';
            
            // 获取云主机列表
            CloudService.getCloudList(url)
                .then(function(response) {
                    console.log('请求结果: ', response.data);
                    $scope.vms = response.data;
                }, function(response) {
                    console.error('请求错误');
                });

            // 编辑云主机
            $scope.editCloudHost = function(index) {
                $scope.tenant = {
                    name: $scope.vms[index].tenantName,
                    index: index
                }
            };

            // 提交更改
            $scope.saveChange = function(tenant) {
                if (tenant.name !== $scope.vms[tenant.index].tenantName) {
                    console.log('名称已改变');
                }
                $('#editHostModal').modal('hide');
            };
        }
    ]);
