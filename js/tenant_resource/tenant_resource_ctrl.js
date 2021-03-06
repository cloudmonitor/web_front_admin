// 租户资源 -- 控制器
angular.module('myApp')
    .controller('TenantResourceCtrl', ['$routeParams', '$scope', '$http', 'TenantService',
        function($routeParams, $scope, $http, TenantService) {
            $scope.$parent.loadScript('js/tools/tool.js');
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
                    // 跳转自云主机界面
                    if (!!$routeParams.tenantId) {
                        $scope.selected = $routeParams.tenantId;
                    } else {
                        $scope.selected = response.data[0].id;
                    }
                    getTabIndexContent();
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
                $scope.sortType = 'name';
                $scope.sortReverse = false;
                $scope.vms = [];
                // 网络
                $scope.sortNetType = 'name';
                $scope.sorNetReverse = false;
                $scope.networks = [];
                // 路由
                $scope.sortRouteType = 'name';
                $scope.sortRouteReverse = false;
                $scope.routers = [];
            };

            // 获取某分页的内容
            var getTabIndexContent = function() {
                if (tabLoaded[INDEX] || $scope.selected == 'Null') {
                    // 如果该分页内容已经加载
                    return;
                }

                switch (INDEX) {
                    case 0:
                        // 获取特定租户的资源使用概览
                        var url = config['host'] + '/v1.0/admin/tenant/usage_abstract/' + $scope.selected;
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
                        var url = config['host'] + '/v1.0/admin/tenant/instances/' + $scope.selected;
                        TenantService.getCloudList(url)
                            .then(function(response) {
                                $scope.vms = response.data;
                                tabLoaded[INDEX] = true;
                            });
                        break;
                    case 2:
                        // 加载特定租户的网络信息
                        var url = config['host'] + '/v1.0/admin/tenant/networks/' + $scope.selected;
                        TenantService.getNetInfo(url)
                            .then(function(response) {
                                $scope.networks = response.data;
                            });
                        break;
                    case 3:
                        // 加载特定用户的路由器
                        var url = config['host'] + '/v1.0/admin/tenant/routers/' + $scope.selected;
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
