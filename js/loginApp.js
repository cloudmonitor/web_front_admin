// 新建module应用
var formApp = angular.module('formApp', ['ngMessages']);

// 新建controller
formApp.controller('formValidCtrl', formValidCtrl);

function formValidCtrl($scope, $http) {
    // 初始化
    $scope.submitted = false;
    $scope.submitForm = function() {
        $scope.submitted = true;

        if ($scope.form.$invalid) return;
        var username = $scope.userName;
        var password = $scope.passWord;
        // 登陆请求
        var login = function() {
            var url = config["host"] + "/v1.0/admin/login";
            var req = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': "application/json",
                },
                data: JSON.stringify({ "username": username, "password": password })
            };
            $http(req).then(
                function(response) {
                    // 请求成功
                    var data = response.data;
                    console.info("返回的数据: ", data);
                    if (data.error) {
                        // 验证失败
                        createAndHideAlert({
                            "message": "您的用户名或密码不正确",
                            "className": "alert-danger"
                        });
                        return;
                    }
                    // 验证通过
                    window.localStorage.token = JSON.stringify(data.access.token);
                    window.localStorage.user = JSON.stringify(data.access.user);
                    window.localStorage.password = password;
                    window.location.href = window.location.href.replace("login.html", "");
                },
                function(response) {
                    // 请求失败
                    var data = response.data;
                    console.error("请求失败:", data);

                });
        }();
    };
}
