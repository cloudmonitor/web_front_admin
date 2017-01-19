var projectsCtrl = angular.module('projectsCtrl', []);
projectsCtrl.controller('projectsController', function($scope, $http, $route) {
    $scope.$parent.loadScript('js/lib/echarts.min.js');
    $scope.$parent.loadScript('js/config.js');
    // $scope.$parent.loadScript('js/index.js');
    $scope.$parent.loadScript('js/tools/tool.js');
    $scope.refresh = function() {
        $route.reload();
    }
    $("head title").text("项目");
    $scope.item_count = 0; //项目总条目数量
    $scope.simplePageCount = 0; //每页实际条目数
    $scope.sortReverse_name = false;
    $scope.sortReverse_proId = false;
    $scope.sortReverse_desc = false;
    $scope.sortReverse_enabled = false;
    $scope.allData = null; //所有待显示的条目数据
    $scope.allDataTemp = null;
    $scope.qiandaoInfos = []; //每页的显示的条目数据
    $scope.singlePageNum = 3; //每页显示的条目数量
    $scope.AllPageNum = 0; //总页数
    $scope.pageNumArray = []; //每页的条目
    $scope.curr_page = 1; //当前页码
    $scope.pageBarShow = false;
    $scope.projectName = '';
    $scope.projectDesc = '';
    $scope.projectCreateStatus = false;
    $scope.updataOrCreate = false;
    $scope.tenant_id = 0;
    $scope.roles = [];
    $scope.users = [];
    $scope.selectedUsers = [];
    $scope.createPro_ManageInfo = true; //打开创建还是修改项目成员或配额
    $scope.manageMem_Profile = true; //修改项目成员还是配额
    //--------------------------------控制变量声明end
    $scope.getUsers = function() {
        $.ajax({
            type: "GET",
            url: config['host'] + "/v1.0/admin/users?token=" + window.localStorage.token,
            success: function(data) {
                var users = JSON.parse(data).users;
                $scope.users = users;
            },
            error: function() {
                createAndHideAlert({
                    "message": "用户获取失败！",
                    "className": "alert-danger"
                });
            }
        });
    }();
    $scope.getRoles = function() {
        $.ajax({
            type: "GET",
            url: config['host'] + "/v1.0/admin/roles?token=" + window.localStorage.token,
            success: function(data) {
                var roles = JSON.parse(data).roles;
                $scope.roles = roles;
            },
            error: function() {
                createAndHideAlert({
                    "message": "角色获取失败！",
                    "className": "alert-danger"
                });
            }
        });
    }();
    $scope.removeUser = function(id) {
        var selectedUsers = $scope.selectedUsers;
        for (var i = 0; i < selectedUsers.length; i++) {
            if (selectedUsers[i].id == id) {
                $scope.users.push(selectedUsers[i]);
                $scope.selectedUsers.splice(i, 1);
                return;
            }
        }

    };
    $scope.selectUser = function(id) {
        var freeUsers = $scope.users;
        for (var i = 0; i < freeUsers.length; i++) {
            if (freeUsers[i].id == id) {
                $scope.selectedUsers.push(freeUsers[i]);
                $scope.users.splice(i, 1);;
                return;
            }
        }
    };

    function setActive(elem, parentElem) {
        $("#proInfo").parent().removeClass("active");
        $("#proMember").parent().removeClass("active");
        $("#proQuota").parent().removeClass("active");
        $("#" + parentElem).parent().addClass("active");
        $("#home").removeClass("active");
        $("#member").removeClass("active");
        $("#profile").removeClass("active");
        $("#" + elem).addClass("active").removeClass("fade");
    }
    $scope.setFlag = function() {
        $scope.createPro_ManageInfo = true;
        $scope.updataOrCreate = false;
        $("#proInfo").show();
        $("#proMember").hide();
        $("#proQuota").hide();
        setActive("home", "proInfo");
    };
    $scope.manageMember = function() {
        $scope.manageMem_Profile = true;
        $scope.createPro_ManageInfo = false;
        $("#proInfo").hide();
        $("#proMember").show();
        $("#proQuota").hide();
        setActive("member", "proMember");
    };
    $scope.changeStatus = function() {
        $scope.projectCreateStatus = !$scope.projectCreateStatus;
    };
    $scope.cancelCreate = function() {
        $scope.projectName = '';
        $scope.projectDesc = '';
        $scope.projectCreateStatus = false;
        $(".projectName").removeClass("has-error");
        $(".projectNameplaceholder").attr("placeholder", "");
    };
    $scope.deleteProjects = function() {
        var projects = [];
        var i = 0;
        var tenant_ids = { "tenant_id": [] };
        $(".project_checks:checked").each(function() {
            tenant_ids.tenant_id[i++] = $(this).attr("id");
        });
        $.ajax({
            type: "POST",
            data: JSON.stringify(tenant_ids),
            contentType: "application/json",
            url: config["host"] + "/v1.0/admin/delete/tenant_list?token=" + window.localStorage.token,
            success: function(data) {
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
            url: config["host"] + "/v1.0/admin/delete/tenant/" + id + "?token=" + window.localStorage.token,
            success: function(data) {
                createAndHideAlert({
                    "message": "项目删除成功！",
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
    $scope.createProjectOK = function() {
        if ($scope.projectName.trim().length == 0) {
            $(".projectName").addClass("has-error");
            $(".projectNameplaceholder").attr("placeholder", "必填");
            return;
        }

        $('#createProject').modal('hide');
        $('.modal-backdrop').removeClass("modal-backdrop");
        var tenant = {
            "tenant": {
                "name": $scope.projectName,
                "description": $scope.projectDesc,
                "enabled": $scope.projectCreateStatus
            }
        }
        $scope.projectName = '';
        $scope.projectDesc = '';
        $scope.projectCreateStatus = false;
        $(".projectName").removeClass("has-error");
        $(".projectNameplaceholder").attr("placeholder", "");
        var login = function() {
            var url = $scope.updataOrCreate ? "/v1.0/admin/update/tenant/" + $scope.tenant_id : "/v1.0/admin/create/tenant";
            console.log(url);
            var req = {
                method: 'POST',
                url: config["host"] + url + "?token=" + window.localStorage.token,
                headers: {
                    'Content-Type': "application/json",
                },
                data: JSON.stringify(tenant)
            };
            $http(req).then(
                function(response) {
                    // 请求成功
                    var data = response.data;
                    console.info("返回的数据: ", data);
                    createAndHideAlert({
                        "message": "项目创建成功！",
                        "className": "alert-success"
                    });
                    $scope.refresh();
                },
                function(response) {
                    // 请求失败
                    var data = response.data;
                    console.error("创建失败", data.statusText);
                    createAndHideAlert({
                        "message": "项目创建失败！",
                        "className": "alert-danger"
                    });
                });
        }();
    };
    $scope.cancelUpdateMemProfile = function() {


    };
    $scope.updateMemProfileOK = function() {

    };
    //编辑项目
    $scope.editProject = function(id, name, desc, enabled) {
        $scope.createPro_ManageInfo = true;
        setActive("home", "proInfo");
        $scope.updataOrCreate = true;
        $scope.projectName = name;
        $scope.projectDesc = desc;
        $scope.projectCreateStatus = enabled;
        $scope.tenant_id = id;
    };
    //修改配额
    $scope.updateQuota = function() {
            $scope.manageMem_Profile = false;
            $scope.createPro_ManageInfo = false;
            setActive("profile", "proQuota");
            $.ajax({
                type: "POST",
                data: JSON.stringify(),
                contentType: "application/json",
                url: config["host"] + "?token=" + window.localStorage.token,
                success: function(data) {

                },
                error: function(data) {
                    createAndHideAlert({
                        "message": "修改配额失败！",
                        "className": "alert-danger"
                    });
                }
            });
        }
        // 获取项目列表
    var getProjectsList = function() {
        var url = config.host + "/v1.0/admin/tenants?token=" + window.localStorage.token;
        $http.get(url).then(function(response) {
            var tenantsData = response.data.tenants;
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
