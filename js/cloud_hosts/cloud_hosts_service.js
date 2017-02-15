// 获取云主机列表 -- 服务
angular.module('myApp')
    .factory('CloudService', ['$http', '$q',
        function($http, $q) {
            // 计算从date日期到当前的持续时间
            var getLastTime = function(date) {
                var now = Date.now(),
                    last = new Date(date),
                    diff = Math.round((now - last) / 1000);
                // 秒，分，时，天，周，月，年
                if (diff > 0 && diff < 60) {
                    return diff + '秒';
                } else if (diff >= 60 && diff < 3600) {
                    var minutes = parseInt(diff / 60),
                        seconds = diff % 60;
                    return minutes + '分' + seconds + '秒';
                } else if (diff >= 3600 && diff < 3600 * 24) {
                    var hours = parseInt(diff / 3600),
                        minutes = parseInt((diff % 3600) / 60),
                        seconds = diff % 60;
                    return hours + '时' + minutes + '分';
                } else if (diff >= 3600 * 24 && diff < 3600 * 24 * 7) {
                    var days = parseInt(diff / (3600 * 24)),
                        hours = parseInt((diff % (3600 * 24)) / 3600);
                    return days + '天' + hours + '时';
                } else {
                    var weeks = parseInt(diff / (7 * 24 * 3600)),
                        days = parseInt((diff % (7 * 24 * 3600)) / (24 * 3600));
                    return weeks + '周' + days + '天';
                }
            };

            // 请求云主机列表
            var getList = function(url) {
                var defered = $q.defer(),
                    req = {
                        method: 'GET',
                        url: url,
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    var data = response.data.servers,
                        len = data.length,
                        result = [];

                    for (var i = 0; i < len; i++) {
                        var vm = {
                            id: data[i].id,
                            name: data[i].name,
                            hypervisorHostname: data[i]['OS-EXT-SRV-ATTR:hypervisor_hostname'],
                            tenantName: data[i].tenant_name,
                            tenantId: data[i].tenant_id,
                            ipAddr: [],
                            image: data[i].image.image_name,
                            configure: data[i].flavor.flavor_name,
                            availableScope: data[i]['OS-EXT-AZ:availability_zone'],
                            status: (data[i].status == 'SHUTOFF') ? '关机' : '运行',
                            lastTime: getLastTime(data[i].created)
                        };

                        // 提取ip地址(fixed and floating ip address)
                        for (variable in data[i].addresses) {
                            var ip = {
                                name: variable,
                                fixedIP: ' - ',
                                floatingIP: ' - '
                            };

                            var ipLen = data[i].addresses[variable].length;

                            for (var j = 0; j < ipLen; j++) {
                                type = data[i].addresses[variable][j]['OS-EXT-IPS:type'];

                                if (type == 'fixed') {
                                    ip.fixedIP = data[i].addresses[variable][j]['addr'];
                                } else if (type == 'floating') {
                                    ip.floatingIP = data[i].addresses[variable][j]['addr'];
                                }
                            }

                            vm.ipAddr.push(ip);
                        }
                        result.push(vm);
                    }

                    response.data = result
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    console.error('请求失败');
                    defered.reject(response);
                });

                return defered.promise;
            };

            // 创建快照
            var creatSnapshot = function(cloudHost) {
                var defered = $q.defer(),
                    req = {
                        method: 'POST',
                        url: config['host'] + '/v1.0/admin/create_image/' + cloudHost.id,
                        data: {
                            createImage: {
                                name: cloudHost.name
                            }
                        },
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });

                return defered.promise;
            };

            // 获取虚拟控制台url
            var virtualConsole = function(id) {
                var defered = $q.defer(),
                    req = {
                        method: 'POST',
                        url: config['host'] + '/v1.0/admin/get_vnc/' + id,
                        data: {
                            'os-getVNCConsole': {
                                type: 'novnc'
                            }
                        },
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    response.data = response.data.console.url.replace('controller', location.hostname);
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });

                return defered.promise;
            };

            // 软重启或硬重启
            var reboot = function(type, id) {
                var defered = $q.defer(),
                    req = {
                        method: 'POST',
                        url: config['host'] + '/v1.0/admin/admin_reboot/' + id,
                        data: {
                            reboot: {
                                type: type.toUpperCase()
                            }
                        },
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });

                return defered.promise;
            };

            // 终止实例
            var deleteInstance = function(ids) {
                // ids 是一个数组
                var defered = $q.defer(),
                    req = {
                        method: 'POST',
                        url: config['host'] + '/v1.0/admin/admin_delete',
                        data: {
                            servers_ids: ids
                        },
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });

                return defered.promise;
            };

            return {
                getCloudList: getList,
                creatSnapshot: creatSnapshot,
                virtualConsole: virtualConsole,
                reboot: reboot,
                deleteInstance: deleteInstance
            };
        }
    ]);
