// 镜像界面 -- 控制器
angular.module('myApp')
    .filter('imageFilter', function() {
        // 云主机过滤器
        return function(tableItems, search) {
            var result = [];

            if (!search) {
                return tableItems;
            }

            angular.forEach(tableItems, function(item, index) {
                if (item['name'].search(search) != -1) {
                    result.push(item)
                }
            });

            return result
        };
    })
    .controller('imageSummaryCtrl', ['$scope', 'ImageSummaryService',
        function($scope, ImageSummaryService) {
            $scope.$parent.loadScript('js/tools/tool.js');
            // 初始化
            $scope.itemPerPage = 4;
            $scope.currentPage = 1;
            $scope.sortType = 'name';
            $scope.sortReverse = false;
            $scope.formats = [{
                label: '请选择镜像格式',
                value: false
            }, {
                label: 'AKI - 亚马逊内核镜像',
                value: 'aki'
            }, {
                label: 'AMI - Amazon Machine 镜像',
                value: 'ami'
            }, {
                label: 'ARI - Amazon Ramdisk 镜像',
                value: 'ari'
            }, {
                label: 'ISO - 光盘镜像',
                value: 'iso'
            }, {
                label: 'OVA - 开源虚拟化应用',
                value: 'ova'
            }, {
                label: 'QCOW2 - QEMU 模拟器',
                value: 'qcow2'
            }, {
                label: 'RAW',
                value: 'raw'
            }, {
                label: 'VDI - 虚拟机磁盘镜像',
                value: 'vdi'
            }, {
                label: 'VHD - 虚拟硬盘',
                value: 'vhd'
            }, {
                label: 'VMDK - 虚拟机磁盘',
                value: 'vmdk'
            }];

            // 获取镜像列表
            ImageSummaryService.getImageSummary().then(function(response) {
                $scope.images = response.data;
            });

            // 寻找某镜像id在数组中的位置
            var whereIsImage = function(id) {
                for (var i = 0, len = $scope.images.length; i < len; i++) {
                    if (id == $scope.images[i].id) {
                        return i;
                    }
                };
            };

            // 填充编辑列表
            $scope.edit = function(image, index) {
                $scope.mirror = {
                    index: index,
                    image_id: image.id,
                    name: image.name,
                    min_disk: image.min_disk,
                    min_ram: image.min_ram,
                    protected: (image.protected == 'True') ? true : false,
                    visibility: (image.visibility == 'True') ? true : false
                };
                $scope.origin = {
                    name: image.name,
                    min_disk: image.min_disk,
                    min_ram: image.min_ram,
                    protected: (image.protected == 'True') ? true : false,
                    visibility: (image.visibility == 'True') ? true : false
                };
            };

            // 保存更改
            $scope.saveChange = function(mirror, origin) {
                ImageSummaryService.updateImage(mirror, origin).then(function(response) {
                    // 请求成功
                    // 更新数据
                    var whereIs = whereIsImage(mirror.image_id);
                    $scope.images[whereIs] = response.data;
                });

                $('#editImageModal').modal('hide');
            };

            // 创建镜像
            $scope.createImage = function(mirror) {
                mirror.container_format = 'bare';
                mirror.visibility = mirror.visibility ? 'public' : 'private';

                ImageSummaryService.createImage(mirror).then(function(response) {
                    // 请求成功
                    $scope.images.unshift(response.data);
                    createAndHideAlert({
                        message: '镜像创建成功',
                        className: 'alert-success'
                    });
                });

                $('#createImageModal').modal('hide');
            };

            // 删除镜像
            $scope.delete = function(image) {
                $scope.deleteImage = image;
            };

            // 确认删除
            $scope.deleteImageConfirm = function(image) {
                ImageSummaryService.deleteImage(new Array(image.id)).then(function(response) {
                    // 请求成功
                    createAndHideAlert({
                        message: '镜像删除成功',
                        className: 'alert-success'
                    });
                    var whereIs = $scope.images.indexOf(image);
                    $scope.images.splice(whereIs, 1);
                });

                $('#deleteImageModal').modal('hide');
            };
        }
    ])
