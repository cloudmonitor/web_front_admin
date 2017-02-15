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

        // 获取镜像列表
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
                    value.image_type = !!value.image_type ? '快照' : '镜像';
                });
                response.data = response.data.images;
                defered.resolve(response);
            }, function(response) {
                // 请求失败
                defered.reject(response);
            });

            return defered.promise;
        };

        // 更新镜像
        var updateImage = function(mirror, origin) {
            var data = [],
                defered = $q.defer();

            for (key in origin) {
                if (mirror[key].toString().length && origin[key] != mirror[key]) {
                    // 更新了相应条目
                    var obj = {
                        op: 'replace',
                        path: '/' + 　key,
                        value: mirror[key]
                    };
                    if (key == 'visibility') {
                        obj.value = obj.value ? 'public' : 'private';
                    }
                    data.push(obj);
                }
            }

            if (data.length) {
                var req = {
                    url: config['host'] + '/v1.0/admin/admin_update/image/' + mirror.image_id,
                    method: 'POST',
                    data: data,
                    params: {
                        token: localStorage.token
                    }
                };
                $http(req).then(function(response) {
                    // 请求成功
                    response.data.visibility = (response.data.visibility === 'private') ? 'False' : 'True';
                    response.data.status = (response.data.status === 'active') ? '可用' : '不可用';
                    response.data.protected = response.data.protected ? 'True' : 'False';
                    response.data.disk_format = response.data.disk_format.toUpperCase();
                    response.data.size = getReadableSize(response.data.size);
                    response.data.image_type = !!response.data.image_type ? '快照' : '镜像';
                    defered.resolve(response);
                }, function(response) {
                    // 请求失败
                    defered.reject(response);
                });
            } else {
                defered.reject(response);
            }

            return defered.promise;
        };

        // 创建镜像
        var createImage = function(mirror) {
            var defered = $q.defer(),
                req = {
                    url: config['host'] + '/v1.0/admin/admin_create_image',
                    data: mirror,
                    method: 'POST',
                    params: {
                        token: localStorage.token
                    },
                    // withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                    transformRequest: angular.identity
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

        // 删除镜像
        var deleteImage = function(ids) {
            var defered = $q.defer(),
                req = {
                    url: config['host'] + '/v1.0/admin/admin_delete/image',
                    method: 'POST',
                    data: { images_ids: ids },
                    params: {
                        token: localStorage.token
                    }
                };

            $http(req).then(function(response) {
                // 请求成功
                response.data = response.data.images;
                defered.resolve(response);
            }, function(response) {
                // 请求失败
                defered.reject(response);
            });

            return defered.promise;
        };

        return {
            getImageSummary: getImageSummary,
            updateImage: updateImage,
            createImage: createImage,
            deleteImage: deleteImage
        };
    }]);
