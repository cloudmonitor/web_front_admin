angular.module('myApp')
    .factory('PhysicalHostsService', ['$http', '$q',
        function($http, $q) {
            var getResourceSummary = function() {
                var defered = $q.defer(),
                    req = {
                        url: config['host'] + '/v1.0/admin/hypervisor',
                        method: 'GET',
                        params: {
                            token: localStorage.token
                        }
                    };

                $http(req).then(function(response) {
                    // 请求成功
                    response.data = response.data.hypervisors;
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });

                return defered.promise;
            };

            return {
            	getResourceSummary: getResourceSummary
            };
        }
    ])
