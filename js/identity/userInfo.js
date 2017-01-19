var userCtrl = angular.module('userCtrl', []);
userCtrl.controller('userInfoController', function($scope, $http, $route) {
    $scope.$parent.loadScript('js/lib/echarts.min.js');
    $scope.$parent.loadScript('js/config.js');
    $scope.$parent.loadScript('js/tools/tool.js');
    $scope.refresh = function() {
        $route.reload();
    }
    $("head title").text("用户");
    $scope.item_count = 0; //项目总条目数量
    $scope.simplePageCount = 0; //每页实际条目数
    $scope.sortReverse_name = false;
    $scope.sortReverse_proId = false;
    $scope.sortReverse_desc = false;
    $scope.sortReverse_enabled = false;
    $scope.allData = null; //所有待显示的条目数据
    $scope.allDataTemp = null;
    $scope.qiandaoInfos = []; //每页的显示的条目数据
    $scope.singlePageNum = 6; //每页显示的条目数量
    $scope.AllPageNum = 0; //总页数
    $scope.pageNumArray = []; //每页的条目
    $scope.curr_page = 1; //当前页码
    $scope.pageBarShow = false;
    $scope.projectName = '';
    $scope.projectDesc = '';
    $scope.updataOrCreate = true;
    $scope.tenant_id = 0;
    $scope.userName = '';
    $scope.userEmail = '';
    $scope.userPassword = '';
    $scope.userPasswordAgain = '';
    $scope.projects = [];
    $scope.userId = "";
    $scope.updatePassword = true;
    $scope.disabledUser = true;
    //确定是更新还是创建
    $scope.getProject = function() {
        $.ajax({
            type: "GET",
            url: config.host + "/v1.0/admin/tenants?token=" + window.localStorage.token,
            success: function(data) {
                var tenantsData = JSON.parse(data).tenants;
                // console.log(data);
                $scope.projects = tenantsData;
            },
            error: function(data) {
                createAndHideAlert({
                    "message": "项目获取失败！",
                    "className": "alert-danger"
                });
            }
        });
    }();
    $scope.setFlag = function() {
        $scope.updataOrCreate = true;
        $scope.updatePassword = true;
    };
    $scope.disabledUser = function(info) {
        // console.log(">>", info);
        var user = {
            "user": {
                "enabled": !info.enabled
            }
        };
        var login = function() {
            var url = "/v1.0/admin/update/user/" + info.id;
            var req = {
                method: 'POST',
                url: config["host"] + url + "?token=" + window.localStorage.token,
                ContentType: "application/json",
                data: JSON.stringify(user)
            };
            $http(req).then(
                function(response) {
                    // 请求成功
                    var data = response.data;
                    console.info("返回的数据: ", data);
                    createAndHideAlert({
                        "message": "用户禁用成功！",
                        "className": "alert-success"
                    });
                    $scope.refresh();
                },
                function(response) {
                    // 请求失败
                    var data = response.data;
                    createAndHideAlert({
                        "message": "用户禁用失败！",
                        "className": "alert-danger"
                    });
                });
        }();
    };
    $scope.cancelCreate = function() {
        $scope.userName = '';
        $scope.userEmail = '';
        $scope.userPassword = '';
        $scope.userPasswordAgain = '';
        $(".userNameCheck").removeClass("has-error");
        $(".userPasswordCheck").removeClass("has-error");
        $(".userPasswordAgainCheck").removeClass("has-error");
        $(".userNameCheckplaceholder").attr("placeholder", "");
        $(".userPasswordplaceholder").attr("placeholder", "");
        $(".userPasswordAgainplaceholder").attr("placeholder", "");
        $(".userNameCheckplaceholder").attr("disabled", false);
    };
    $scope.deleteProjects = function() {
        var projects = [];
        var i = 0;
        var tenant_ids = { "user_id": [] };
        $(".project_checks:checked").each(function() {
            tenant_ids.user_id[i++] = $(this).attr("id");
        });
        console.log(tenant_ids);
        $.ajax({
            type: "POST",
            data: JSON.stringify(tenant_ids),
            contentType: "application/json",
            url: config["host"] + "/v1.0/admin/delete/user_list?token=" + window.localStorage.token,
            success: function(data) {
                console.log(data);
                createAndHideAlert({
                    "message": "项目批量删除成功！",
                    "className": "alert-danger"
                });
                $scope.refresh();
            },
            error: function(data) {
                createAndHideAlert({
                    "message": "项目删除失败！",
                    "className": "alert-danger"
                });
            }
        });
    };
    $scope.deleteProject = function(id) {
        $.ajax({
            type: "GET",
            url: config["host"] + "/v1.0/admin/delete/user/" + id + "?token=" + window.localStorage.token,
            success: function(data) {
                createAndHideAlert({
                    "message": "删除用户成功！",
                    "className": "alert-danger"
                });
                $scope.refresh();
            },
            error: function(data) {
                createAndHideAlert({
                    "message": "删除用户失败！",
                    "className": "alert-danger"
                });
            }
        });
    };
    $scope.createProjectOK = function() {
        //是否是修改密码
        if ($scope.updatePassword) {
            //是否是创建
            if ($scope.updataOrCreate) {
                if ($scope.userName.trim().length == 0 || $scope.userPassword.trim().length == 0 || $scope.userPasswordAgain.trim().length == 0) {
                    if ($scope.userName.trim().length == 0) {
                        $(".userNameCheck").addClass("has-error");
                        $(".userNameCheckplaceholder").attr("placeholder", "必填");
                    }
                    if ($scope.userPassword.trim().length == 0) {
                        $(".userPasswordCheck").addClass("has-error");
                        $(".userPasswordplaceholder").attr("placeholder", "必填");
                    }
                    if ($scope.userPasswordAgain.trim().length == 0) {
                        $(".userPasswordAgainCheck").addClass("has-error");
                        $(".userPasswordAgainplaceholder").attr("placeholder", "必填");
                    }
                    return;
                }
                if ($scope.userPassword != $scope.userPasswordAgain) {
                    $(".userPasswordAgainCheck").addClass("has-error");
                    $(".userPasswordAgainplaceholder").val("");
                    $(".userPasswordAgainplaceholder").attr("placeholder", "两次密码不一致");
                    return;
                }
                var user = {
                    "user": {
                        "email": $scope.userEmail,
                        "password": $scope.userPassword,
                        "enabled": true,
                        "name": $scope.userName,
                        "tenantId": $(".projectSelect").val()
                    }
                };
            } else {
                //更新
                if ($scope.userName.trim().length == 0) {
                    $(".userNameCheck").addClass("has-error");
                    $(".userNameCheckplaceholder").attr("placeholder", "必填");
                    return;
                }
                var user = {
                    "user": {
                        "email": $scope.userEmail,
                        "name": $scope.userName,
                        "tenantId": $(".projectSelect").val()
                    }
                };
            }
        } else {
            if ($scope.userPassword != $scope.userPasswordAgain) {
                $(".userPasswordAgainCheck").addClass("has-error");
                $(".userPasswordAgainplaceholder").val("");
                $(".userPasswordAgainplaceholder").attr("placeholder", "两次密码不一致");
                return;
            }
            var user = {
                "user": {
                    "password": $scope.userPassword
                }
            };
        }

        $('#createProject').modal('hide');
        $('.modal-backdrop').removeClass("modal-backdrop");

        $scope.cancelCreate();
        var userEdite = function() {
            if ($scope.updatePassword)
                var url = $scope.updataOrCreate ? "/v1.0/admin/create/user" : "/v1.0/admin/update/user/" + $scope.userId;
            else
                var url = "/v1.0/admin/update/user/" + $scope.userId;
            var req = {
                method: 'POST',
                url: config["host"] + url + "?token=" + window.localStorage.token,
                ContentType: "application/json",
                data: JSON.stringify(user)
            };
            $http(req).then(
                function(response) {
                    // 请求成功
                    var data = response.data;
                    console.info("返回的数据: ", data);
                    createAndHideAlert({
                        "message": "操作成功！",
                        "className": "alert-success"
                    });
                    $scope.refresh();
                },
                function(response) {
                    // 请求失败
                    var data = response.data;
                    createAndHideAlert({
                        "message": "操作失败！",
                        "className": "alert-danger"
                    });
                });
        }();
    };
    //编辑密码
    $scope.editPassword = function(info) {
        $scope.updataOrCreate = true;
        $scope.updatePassword = false;
        $scope.userId = info.id;
        $scope.userName = info.name;
        $(".userNameCheckplaceholder").attr("disabled", true);
    };
    $scope.editUser = function(info) {
        $scope.updatePassword = true;
        $scope.userId = info.id;
        $scope.updataOrCreate = false;
        $scope.userName = info.name;
        if (info.email != undefined)
            $scope.userEmail = info.email;
        else
            $scope.userEmail = "";
        $(".projectSelect").val(info.tenantId);
        // for (var i = 0; i < $scope.projects.length; i++) {
        //     var arr = $scope.projects[i];
        //     if (arr.id == info.tenantId) {
        //         $scope.projects.splice(0, 0, arr);
        //         $scope.projects.splice(i, 1);
        //     }
        // }
        // console.log($scope.projects);
    };
    // 获取项目列表
    var getProjectsList = function() {
        var url = config.host + "/v1.0/admin/users?token=" + window.localStorage.token;
        $http.get(url).then(function(response) {
            // console.log(response.data.users);
            var tenantsData = response.data.users;
            // console.log(tenantsData);
            $scope.allData = tenantsData;
            $scope.allDataTemp = tenantsData;
            var firstPageLen = tenantsData.length > $scope.singlePageNum ? $scope.singlePageNum : tenantsData.length;
            for (var i = 0; i < firstPageLen; i++) {
                $scope.qiandaoInfos[i] = tenantsData[i];
            }
            $scope.simplePageCount = firstPageLen;
            $scope.item_count = tenantsData.length;
            var temp_page = Math.floor($scope.item_count / $scope.singlePageNum);
            $scope.AllPageNum = temp_page * $scope.singlePageNum == $scope.item_count ? temp_page : temp_page + 1;
            if ($scope.AllPageNum > 1) {
                $scope.pageBarShow = true;
                for (var i = 1; i <= $scope.AllPageNum; i++) {
                    $scope.pageNumArray[i - 1] = i;
                }
            }
        }, function(response) {
            // 请求失败
            createAndHideAlert({
                "message": "项目列表请求失败",
                "className": "alert-danger"
            });
        });
    }();

    $scope.changePage = function(pagenum) {
        setColor(pagenum);
        var start = (pagenum - 1) * $scope.singlePageNum;
        var All = pagenum * $scope.singlePageNum;
        var qiandaoInfosTemp = [];
        var len = All >= $scope.item_count ? $scope.item_count : All;
        for (var i = start; i < len; i++) {
            qiandaoInfosTemp[i - start] = $scope.allData[i];
        }
        $scope.qiandaoInfos = qiandaoInfosTemp;
        $scope.simplePageCount = len - start;
        $scope.curr_page = pagenum;
    };
    $scope.nextPage = function(curr_page, flag) {
            // console.log(curr_page, flag);
            if ((curr_page != $scope.AllPageNum && flag == "+") || (curr_page != 1 && flag == "-")) {
                var start = flag == "+" ? curr_page * $scope.singlePageNum : (curr_page - 2) * $scope.singlePageNum;
                var All = flag == "+" ? (curr_page + 1) * $scope.singlePageNum : (curr_page - 1) * $scope.singlePageNum;
                // console.log(start, All)
                var qiandaoInfosTemp = [];
                var len = All >= $scope.item_count ? $scope.item_count : All;
                for (var i = start; i < len; i++) {
                    qiandaoInfosTemp[i - start] = $scope.allData[i];
                }
                $scope.qiandaoInfos = qiandaoInfosTemp;
                $scope.simplePageCount = len - start;
                $scope.curr_page = flag == "+" ? ++curr_page : --curr_page;
                setColor($scope.curr_page);
            }
        }
        //--------------------------------控制变量声明end
        //----------------选择控制start
    $(document).on("change", ".all_check", function() {
        if ($scope.item_count != 0) {
            var isChecked = $(this).prop("checked");
            $(".project_checks").prop("checked", isChecked);
            if (isChecked) {
                $(".deleteProject").attr("disabled", false);
            } else {
                $(".deleteProject").attr("disabled", true);
            }
        }
    });
    $(document).on("change", ".project_checks", function() {
        if ($(".project_checks:checked").length == $(".project_checks").length) {
            $(".deleteProject").attr("disabled", false);
            $(".all_check").prop("checked", true);
        } else if ($(".project_checks:checked").length > 0) {
            $(".deleteProject").attr("disabled", false);
            $(".all_check").prop("checked", false);
        } else {
            $(".deleteProject").attr("disabled", true);
            $(".all_check").prop("checked", false);
        }
    });
    //----------------选择控制end
    $(".searchProjects").on("keyup", function() {
        var textValue = $(this).val();
        var allDatas = $scope.allDataTemp;
        var tempData = null;
        $scope.qiandaoInfos = [];
        $scope.pageNumArray = [];
        var tempArray = [];
        var tempNum = 0;
        //console.log(textValue + "------------------>start");
        for (var i = 0; i < allDatas.length; i++) {
            tempData = allDatas[i];
            if (JSON.stringify(tempData).match(textValue) != null) {
                //console.log(JSON.stringify(tempData));
                tempArray[tempNum++] = tempData;
            }
        }
        //console.log("tempArray ------------------>start")
        $scope.item_count = tempArray.length;
        if (tempArray.length > 0 && tempArray.length <= $scope.singlePageNum) {
            //console.log("单页：" + $scope.qiandaoInfos)
            $scope.qiandaoInfos = tempArray;
            $scope.simplePageCount = tempArray.length;
            $scope.pageBarShow = false;
        } else if (tempArray.length > $scope.singlePageNum) {
            $scope.allData = tempArray;
            $scope.simplePageCount = $scope.singlePageNum;
            $scope.pageBarShow = true;
            var pageBarlen = Math.ceil(tempArray.length / $scope.singlePageNum);
            for (var i = 0; i < $scope.singlePageNum; i++) {
                $scope.qiandaoInfos[i] = tempArray[i];
            }
            $scope.AllPageNum = pageBarlen;
            // console.log(">>", pageBarlen)
            for (var i = 1; i <= pageBarlen; i++) {
                $scope.pageNumArray[i - 1] = i;
            }
            $scope.curr_page = 1;
        } else {
            $scope.simplePageCount = 0;
            $scope.pageBarShow = false;
            $(".deleteProject").attr("disabled", true);
        }
    });
});
