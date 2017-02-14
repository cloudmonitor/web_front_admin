var projectsCtrl = angular.module('projectsCtrl', []);
projectsCtrl.controller('projectsController', function($scope, $http, $route) {
    $scope.$parent.loadScript('js/lib/echarts.min.js');
    $scope.$parent.loadScript('js/config.js');
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
    $scope.singlePageNum = 6; //每页显示的条目数量
    $scope.AllPageNum = 0; //总页数
    $scope.pageNumArray = []; //每页的条目
    $scope.curr_page = 1; //当前页码
    $scope.pageBarShow = false;
    $scope.projectName = '';
    $scope.projectDesc = '';
    $scope.projectCreateStatus = true;
    $scope.updataOrCreate = false;
    $scope.tenant_id = 0;
    $scope.roles = [];
    $scope.users = [];
    $scope.usersAll = [];
    $scope.selectedUsers = [];
    $scope.originUsers = [];
    $scope.createPro_ManageInfo = true; //打开创建还是修改项目成员或配额
    $scope.manageMem_Profile = true; //修改项目成员还是配额
    $scope.updataFlag = "";
    $scope.pro_metadata_items = "";
    //--------------------------------控制变量声明end
    $scope.getUsers = function() {
        $.ajax({
            type: "GET",
            url: config['host'] + "/v1.0/admin/users?token=" + window.localStorage.token,
            success: function(data) {
                var users = JSON.parse(data).users;
                $scope.users = users;
                $scope.usersAll = users.concat();
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
        $scope.projectCreateStatus = true;
        $scope.createPro_ManageInfo = true;
        $scope.updataOrCreate = false;
        $("#proInfo").show();
        $("#proMember").hide();
        $("#proQuota").hide();
        setActive("home", "proInfo");
    };
    $scope.manageMember = function(tenant_id) {
        //console.log(">>>>>>>>: ",$scope.usersAll);
        $scope.users = $scope.usersAll.concat();
        $scope.tenant_id = tenant_id;
        $scope.manageMem_Profile = true;
        $scope.createPro_ManageInfo = false;
        $("#proInfo").hide();
        $("#proMember").show();
        $("#proQuota").hide();
        setActive("member", "proMember");
        $scope.updataFlag = 'member';
        var url = config["host"] + "/v1.0/admin/tenants/" + tenant_id + "/users?token=" + window.localStorage.token;
        $http.get(url).then(function(response) {
            // console.log(response.data);
            $scope.selectedUsers = response.data.users;
            $scope.originUsers = response.data.users.concat();
            console.log("...", $scope.originUsers);
            var data = $scope.selectedUsers;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < $scope.users.length; j++) {
                    if (data[i].name == $scope.users[j].name)
                        $scope.users.splice(j, 1);
                }
            }
        });
    };
    $scope.manageMemberOK = function() {
        var users = $scope.selectedUsers;
        var newUsers = [];
        var deleteUsers = [];
        //console.log(users, "...........", $scope.originUsers)
        //获得新加的用户
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            var flag = 0;
            for (var j = 0; j < $scope.originUsers.length; j++) {
                if ($scope.originUsers[j].id == user.id)
                    break;
                else if ($scope.originUsers[j].id != user.id && j == $scope.originUsers.length - 1) {
                    newUsers.push(user);
                }
            }
        }
        console.log("newUsers: ", newUsers);
        updateMem(newUsers, "add");
        var oldUser = $scope.users;
        // console.log(oldUser, ".....", $scope.originUsers);
        //删除移除的用户
        for (var i = 0; i < oldUser.length; i++) {
            var user = oldUser[i];
            for (var j = 0; j < $scope.originUsers.length; j++) {
                if ($scope.originUsers[j].id == user.id) {
                    deleteUsers.push(user);
                }
            }
        }
        console.log("deleteUsers: ", deleteUsers);
        updateMem(deleteUsers, "delete");

    };

    function updateMem(users, flag) {
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            var url;
            var method;
            if (flag == 'add') {
                url = "/v1.0/admin/add/tenants/" + $scope.tenant_id + "/users/" + user.id;
            } else {
                url = "/v1.0/admin/del/tenants/" + $scope.tenant_id + "/users/" + user.id;
            }
            var url = config["host"] + url + "?token=" + window.localStorage.token;
            $http.get(url).then(
                function(response) {
                    // 请求成功
                    var data = response.data;
                    console.info("返回的数据: ", data);
                    createAndHideAlert({
                        "message": "操作成功！",
                        "className": "alert-success"
                    });
                    $('.modal-backdrop').removeClass("modal-backdrop");
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
        }
    }
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
                        "message": "操作成功！",
                        "className": "alert-success"
                    });
                    $scope.refresh();
                },
                function(response) {
                    // 请求失败
                    var data = response.data;
                    console.error("操作失败", data.statusText);
                    createAndHideAlert({
                        "message": "操作失败！",
                        "className": "alert-danger"
                    });
                });
        }();
    };
    $scope.cancelUpdateMemProfile = function() {


    };
    $scope.updateMemProfileOK = function() {
        var flag = $scope.updataFlag;
        if (flag == "member") {
            $scope.manageMemberOK();
        } else if (flag == "project") {
            $scope.createProjectOK();
        } else if (flag == "basicQuto") {
            $scope.updateBasicQutoOK();
        } else if (flag == "networkQuto") {
            $scope.updateNetworkQutoOK();
        }
    };
    //编辑项目
    $scope.editProject = function(id, name, desc, enabled) {
        $scope.updataFlag = 'project';
        $scope.createPro_ManageInfo = false;
        $("#proInfo").show();
        $("#proMember").hide();
        $("#proQuota").hide();
        setActive("home", "proInfo");
        $scope.updataOrCreate = true;
        $scope.projectName = name;
        $scope.projectDesc = desc;
        $scope.projectCreateStatus = enabled;
        $scope.tenant_id = id;
    };
    //修改基本配额
    $scope.updateQuota = function(tenant_id) {
        $scope.tenant_id = tenant_id;
        $scope.basicOrnetworkQuto = true;
        $scope.updataFlag = 'basicQuto';
        $scope.manageMem_Profile = false;
        $scope.createPro_ManageInfo = false;
        $("#proInfo").hide();
        $("#proMember").hide();
        $("#proQuota").show();
        setActive("profile", "proQuota");
        var url = config["host"] + "/v1.0/admin/tenant/" + tenant_id + "/basic_quota?token=" + window.localStorage.token;
        $http.get(url).then(function(response) {
            var data = response.data.quota_set;
            // console.log(data);
            $scope.pro_metadata_items = data.metadata_items;
            $scope.pro_cores = data.cores;
            $scope.pro_instances = data.instances;
            $scope.pro_injected_files = data.injected_files;
            $scope.pro_injected_file_content_bytes = data.injected_file_content_bytes;
            $scope.pro_ram = data.ram;
        });
    };
    $scope.updateBasicQutoOK = function() {
        var basicQuto = {
            "quota_set": {
                "injected_file_content_bytes": $scope.pro_injected_file_content_bytes,
                "metadata_items": $scope.pro_metadata_items,
                "ram": $scope.pro_ram,
                "instances": $scope.pro_instances,
                "injected_files": $scope.pro_injected_files,
                "cores": $scope.pro_cores
            }
        };
        var url = "/v1.0/admin/update/tenant/" + $scope.tenant_id + "/basic_quota";
        var req = {
            method: 'POST',
            url: config["host"] + url + "?token=" + window.localStorage.token,
            ContentType: "application/json",
            data: JSON.stringify(basicQuto)
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
                $('.modal-backdrop').removeClass("modal-backdrop");
            },
            function(response) {
                // 请求失败
                var data = response.data;
                createAndHideAlert({
                    "message": "操作失败！",
                    "className": "alert-danger"
                });
            }
        );
    };
    //修改网络配额
    $scope.updateNetworkQuota = function(tenant_id) {
        $scope.tenant_id = tenant_id;
        $scope.basicOrnetworkQuto = false;
        $scope.updataFlag = 'networkQuto';
        $scope.manageMem_Profile = false;
        $scope.createPro_ManageInfo = false;
        $("#proInfo").hide();
        $("#proMember").hide();
        $("#proQuota").show();
        setActive("profile", "proQuota");
        var url = config["host"] + "/v1.0/admin/tenant/" + tenant_id + "/neutron_quota?token=" + window.localStorage.token;
        // console.log(url);
        $http.get(url).then(function(response) {
            var data = response.data.quota;
            console.log(data);
            $scope.pro_security_groups = data.security_group;
            $scope.pro_security_group_rules = data.security_group_rule;
            $scope.pro_floating_ips = data.floatingip;
            $scope.pro_network = data.network;
            $scope.pro_port = data.port;
            $scope.pro_router = data.router;
            $scope.pro_subNet = data.subnet;
        });
    };
    $scope.updateNetworkQutoOK = function() {
        var networkQuto = {
            "quota": {
                "subnet": $scope.pro_subNet,
                "network": $scope.pro_network,
                "floatingip": $scope.pro_floating_ips,
                "security_group_rule": $scope.pro_security_group_rules,
                "security_group": $scope.pro_security_groups,
                "router": $scope.pro_router,
                "port": $scope.pro_port
            }
        };
        var url = "/v1.0/admin/update/tenant/" + $scope.tenant_id + "/neutron_quota";
        var req = {
            method: 'POST',
            url: config["host"] + url + "?token=" + window.localStorage.token,
            ContentType: "application/json",
            data: JSON.stringify(networkQuto)
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
                $('.modal-backdrop').removeClass("modal-backdrop");
            },
            function(response) {
                // 请求失败
                var data = response.data;
                createAndHideAlert({
                    "message": "操作失败！",
                    "className": "alert-danger"
                });
            }
        );
    };
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
}).controller('projectsDetailController', function($scope, $http, $route, $routeParams) {
    $scope.$parent.loadScript('js/config.js');
    $scope.$parent.loadScript('js/tools/tool.js');
    $scope.refresh = function() {
        $route.reload();
    }
    $("head title").text("项目详情");
    var projectId = $routeParams.projectInfo;



});
