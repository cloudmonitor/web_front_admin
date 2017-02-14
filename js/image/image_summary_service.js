angular.module('myApp')
    .factory('ImageSummaryService', ['$http', '$q', function($http, $q) {
        var getReadableSize = function(size) {
            // size 单位 B
            if (size < 1024) {
                size = size + ' B'
            } else if (size / 1024 < 1024) {
                size = (size / 1024).toFixed(1) + ' KB';
            } else if (size / 1024 >= 1024 && size / 1024 < 1024 * 1024) {
                size = (size / (1024 * 1024)).toFixed(1) + ' MB';
            } else {
                size = (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
            }
            return size;
        };

        var getImageSummary = function() {
            var defered = $q.defer(),
                req = {
                    url: config['host'] + '/v1.0/admin/images',
                    method: 'GET',
                    params: {
                        token: localStorage.token
                    }
                };

            $http(req).then(function(response) {
                // 请求成功
                angular.forEach(response.data.images, function(value, key) {
                    value.visibility = (value.visibility === 'private') ? 'False' : 'True';
                    value.status = (value.status === 'active') ? '可用' : '不可用';
                    value.protected = value.protected ? 'True' : 'False';
                    value.disk_format = value.disk_format.toUpperCase();
                    value.size = getReadableSize(value.size);
                    value.image_type = !!value.image_type ? '快照': '镜像';
                });
                response.data = response.data.images;
                defered.resolve(response);
            }, function(response) {
                // 请求失败
                defered.reject(response);
            });

            return defered.promise;
        };

        return {
            getImageSummary: getImageSummary
        };
    }]);
