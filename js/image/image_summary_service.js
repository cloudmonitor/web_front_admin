angular.module('myApp')
    .factory('ImageSummaryService', ['$http', '$q', 'Upload', function($http, $q, Upload) {
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

        // 将返回的数据, 进行转化, 方便前台展示
        var tranferFormat = function(data) {
            data.visibility = (data.visibility === 'private') ? 'False' : 'True';
            data.status = (data.status === 'active') ? '可用' : '不可用';
            data.protected = data.protected ? 'True' : 'False';
            data.disk_format = data.disk_format.toUpperCase();
            data.size = getReadableSize(data.size);
            data.image_type = !!data.image_type ? '快照' : '镜像';

            return data;
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
                    tranferFormat(value);
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
                    tranferFormat(response.data);
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
                upload = Upload.upload({
                    url: config['host'] + '/v1.0/admin/admin_create_image',
                    data: mirror,
                    params: {
                        token: localStorage.token
                    }
                });

            upload.then(function(response) {
                // 请求成功
                tranferFormat(response.data);
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
