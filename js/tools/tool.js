$(function() {
    var time_limit = setTimeout(function() {
        localStorage.login_flag = "timeout";
        window.location.href = window.location.href.split("#")[0] + "login.html";
        return;
    }, 10 * 60 * 1000);
    $(document).mousemove(function() {
        clearTimeout(time_limit);
        time_limit = setTimeout(function() {
            localStorage.login_flag = "timeout";
            window.location.href = window.location.href.split("#")[0] + "login.html";
            return;
        }, 10 * 60 * 1000);
    });
});
$("#lagout").click(function() {
    $('#myModal').modal('toggle')
    window.localStorage.clear();
    location.reload();
});
//----分页
function setColor(pagenum) {
    $("li a[flag='project']").attr("style", { "display": "none" });
    $("#page" + pagenum).css({
        "color": "white",
        "background-color": "#428BCA",
        "font-weight": "bold"
    });
}

//------侧边栏状态start
$(".nav-sidebar li a").unbind("click").on("click", function() {
    var curr_url = $(this).attr("href");
    setSideBarColor(curr_url);
});

var curr_url = '#' + window.location.href.split("#")[1];
if (curr_url == "#/") {
    $(".nav-sidebar a[href!='#/abstract/abstract']").css({
        "color": "#337ab7",
        "background-color": "transparent"
    });
} else {
    
    $(".nav-sidebar a[href!='" + curr_url + "']").css({
        "color": "#337ab7",
        "background-color": "transparent"
    });
    $(".nav-sidebar a[href='" + curr_url + "']").css({
        "color": "#fff",
        "background-color": "#428bca"
    });
}

function setSideBarColor(curr_url) {
    $(".nav-sidebar li a [href='" + curr_url + "']").click();
    $(".nav-sidebar a[href='" + curr_url + "']").click(function() {
        $(".nav-sidebar  a[href='" + curr_url + "']").css({
            "color": "#fff",
            "background-color": "#428bca"
        })
    });
    var linkEle = $(".nav-sidebar li  a[href!='" + curr_url + "']");
    linkEle.css({
        "color": "#337ab7",
        "background-color": "transparent"
    })
}
//------侧边栏状态end
function pretty_adrr(addrs_temp) {
    var str = "";
    var num = 0;
    for (var net in addrs_temp)
        num++;
    for (var net in addrs_temp) {
        if (addrs_temp[net].length > 1) {
            if (num > 1)
                str += "<b>" + net + "</b><br/>";
            for (var j = 0; j < addrs_temp[net].length; j++) {
                if (addrs_temp[net][j]["OS-EXT-IPS:type"] == "fixed")
                    str += addrs_temp[net][j].addr + "<br/>";
                else if (addrs_temp[net][j]["OS-EXT-IPS:type"] == "floating")
                    str += "浮动IP<br/>" + addrs_temp[net][j].addr + "<br/>";
            }
        } else {
            for (var j = 0; j < addrs_temp[net].length; j++) {
                if (num > 1)
                    str += "<b>" + net + "</b><br/>";
                if (addrs_temp[net][j]["OS-EXT-IPS:type"] == "fixed")
                    str += addrs_temp[net][j].addr + "<br/>";
                else if (addrs_temp[net][j]["OS-EXT-IPS:type"] == "floating")
                    str += "浮动IP<br/>" + addrs_temp[net][j].addr + "<br/>";
            }
        }
    }
    return str;
}
//--------格式化地址
function pretty_adrr1(addrs_temp) {
    var str = "";
    var num = 0;
    for (var net in addrs_temp)
        num++;
    for (var net in addrs_temp) {
        if (addrs_temp[net].length > 1) {
            if (num > 1)
                str += "<b>" + net + "</b>";
            for (var j = 0; j < addrs_temp[net].length; j++) {
                if (addrs_temp[net][j]["OS-EXT-IPS:type"] == "fixed") {
                    var header_str;
                    if (num == 1)
                        header_str = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    else
                        header_str = "";
                    str += header_str + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + addrs_temp[net][j].addr + "<br/>";
                } else if (addrs_temp[net][j]["OS-EXT-IPS:type"] == "floating")
                    str += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "浮动IP<br/>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + addrs_temp[net][j].addr + "<br/>";
            }
        } else {
            for (var j = 0; j < addrs_temp[net].length; j++) {
                if (num > 1)
                    str += "<b>" + net + "</b>";
                if (addrs_temp[net][j]["OS-EXT-IPS:type"] == "fixed") {
                    var header_str;
                    if (num == 1)
                        header_str = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    else
                        header_str = "";
                    str += header_str + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + addrs_temp[net][j].addr + "<br/>";
                } else if (addrs_temp[net][j]["OS-EXT-IPS:type"] == "floating")
                    str += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "浮动IP<br/>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + addrs_temp[net][j].addr + "<br/>";
            }
        }
    }
    return str;
}
//----时间的长度计算
function getTimeLen(date_temp) {
    // var UTC8_time = moment(date_temp).utc().zone(-8).format('YYYY-MM-DD HH:mm:ss');
    // var now = moment(new Date()).utc().zone(-8).format('YYYY-MM-DD HH:mm:ss');
    var UTC8_time = moment(date_temp).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
    var now = moment(new Date()).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
    //createAndHideAlert(UTC8_time+"==="+now);
    // var time = moment.utc((moment(moment(new Date()).utc().zone(-8).format('YYYY-MM-DD HH:mm:ss'))).diff(UTC8_time)).zone(-8) / 1000; //.format("DD天 HH小时");
    var time = moment.utc((moment(moment(new Date()).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss'))).diff(UTC8_time)).utcOffset(+8) / 1000; //.format("DD天 HH小时");

    var weekend = parseInt(time / (60 * 60 * 24 * 7));
    var zday = parseInt(time / (60 * 60 * 24)) - weekend * 7;
    var zhour = parseInt(time / (60 * 60)) - zday * 24 - weekend * 7 * 24;
    var minuter = parseInt(time / 60) - zday * 24 * 60 - weekend * 7 * 24 * 60;
    // createAndHideAlert(weekend+"/"+zday+"/"+zhour);
    var time_str = "";
    if (weekend != 0) {
        time_str += weekend + "周 ";
    }
    if (zday != 0) {
        time_str += zday + "日 ";
    }
    if (zhour != 0) {
        time_str += zhour + "时";
    }
    if (weekend == 0 && zday == 0 && zhour == 0) {
        time_str += minuter + "分钟";
    }
    return time_str;
}
//-------格式化时间
function getTimeStr(date_temp) {
    // var UTC8_time = moment.utc(date_temp).zone(-8).format('YYYY-MM-DD HH:mm:ss');
    var UTC8_time = moment.utc(date_temp).utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
    return UTC8_time;
}
//---------移动的实现
function dragDIV(oDrag) {
    console.error("oDrag", oDrag);
    var disX = dixY = 0;
    $(oDrag).unbind('mousedown').on("mousedown", function(event) {
        var event = event || window.event;
        disX = event.clientX - this.offsetLeft;
        disY = event.clientY - this.offsetTop;
        var oTemp = this; //.cloneNode(true);
        //document.body.appendChild(oTemp);
        document.onmousemove = function(event) {
            var event = event || window.event;
            var iL = event.clientX - disX;
            var iT = event.clientY - disY;
            var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
            var maxT = document.documentElement.clientHeight - oDrag.offsetHeight;
            iL <= 0 && (iL = 0);
            iT <= 0 && (iT = 0);
            iL >= maxL && (iL = maxL);
            iT >= maxT && (iT = maxT);
            oTemp.style.left = iL + "px";
            oTemp.style.top = iT + "px";
            return false;
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false
    });
}
//-----云主机类型
function flvors_info() {
    $.ajax({
        type: "GET",
        url: config["host"] + "/flavors?token=" + window.localStorage.token,
        success: function(data) {
            var flavor = JSON.parse(data).flavors;
            //createAndHideAlert(">>>" + flavor_id);
            for (var i = 0; i < flavor.length; i++) {
                if (flavor[num].id == flavor_id) {
                    peizhi = flavor[num].name;
                }
            }
        },
        error: function(data) {
            createAndHideAlert("配置获取失败！");
        }
    });
}
//------创建网络
function create_networkFun() {
    $(".subNet_infos").show();
    //------------创建网络面板的控制--start
    $(".create_networkCancel").off('click').click(function() {
        if (!flag) {
            $(".info_pic").removeClass("fa fa-angle-double-up");
            $(".info_pic").addClass("fa fa-angle-double-down");
            $(".subnet_multi").slideToggle();
            flag = true;
        }
        $("createnetwork_name").val("");
        $("subnet_name").val("");
        $(".subnet_check").prop("checked", true);
        $(".subnet_mangerStatuscheck").prop("checked", true);
    });
    //--------是否显示子网详细
    var flag = true;
    $(".choose_subnet").off('click').click(function() {
        $(".subnet_multi").slideToggle();
        if (flag) {
            $(".info_pic").removeClass("fa fa-angle-double-down");
            $(".info_pic").addClass("fa fa-angle-double-up");
            flag = false;
        } else {
            $(".info_pic").removeClass("fa fa-angle-double-up");
            $(".info_pic").addClass("fa fa-angle-double-down");
            flag = true;
        }
    });
    //-------是否显示子网
    $(".subnet_check").off('change').change(function() {
        if ($(".subnet_check").is(":checked")) {
            $(".subNet_infos").fadeToggle();
        } else {
            $(".subNet_infos").fadeToggle();
        }
    });

    //------------创建网络面板的控制--end
    //-------------创建网络
    $(".create_networkOk").off('click').click(function() {
        var network_json;
        var net_managerStatus;
        var net_name = $(".createnetwork_name").val();
        if ($(".subnet_mangerStatuscheck").prop("checked"))
            net_managerStatus = true;
        else
            net_managerStatus = false;
        if (!$(".subnet_check").prop("checked")) {
            var network = [{
                "network": {
                    "name": "",
                    "admin_state_up": true
                }
            }];
            if (net_name != "")
                network[0]['network'].name = net_name;
            network[0]['network'].admin_state_up = net_managerStatus;
            createNetAjax(network);
        } else {
            var netWork_info = [{
                "network": {
                    "name": "",
                    "admin_state_up": true
                }
            }, {
                "subnet": {
                    "name": "",
                    "ip_version": 4,
                    "cidr": ""
                }
            }];
            var network = netWork_info[0]['network'];
            var subnet = netWork_info[1]['subnet'];
            if (net_name != "")
                network.name = net_name;
            else
                network.name = "";
            network.admin_state_up = net_managerStatus;
            //--------校验子网信息
            var subnet_name = $(".subnet_name").val();
            //---获取子网的地址
            var object = $(".radio_subnetaddr:checked");
            console.log($(".radio_subnetaddr:checked"));
            var num_1 = object.parent().siblings().eq(0).val();
            var num_2 = object.parent().siblings().eq(2).val();
            var num_3 = object.parent().siblings().eq(4).val();
            var num_4 = object.parent().siblings().eq(6).val();
            var num_5 = object.parent().siblings().eq(8).val();
            var str_ip = num_1 + "." + num_2 + "." + num_3 + "." + num_4 + "/" + num_5;
            subnet.name = subnet_name;
            subnet.cidr = str_ip;
            if (subnet_name == "") {
                createAndHideAlert("请填写子网名称和地址！");
            } else {
                createNetAjax(netWork_info);
            }
        }
    });
}
//-----创建子网
function create_subnetFun() {
    $(".netDiv_title").html("创建子网");
    //---------------创建子网面板配置
    var sub1_flag = true;
    $(".createchoose_subnet").off('click').click(function() {
        $(".createsubnet_multi").slideToggle();
        if (sub1_flag) {
            $(".info_pic2").removeClass("fa fa-angle-double-down");
            $(".info_pic2").addClass("fa fa-angle-double-up");
            sub1_flag = false;
        } else {
            $(".info_pic2").removeClass("fa fa-angle-double-up");
            $(".info_pic2").addClass("fa fa-angle-double-down");
            sub1_flag = true;
        }
    });
    var sub2_flag = true;
    $(".showmoresubnetInfo").off('click').click(function() {
        $(".showMoreInfo").slideToggle();
        if (sub2_flag) {
            $(".info_pic3").removeClass("fa fa-angle-double-down");
            $(".info_pic3").addClass("fa fa-angle-double-up");
            sub2_flag = false;
        } else {
            $(".info_pic3").removeClass("fa fa-angle-double-up");
            $(".info_pic3").addClass("fa fa-angle-double-down");
            sub2_flag = true;
        }
    });
    $(".subnet_opengateway").off('change').change(function() {
        if (!$(".subnet_opengateway").is(":checked"))
            $(".creategateway_adrr").attr("disabled", true);
        else
            $(".creategateway_adrr").attr("disabled", false);
    });
    $(".add_subnetInfo").off('click').on("click", function() {
        $(".private_selected").empty();
        $(".private_selected").append('<option value="test">选择私有网络</option>');
        $.ajax({
            type: "GET",
            url: config["host"] + "/networks?token=" + window.localStorage.token,
            success: function(data) {
                var servers = JSON.parse(data)['networks'];
                var server;
                var str = "";
                for (var i = 0; i < servers.length; i++) {
                    server = servers[i];
                    str += '<option value="' + server.id + '">' + server.name + '</option>';
                }
                $(".private_selected").append(str);
            }
        });
    });
    //---------创建子网
    $(".create_subnetworkOk").off('click').click(function() {
        update_flag = false;
        //------子网名称
        var sub_name = $(".createsubnet_name").val();
        //------私有网络ID
        var private_net = $(".private_selected").val();
        //---获取子网的地址
        var object = $(".createradio_subnetaddr:checked");
        var num_1 = object.parent().siblings().eq(0).val();
        var num_2 = object.parent().siblings().eq(2).val();
        var num_3 = object.parent().siblings().eq(4).val();
        var num_4 = object.parent().siblings().eq(6).val();
        var num_5 = object.parent().siblings().eq(8).val();
        var str_ip = num_1 + "." + num_2 + "." + num_3 + "." + num_4 + "/" + num_5;
        //------------开启网关判断
        var gateWay;
        if ($(".subnet_opengateway").prop("checked")) {
            gateWay = $(".creategateway_adrr").val();
        }
        //--------DHCP
        var dhcp;
        if ($(".subnet_openDHCP").prop("checked")) {
            dhcp = true;
        } else {
            dhcp = false;
        }

        //--------数据提交
        var subnet = {
            "subnet": {
                "name": "",
                "network_id": "",
                "ip_version": 4,
                "cidr": "10.0.0.1",
                "gateway_ip": "",
                "enable_dhcp": false,
                "allocation_pools": [],
                "dns_nameservers": []
            }
        }
        var subnetInfo = subnet['subnet'];
        if (sub_name == "") {
            createAndHideAlert("子网名称必填！");
            return;
        }
        subnetInfo.name = sub_name;
        if (private_net == "test") {
            createAndHideAlert("请选择私有网络！");
            return;
        }
        subnetInfo.network_id = private_net;
        subnetInfo.cidr = str_ip;
        if (gateWay == "")
            delete subnetInfo.gateway_ip;
        else
            subnetInfo.gateway_ip = gateWay;
        subnetInfo.enable_dhcp = dhcp;
        //--------地址池
        if ($(".Addrpool").val() != "") {
            var arr = $(".Addrpool").val().split("\n");

            var temp_arr = [];
            var temp;
            var object = { "start": "", "end": "" };
            for (var i = 0; i < arr.length; i++) {
                temp = arr[i].split(",");
                if (temp.length % 2 != 0) {
                    createAndHideAlert("地址池起始地址有误！");
                    return;
                }
                object.start = temp[0];
                object.end = temp[1];
                temp_arr[i] = object;
            }
            subnetInfo.allocation_pools = temp_arr;
        }
        //--------DNS服务
        if ($(".DNSserver").val() != "") {
            var arr = $(".DNSserver").val().split("\n");
            for (var i = 0; i < arr.length; i++) {
                subnetInfo.dns_nameservers[i] = arr[i];
            }
        }
        createSubnetAJAX(subnet);
    });
}

function clear_timer(url, timer_arr) {
    var curr_url = window.location.href.split("#")[1];
    if (curr_url.slice(0, url.length) != url) {
        for (var i = 0; i < timer_arr.length; i++) {
            clearInterval(timer_arr[i]);
        }
        return true;
    }
    return false;
}

function clear_timer_when_switch(timer_arr) {
    for (var i = 0; i < timer_arr.length; i++) {
        clearInterval(timer_arr[i]);
    }
}

function identify_protocol_port(ip_protocol, src_port_num, dst_port_num) {
    var protocol = parseInt(ip_protocol);
    var src_port = parseInt(src_port_num);
    var dst_port = parseInt(dst_port_num);
    var ret = "";
    switch (protocol) {
        case 6:
            if (src_port == 20 || dst_port == 20) {
                ret = "FTP(20)";
            } else if (src_port == 21 || dst_port == 21) {
                ret = "FTP(21)";
            } else if (src_port == 23 || dst_port == 23) {
                ret = "TELNET(23)";
            } else if (src_port == 25 || dst_port == 25) {
                ret = "SMTP(25)";
            } else if (src_port == 80 || dst_port == 80) {
                ret = "HTTP(80)";
            } else if (src_port == 110 || dst_port == 110) {
                ret = "POP3(110)";
            } else if (src_port == 443 || dst_port == 443) {
                ret = "HTTPS(443)";
            } else {
                ret = "TCP(" + src_port + ")";
            }
            break;
        case 17:
            if (src_port == 53 || dst_port == 53) {
                ret = "DNS(53)";
            } else if (src_port == 161 || dst_port == 161) {
                ret = "SNMP(161)";
            } else if (src_port == 162 || dst_port == 162) {
                ret = "SNMP-Trap(162)";
            } else if (src_port == 69 || dst_port == 69) {
                ret = "TFTP(69)";
            } else {
                ret = "UDP(" + src_port + ")";
            }
            break;
        case 1:
            ret = "ICMP(TYPE-" + src_port + ")";
            break;
        default:
            ret = "Protocol:" + protocol + "Port：" + src_port;
    }
    return ret;
}


function identify_client_server(ip_protocol, ip, port) {
    var protocol = parseInt(ip_protocol);
    var ret = "";
    switch (protocol) {
        case 6:
            ret = ip + ":" + port;
            break;
        case 17:
            ret = ip + ":" + port;
            break;
        default:
            ret = ip;
    }
    return ret;
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    if (window.location.href.split("?").length>1) {
        var r = window.location.href.split("?")[1].match(reg);
        if (r != null)
            return unescape(r[2]);
    }
    return null;
}
