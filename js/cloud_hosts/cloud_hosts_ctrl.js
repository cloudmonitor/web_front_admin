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

            // 显示云主机名称
            $scope.dispName = function(name, id) {
                $scope.cloudHost = {
                    name: name,
                    id: id
                };
            };

            // 创建快照
            $scope.createSnapshot = function(name) {
                console.log('快照名称:', name);
                snapshot = {
                    name: name,
                    id: $scope.cloudHost.id
                };

                CloudService.creatSnapshot(snapshot).then(function(response) {
                    // 请求成功
                    if (response.data === '202') {
                        createAndHideAlert({
                            message: '快照创建成功',
                            className: 'alert-success'
                        });
                    } else {
                        createAndHideAlert({
                            message: '快照创建失败',
                            className: 'alert-danger'
                        });
                    }
                }, function(response) {
                    // 请求失败
                    createAndHideAlert({
                        message: '快照创建失败',
                        className: 'alert-danger'
                    });
                });
                $('#snapshotModal').modal('hide');
            };

            // 虚拟控制台
            $scope.virtualConsole = function(id) {
                CloudService.virtualConsole(id).then(function(response) {
                    // 请求成功
                    // 在新窗口打开虚拟控制台界面
                    window.open(response.data);
                })
            };

            // 软重启或硬重启
            $scope.reboot = function(type) {
                CloudService.reboot(type, $scope.cloudHost.id).then(function(response) {
                    if (response.data == '202') {
                        type = (type.toLowerCase() == 'soft') ? '软' : '硬';
                        createAndHideAlert({
                            message: type + '重启成功',
                            className: 'alert-success'
                        });
                    }
                });
                $('#softRebootModal').modal('hide');
                $('#hardRebootModal').modal('hide');
            };

            // 删除实例
            $scope.deleteInstance = function(id) {
                CloudService.deleteInstance(new Array(id)).then(function(response) {
                    // 请求成功
                    if (response.data[id] == '204') {
                        createAndHideAlert({
                            message: $scope.cloudHost.name + '删除成功',
                            className: 'alert-success'
                        });
                    }
                });
                $('#deleteModal').modal('hide');
            };
        }
    ]);
