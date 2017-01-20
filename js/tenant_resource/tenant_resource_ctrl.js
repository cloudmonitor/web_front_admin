// 租户资源 -- 控制器
angular.module('myApp')
    .controller('TenantResourceCtrl', ['$scope', '$http', 'TenantService',
        function($scope, $http, TenantService) {
            // 获取租户列表
            var url = config['host'] + '/v1.0/admin/tenants',
                tabLoaded = [false, false, false, false],
                currentIndex = {
                    '资源使用概览': 0,
                    '云主机': 1,
                    '网络': 2,
                    '路由器': 3
                },
                INDEX = 0;

            $scope.itemPerPage = 4;
            $scope.currentPage = 1;

            TenantService.getTenantList(url)
                .then(function(response) {
                    $scope.tenants = response.data;
                }, function(response) {
                    // 请求失败
                    console.error('请求失败', response.data);
                });

            TenantService.drawEchartPie([]);

            // 清空分页内容
            var initTabContent = function() {
                tabLoaded = [false, false, false, false];
                // 租户资源
                $scope.resource = [];
                // 云主机
                $scope.vms = [];
                // 网络
                $scope.networks = [];
                // 路由
                $scope.routers = [];
            };

            // 获取某分页的内容
            var getTabIndexContent = function() {
                if (tabLoaded[INDEX] || $scope.tenant.id == 'Null') {
                    // 如果该分页内容已经加载
                    return;
                }

                switch (INDEX) {
                    case 0:
                        // 获取特定租户的资源使用概览
                        var url = config['host'] + '/v1.0/admin/tenant/usage_abstract/' + $scope.tenant.id;
                        TenantService.getResourceSummary(url)
                            .then(function(response) {
                                $scope.resource = response.data;
                                tabLoaded[INDEX] = true;
                            }, function(response) {
                                TenantService.drawEchartPie([]);
                            });
                        break;
                    case 1:
                        // 加载特定用户云主机列表
                        var url = config['host'] + '/v1.0/admin/tenant/instances/' + $scope.tenant.id;
                        TenantService.getCloudList(url)
                            .then(function(response) {
                                $scope.vms = response.data;
                                tabLoaded[INDEX] = true;
                            });
                        break;
                    case 2:
                        // 加载特定租户的网络信息
                        var url = config['host'] + '/v1.0/admin/tenant/networks/' + $scope.tenant.id;
                        TenantService.getNetInfo(url)
                            .then(function(response) {
                                $scope.networks = response.data;
                            });
                        break;
                    case 3:
                        // 加载特定用户的路由器
                        var url = config['host'] + '/v1.0/admin/tenant/routers/' + $scope.tenant.id;
                        TenantService.getRoutes(url)
                            .then(function(response) {
                                $scope.routes = response.data;
                            })
                        break;
                    default:
                        // statements_def
                        break;
                }
            };


            // 选择特定租户
            $scope.getSelectTenant = function(tenantID) {
                initTabContent();
                if (tenantID == 'Null') {
                    return;
                }
                getTabIndexContent();
            };


            $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                // 获取已激活的标签页的名称
                var activeTab = $(e.target).text();

                INDEX = currentIndex[activeTab];
                getTabIndexContent();
            });

        }
    ]);
