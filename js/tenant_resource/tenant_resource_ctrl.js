// 租户资源 -- 控制器
angular.module('myApp')
    .controller('TenantResourceCtrl', ['$scope', '$http', 'TenantService',
        function($scope, $http, TenantService) {
            // 获取租户列表
            var url = config['host'] + '/v1.0/admin/tenants',
                currentTab = '资源使用概览';
            TenantService.getTenantList(url)
                .then(function(response) {
                    $scope.tenants = response.data;
                }, function(response) {
                    // 请求失败
                    console.error('请求失败', response.data);
                });

            TenantService.drawEchartPie([]);

            $scope.getSelectTenant = function(tenantID) {
                
            };
            // 获取特定租户的资源信息
            // var url = config['host'] + '/v1.0/admin/tenant/usage_abstract/' + tenantID;
            // TenantService.getResourceSummary(url)
            //     .then(function(response) {
            //         $scope.resource = response.data;
            //     }, function(response) {
            //         // 请求失败
            //         console.error('请求失败', response.data);
            //     });

            $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                // 获取已激活的标签页的名称
                var activeTab = $(e.target).text();
                // 获取前一个激活的标签页的名称
                var previousTab = $(e.relatedTarget).text();

            });

            $scope.getTenant = function(tenantID) {
                console.info('id', tenantID);
            };
        }
    ]);
