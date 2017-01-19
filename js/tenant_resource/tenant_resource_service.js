angular.module('myApp')
    .factory('TenantService', ['$http', '$q', 'CloudService',
        function($http, $q, CloudService) {
            // 获取租户列表
            var getTenantList = function(url) {
                var defered = $q.defer(),
                    req = {
                        url: url,
                        method: 'GET',
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    response.data = response.data.tenants;
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });

                return defered.promise;
            }

            // 绘制饼图
            var drawEchartPie = function(criticalData) {
                // 配置项
                var baseOption = {
                    title: {
                        text: '',
                        subtext: '使用率',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [{
                        name: '',
                        type: 'pie',
                        radius: '40%',
                        center: ['50%', '50%'],
                        data: [{
                            value: 0,
                            name: '已用'
                        }, {
                            value: 0,
                            name: '可用'
                        }],
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false,
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                var labelOption = {
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['已用', '可用']
                    },
                    series: [{
                        type: 'pie',
                        radius: '0',
                        center: ['0%', '0%'],
                        data: [{
                            value: 0,
                            name: '已用'
                        }, {
                            value: 0,
                            name: '可用'
                        }],
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }]
                };
                var categories = ['云主机', '虚拟内核', '内存', 'Floating IPs', '安全组'];

                categories.forEach(function(element, index, array) {
                    baseOption.title.text = element;
                    baseOption.series[0].name = element;
                    if (criticalData.length) {
                        baseOption.series[0].data[0].value = criticalData[index].used;
                        baseOption.series[0].data[1].value = criticalData[index].unused;
                    }
                    echarts.init(document.getElementById('main' + (index + 1))).setOption(baseOption);
                });

                echarts.init(document.getElementById('main6')).setOption(labelOption);
            };

            // 获取特定租户的资源使用信息
            var getResourceSummary = function(url) {
                var defered = $q.defer(),
                    req = {
                        url: url,
                        method: 'GET',
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    // 以下三个数组分别表示已用资源名字， 资源总数名字， 资源中文名字以及饼图中已用资源名称
                    // 相同下标处有相同的含义
                    var usedArray = ['floatingips_used', 'instance_num', 'networks_used', 'security_groups_rule_used',
                            'routers_used', 'memory_mb', 'vcpus', 'subnets_used', 'ports_used', 'security_groups_used'
                        ],
                        totalArray = ['floatingip', 'instances', 'network', 'security_group_rule', 'router', 'ram',
                            'cores', 'subnet', 'port', 'security_group'
                        ],
                        nameArray = ['浮动IP', '云主机', '网络', '安全组规则', '路由', '内存', '虚拟内核', '子网', '端口', '安全组'],
                        pieUsedArray = ['instance_num', 'vcpus', 'memory_mb', 'floatingips_used', 'security_groups_used'],
                        maxLength = (response.data.quotas.ram + '').length,
                        criticalData = [],
                        result = [];

                    usedArray.forEach(function(element, index, array) {
                        var index,
                            item = {
                                name: nameArray[index],
                                rate: parseInt((response.data[element] / response.data.quotas[totalArray[index]]) * 100) + '%',
                                used: response.data[element],
                                total: response.data.quotas[totalArray[index]],
                            };

                        index = pieUsedArray.indexOf(element);
                        if (index != -1) {
                            criticalData.push({
                                id: index,
                                used: item.used,
                                unused: item.total - item.used
                            })
                        }

                        result.push(item);
                    })

                    // 按id升序 排序
                    criticalData.sort(function(a, b) {
                        return a.id - b.id;
                    })

                    drawEchartPie(criticalData);
                    response.data = result;
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                })

                return defered.promise;
            }

            // 获取特定租户的网络信息
            var getNetInfo = function(url) {
                var defered = $q.defer(),
                    req = {
                        url: url,
                        method: 'GET',
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    var data = response.data.networks,
                        result = [];

                    data.forEach(function(element, index, array) {
                        var network = {
                            name: element.name,
                            status: (element.status == 'ACTIVE') ? '运行中' : '关闭',
                            subnet: [],
                            adminState: (element.admin_state_up) ? '上' : '下',
                        };

                        element.subnets.forEach(function(item) {
                            network.subnet.push({
                                name: item.name,
                                cidr: item.cidr
                            });
                        });
                        result.push(network);
                    });

                    response.data = result;
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });

                return defered.promise;
            };

            // 获取特定租户的路由
            var getRoutes = function(url) {
                var defered = $q.defer(),
                    req = {
                        url: url,
                        method: 'GET',
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    var data = response.data.routers,
                        result = [];

                    data.forEach(function(element, index, array) {
                        var network = {
                            name: element.name,
                            status: (element.status == 'ACTIVE') ? '运行中' : '关闭',
                            extName: '外部网络',
                            adminState: (element.admin_state_up) ? '上' : '下',
                        };
                        result.push(network);
                    });

                    response.data = result;
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });

                return defered.promise;
            };

            return {
                getTenantList: getTenantList,
                drawEchartPie: drawEchartPie,
                getResourceSummary: getResourceSummary,
                getCloudList: CloudService.getCloudList,
                getNetInfo: getNetInfo,
                getRoutes: getRoutes
            };
        }
    ]);
