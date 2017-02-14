// 镜像界面 -- 控制器
angular.module('myApp')
    .controller('imageSummaryCtrl', ['$scope', 'ImageSummaryService',
        function($scope, ImageSummaryService) {
            $scope.$parent.loadScript('js/tools/tool.js');
            // 初始化
            $scope.itemPerPage = 4;
            $scope.currentPage = 1;
            $scope.sortType = 'name';
            $scope.sortReverse = false;

            ImageSummaryService.getImageSummary().then(function(response) {
                $scope.images = response.data;
            });
        }
    ])
