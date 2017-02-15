/**
 * Created by lwj on 2016/12/15.
 */
var ajaxbg = $("#loading_monitor,#background_monitor");
ajaxbg.show();
setTimeout("ajaxbg.hide()", 2000);
var instance_traffic_timer_arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
$(function() {
    $('#option1').click();
    var monitor_tenant_id = getQueryString("tenant_id");
    var monitor_server_id = getQueryString("server_id");
    var curr_type = "minute";
    var curr_tenant_id;
    var curr_server_id;

    $.ajax({
        type: "GET",
        url: config["host"] + "/v1.0/admin/tenants?token=" + window.localStorage.token,
        success: function(data) {
            var tenants = JSON.parse(data)['tenants'];
            if (tenants.length != 0) {
                for (var i = 0; i < tenants.length; i++)
                    $(".monitor_instance_traffic_tenant").append('<option value="' + tenants[i].id + '">' + tenants[i].name + '</option>');
                curr_tenant_id = tenants[0].id;
                if (monitor_tenant_id !=null && monitor_tenant_id.toString().length>1) {
                    curr_tenant_id = monitor_tenant_id;
                    $(".monitor_instance_traffic_tenant option[value='" + curr_tenant_id + "']").attr("selected", true);
                }
            } else {
                createAndHideAlert("当前没有租户^.^!");
            }
            //主机的获取
            $.ajax({
                type: "GET",
                url: config["host"] + "/v1.0/admin/tenant/instances/" + curr_tenant_id + "?token=" + window.localStorage.token,
                success: function(data) {
                    var arr = [0, 0];
                    var servers = JSON.parse(data)['servers'];
                    if (servers.length != 0) {
                        for (var i = 0; i < servers.length; i++){
                            $(".monitor_instance_traffic_cloud_host").append('<option value="' + servers[i].id  + '">' + servers[i].name + '</option>');
                        }
                        curr_server_id = servers[0].id;
                        if (monitor_server_id !=null && monitor_server_id.toString().length>1) {
                            curr_server_id = monitor_server_id;
                            $(".monitor_instance_traffic_cloud_host option[value='" + curr_server_id + "']").attr("selected", true);
                        }
                        set_instance_traffic(curr_tenant_id, curr_server_id, curr_type, arr);

                    } else {
                        createAndHideAlert("该租户当前没有虚拟机^.^！");
                    }
                },
                error: function(data) {
                    createAndHideAlert("当前没有主机或主机信息获取失败！");
                }
            })},
        error: function(data) {
            createAndHideAlert("当前没有租户或租户信息获取失败！");
        }
    });

    //select事件
    $('.monitor_instance_traffic_tenant').change(function() {
        ajaxbg.show();
        clear_timer_when_switch(instance_traffic_timer_arr);
        var id = $(this).children('option:selected').val();
        $('.monitor_instance_traffic_cloud_host').empty();
        curr_tenant_id = id;
        //主机的获取
        $.ajax({
            type: "GET",
            url: config["host"] + "/v1.0/admin/tenant/instances/" + curr_tenant_id + "?token=" + window.localStorage.token,
            success: function(data) {
                var arr = [0, 0];
                var servers = JSON.parse(data)['servers'];
                if (servers.length != 0) {
                    for (var i = 0; i < servers.length; i++){
                        $(".monitor_instance_traffic_cloud_host").append('<option value="' + servers[i].id  + '">' + servers[i].name + '</option>');
                    }
                    curr_server_id = servers[0].id;
                    if (monitor_server_id !=null && monitor_server_id.toString().length>1) {
                        curr_server_id = monitor_server_id;
                        $(".monitor_instance_traffic_cloud_host option[value='" + curr_server_id + "']").attr("selected", true);
                    }
                    set_instance_traffic(curr_tenant_id, curr_server_id, curr_type, arr);

                } else {
                    createAndHideAlert("该租户当前没有虚拟机^.^！");
                    setTimeout("ajaxbg.hide()", 2000);
                }
            },
            error: function(data) {
                createAndHideAlert("当前没有主机或主机信息获取失败！");
                setTimeout("ajaxbg.hide()", 2000);
            }
        })
    });

    //select事件
    $('.monitor_instance_traffic_cloud_host').change(function() {
        ajaxbg.show();
        curr_server_id = $(this).children('option:selected').val();
        var arr = [0, 0];
        clear_timer_when_switch(instance_traffic_timer_arr);
        set_instance_traffic(curr_tenant_id, curr_server_id, curr_type, arr);
    });
    //天时分改变
    $('#option1').click(function() {
        changeStatus(this);
        ajaxbg.show();
        curr_type = "minute";
        set_instance_traffic_statistics(curr_tenant_id, curr_server_id, curr_type);
    });
    $('#option2').click(function() {
        changeStatus(this);
        ajaxbg.show();
        curr_type = "hour";
        set_instance_traffic_statistics(curr_tenant_id, curr_server_id, curr_type);
    });
    $('#option3').click(function() {
        changeStatus(this);
        ajaxbg.show();
        curr_type = "day";
        set_instance_traffic_statistics(curr_tenant_id, curr_server_id, curr_type);
    });
});

function changeStatus(that) {
    for (var i = 1; i < 4; i++)
        $("#option" + i).removeClass("active");
    $(that).addClass("active");
}

function set_instance_traffic(tenant_id, server_id, curr_type, arr) {
    setTimeout("ajaxbg.hide()", 2000);
    set_host_net_meter(server_id, "network.incoming.bytes.rate", arr);
    set_host_net_meter(server_id, "network.outgoing.bytes.rate", arr);
    set_host_active_flow(server_id);
    set_instance_top_protocol_port(tenant_id, server_id, curr_type);
    set_instance_top_ip_link(tenant_id, server_id, curr_type);
    set_instance_top_src_ip(tenant_id, server_id, curr_type);
    set_instance_top_dst_ip(tenant_id, server_id, curr_type);
    set_instance_top_src_port(tenant_id, server_id, curr_type);
    set_instance_top_dst_port(tenant_id, server_id, curr_type);
    set_instance_top_session(tenant_id, server_id, curr_type);
}


function set_instance_traffic_statistics(tenant_id, server_id, curr_type) {
    setTimeout("ajaxbg.hide()", 2000);
    set_instance_top_protocol_port(tenant_id, server_id, curr_type);
    set_instance_top_ip_link(tenant_id, server_id, curr_type);
    set_instance_top_src_ip(tenant_id, server_id, curr_type);
    set_instance_top_dst_ip(tenant_id, server_id, curr_type);
    set_instance_top_src_port(tenant_id, server_id, curr_type);
    set_instance_top_dst_port(tenant_id, server_id, curr_type);
    set_instance_top_session(tenant_id, server_id, curr_type);
}


function get_host_net_meter(id, meter_name) {
    if(clear_timer("/monitor/instance_traffic", instance_traffic_timer_arr)){
        return;
    }
    var meter_data = "";
    $.ajax({
        type: "GET",
        url: config["host"] + "/v1.0/monitor/" + id + "/" + meter_name + "/minute?limit=1&token=" + window.localStorage.token,
        async: false,
        success: function (data) {
            meter_data = JSON.parse(data)[meter_name][0];
            var time_str = getTimeStr(meter_data.timestamp);
            var time_temp = "";
            //时间的转换
            time_temp = time_str.split(" ")[1];
            meter_data.timestamp = time_temp;
            meter_data = JSON.stringify(meter_data);
        },
        error: function (data) {
            createAndHideAlert("信息获取失败！");
        }
    });
    return meter_data;
}

function set_host_net_meter(id, meter_name, arr) {
    $.ajax({
        type: "GET",
        url: config["host"] + "/v1.0/monitor/" + id + "/" + meter_name + "/minute?limit=50&token=" + window.localStorage.token,
        success: function(data) {
            // console.log(data);
            var meter_datas = JSON.parse(data)[meter_name];
            if (meter_datas[0] != null && meter_datas[0] != "") {
                var temp_flag = "";
                for (var i = 0; i < meter_datas.length; i++) {
                    //------------时间格式的控制
                    // 返回数据为空的时间格式为前一个不空的数据的时间依次往后
                    if (meter_datas[i] == null) {
                        temp_flag = moment(temp_flag, "HH:mm:ss").subtract(10, "seconds").format("HH:mm:ss");
                        meter_datas[i] = {};
                        meter_datas[i].timestamp = temp_flag;
                        meter_datas[i].counter_volume = 0;
                    } else {
                        var time_str = getTimeStr(meter_datas[i].timestamp);
                        temp_flag = time_str.split(" ")[1];
                        meter_datas[i].timestamp = temp_flag;
                        //百分比转换
                        meter_datas[i].counter_volume = new Number(meter_datas[i].counter_volume).toFixed(2);
                    }
                }
                if (meter_name == "network.incoming.bytes.rate")
                    arr[0] = meter_datas;
                else
                    arr[1] = meter_datas;
                if (arr[0] != 0 && arr[1] != 0)
                    set_host_net_traffic(id, arr[0], arr[1]);
                // 等待图片消失
                if ((arr[0] + arr[1]) != 0)
                    ajaxbg.hide();
            }
            else {
                var show_info = '<div id="content" class="col-md-12 monitor-chart" style="background:pink;width:220px;height:40px;text-align:center;padding-top:12px;position:absolute;left:40%;top:100px;z-index:0"><b>暂时没有数据!</b></div>';
                var option = "instance_traffic_rt";
                var title = "网络监控信息";
                showInfo_disk_Net(option, title);
                $("#instance_traffic_rt").append(show_info);
            }
        },
        error: function(data) {
            createAndHideAlert("信息获取失败！");
        }
    });
}

function showInfo_disk_Net(option, title) {
    var myChart3 = echarts.init(document.getElementById(option));
    // 3.网络监控信息
    var option3 = {
        title: {
            text: title,
            left: 'center'
        },
        legend: {
            data: [{
                name: '网络接受速率',
                icon: 'rect'
            }, {
                name: '网络发送速率',
                icon: 'rect'
            }],
            itemHeight: '5',
            left: 'center',
            top: '8%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }
    };
    myChart3.setOption(option3);
}

//-------设置网络
function set_host_net_traffic(id, net_ins, net_outs) {
    var instance_traffic_rt = echarts.init(document.getElementById('instance_traffic_rt'));
    // 3.网络监控信息
    var option4 = {
        title: {
            text: '网络监控信息',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br> {a0}: {c0} B/S<br>{a1}: {c1} B/S'
        },
        legend: {
            data: [{
                name: '网络接受速率',
                icon: 'rect'
            }, {
                name: '网络发送速率',
                icon: 'rect'
            }],
            itemHeight: '5',
            left: 'center',
            top: '8%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data:
            // [net_ins[6].timestamp, net_ins[5].timestamp, net_ins[4].timestamp, net_ins[3].timestamp, net_ins[2].timestamp, net_ins[1].timestamp, net_ins[0].timestamp]
                (function (){
                    var res = [];
                    for(var i=net_ins.length; i>=1; i--){
                        res.push(net_ins[i-1].timestamp);
                    }
                    return res;
                })()
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: [0, '20%'],
            axisLabel: {
                formatter: '{value} B/S'
            }
        }],
        series: [{
            name: '网络接受速率',
            type: 'line',
            step: 'middle',
            smooth: true,
            lineStyle: {
                normal: {
                    width: '2'
                }
            },
            data:
                (function (){
                    var res = [];
                    for(var i=net_ins.length; i>=1; i--){
                        res.push(net_ins[i-1].counter_volume);
                    }
                    return res;
                })()
        }, {
            name: '网络发送速率',
            type: 'line',
            step: 'middle',
            smooth: true,
            lineStyle: {
                normal: {
                    width: '2',
                    color: '#0000ff'
                }
            },
            data:
                (function (){
                    var res = [];
                    for(var i=net_outs.length; i>=1; i--){
                        res.push(net_outs[i-1].counter_volume);
                    }
                    return res;
                })()
        }]
    };
    instance_traffic_rt.setOption(option4);

    instance_traffic_timer_arr[0] = setInterval(function () {
        var meter_data1 = get_host_net_meter(id, "network.incoming.bytes.rate");
        var meter_data2 = get_host_net_meter(id, "network.outgoing.bytes.rate");
        var last_data1 = JSON.parse(meter_data1);
        var last_data2 = JSON.parse(meter_data2);
        var data0 = option4.series[0].data;
        var data1 = option4.series[1].data;
        data0.shift();
        data0.push(last_data1.counter_volume);
        data1.shift();
        data1.push(last_data2.counter_volume);
        option4.xAxis[0].data.shift();
        option4.xAxis[0].data.push(last_data1.timestamp);
        instance_traffic_rt.setOption(option4);
    }, 10000);
}

function get_instance_traffic_meter_data(url) {
    if(clear_timer("/monitor/instance_traffic", instance_traffic_timer_arr)){
        return;
    }
    var meter_data = "";
    $.ajax({
        type: "GET",
        url: url, //"http://192.168.1.180:8008/activeflows/ALL/"+ id +"/json?maxFlows=10&minValue=0&aggMode=max",
        async: false,
        success: function (data) {
            meter_data = data;
        },
        error: function (data) {
            createAndHideAlert("信息获取失败！");
        }
    });
    return JSON.parse(meter_data);
}

function set_host_active_flow(id){
    $(".host_active_flow").empty();
    $(".host_active_flow_account").empty();
    var url = config["host"] + "/v1.0/monitor/" + id + "/instance_active_flow?token=" + window.localStorage.token;
    var host_active_flow = get_instance_traffic_meter_data(url);
    var tbody_str = "";

    for(var i=0; i< host_active_flow.length; i++){
        var keys = host_active_flow[i].key.split(",");
        tbody_str += "<tr><td>"+ identify_protocol_port(keys[4], keys[5], keys[6]) +"</td>" +
            "<td>" + identify_client_server(keys[4], keys[2], keys[5]) + "</td>" +
            "<td>"+ identify_client_server(keys[4], keys[3], keys[6]) +"</td>" +
            "<td>"+ (new Number(host_active_flow[i]["value"])/1024).toFixed(4) +"KB/s</td></tr>";
    }
    $(".host_active_flow").append(tbody_str);
    var footer_str = "<tr class='active tfoot-dsp router_tr'><td colspan='8'>Displaying <span id='item_count'>" + host_active_flow.length + "</span> items</td></tr>";
    $(".host_active_flow_account").append(footer_str);

    instance_traffic_timer_arr[1] = setInterval(function () {
        var host_active_flow = get_instance_traffic_meter_data(url);
        var tbody_str = "";
        for(var i=0; i< host_active_flow.length; i++){
            var keys = host_active_flow[i].key.split(",");
            tbody_str += "<tr><td>"+ identify_protocol_port(keys[4], keys[5], keys[6]) +"</td>" +
                "<td>" + identify_client_server(keys[4], keys[2], keys[5]) + "</td>" +
                "<td>"+ identify_client_server(keys[4], keys[3], keys[6]) +"</td>" +
                "<td>"+ (new Number(host_active_flow[i]["value"])/1024).toFixed(4) +"KB/s</td></tr>";
        }
        $(".host_active_flow").empty();
        $(".host_active_flow_account").empty();
        $(".host_active_flow").append(tbody_str);
        var footer_str = "<tr class='active tfoot-dsp'><td colspan='8'>Displaying <span id='item_count'>" + host_active_flow.length + "</span> items</td></tr>";
        $(".host_active_flow_account").append(footer_str);
    }, 5000);

}

function get_instance_statistics_data(tenant_id, instance_id, data_type, curr_type) {
    if(clear_timer("/monitor/instance_traffic", instance_traffic_timer_arr)){
        return;
    }
    var meter_datas = "";
    $.ajax({
        type: "GET",
        url: config["host"] + "/v1.0/monitor/" + tenant_id + "/"  + instance_id + "/" + data_type +"/" + curr_type + "?token=" + window.localStorage.token,
        async: false,
        success: function (data) {
            meter_datas = data;
        },
        error: function (data) {
            createAndHideAlert("信息获取失败！");
        }
    });
    return JSON.parse(meter_datas);
}

function set_instance_top_protocol_port(tenant_id, instance_id, curr_type) {
    var meter_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_protocol_port", curr_type);
    // console.log(meter_datas);
    var instance_top_protocol_port = echarts.init(document.getElementById("instance_top_protocol_port"));
    var option_top = {
        title : {
            text: '虚拟机流量协议-目的端口--TOP 10',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            padding: [30, 10, 0, 0],
            data:
                (function () {
                    var res = [];
                    for(var i=0; i<meter_datas.length; i++){
                        res.push(identify_protocol_port(meter_datas[i]["_id"]["ipprotocol"], meter_datas[i]["_id"]["dstport_or_icmpcode"]));
                    }
                    return res;
                })()
        },
        series : [
            {
                name: '协议端口',
                type: 'pie',
                radius : [15, 90],
                center: ['40%', '65%'],
                roseType: "radius",
                data:
                    (function () {
                        var res = [];
                        for(var i=0; i<meter_datas.length; i++){
                            res.push({
                                name: identify_protocol_port(meter_datas[i]["_id"]["ipprotocol"], meter_datas[i]["_id"]["dstport_or_icmpcode"]),
                                value: meter_datas[i]["count"]
                            });
                        }
                        return res;
                    })()
                ,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    instance_top_protocol_port.setOption(option_top);
    if(curr_type == "minute") {
        instance_traffic_timer_arr[2] = setInterval(function () {
            var last_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_protocol_port", curr_type);
            var data0 = option_top.series[0].data;
            var legend0 = option_top.legend.data;
            data0.splice(0, data0.length);
            legend0.splice(0, legend0.length);
            for (var i = 0; i < last_datas.length; i++) {
                data0.push({
                    name: identify_protocol_port(last_datas[i]["_id"]["ipprotocol"], last_datas[i]["_id"]["dstport_or_icmpcode"]),
                    value: last_datas[i]["count"]
                });
                legend0.push(identify_protocol_port(last_datas[i]["_id"]["ipprotocol"], last_datas[i]["_id"]["dstport_or_icmpcode"]));
            }
            instance_top_protocol_port.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(instance_traffic_timer_arr[2]);
    }
}

function set_instance_top_ip_link(tenant_id, instance_id, curr_type) {
    var meter_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_ip_link", curr_type);
    var instance_top_ip_link = echarts.init(document.getElementById("instance_top_ip_link"));
    var option_top = {
        title : {
            text: '流量协议端口--TOP 10',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            padding: [30, 10, 0, 0],
            data:
                (function () {
                    var res = [];
                    for(var i=0; i<meter_datas.length; i++){
                        res.push(meter_datas[i]["_id"]["ipsource"]+ "--"+meter_datas[i]["_id"]["ipdestination"]);
                    }
                    return res;
                })()
        },
        series : [
            {
                name: '协议端口',
                type: 'pie',
                radius : [15, 90],
                center: ['40%', '65%'],
                roseType: "radius",
                data:
                    (function () {
                        var res = [];
                        for(var i=0; i<meter_datas.length; i++){
                            res.push({
                                name: meter_datas[i]["_id"]["ipsource"]+ "--"+meter_datas[i]["_id"]["ipdestination"],
                                value: meter_datas[i]["count"]
                            });
                        }
                        return res;
                    })()
                ,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    instance_top_ip_link.setOption(option_top);
    if(curr_type == "minute") {
        instance_traffic_timer_arr[3] = setInterval(function () {
            var last_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_ip_link", curr_type);
            var data0 = option_top.series[0].data;
            var legend0 = option_top.legend.data;
            data0.splice(0, data0.length);
            legend0.splice(0, legend0.length);
            for (var i = 0; i < last_datas.length; i++) {
                data0.push({
                    name: last_datas[i]["_id"]["ipsource"]+ "--"+last_datas[i]["_id"]["ipdestination"],
                    value: last_datas[i]["count"]
                });
                legend0.push(last_datas[i]["_id"]["ipsource"]+ "--"+last_datas[i]["_id"]["ipdestination"]);
            }
            instance_top_ip_link.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(instance_traffic_timer_arr[3]);
    }
}

function set_instance_top_src_ip(tenant_id, instance_id, curr_type) {
    var meter_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_src_ip", curr_type);
    var instance_top_src_ip = echarts.init(document.getElementById("instance_top_src_ip"));
    var option_top = {
        title : {
            text: '虚拟机流量源IP分布--TOP 10',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            padding: [30, 10, 0, 0],
            data:
                (function () {
                    var res = [];
                    for(var i=0; i<meter_datas.length; i++){
                        res.push(meter_datas[i]["_id"]);
                    }
                    return res;
                })()
        },
        series : [
            {
                name: 'IP',
                type: 'pie',
                radius : [15, 90],
                center: ['40%', '65%'],
                roseType: "radius",
                data:
                    (function () {
                        var res = [];
                        for(var i=0; i<meter_datas.length; i++){
                            res.push({
                                name: meter_datas[i]["_id"],
                                value: meter_datas[i]["count"]
                            });
                        }
                        return res;
                    })()
                ,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    instance_top_src_ip.setOption(option_top);
    if(curr_type == "minute") {
        instance_traffic_timer_arr[4] = setInterval(function () {
            var last_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_src_ip", curr_type);
            var data0 = option_top.series[0].data;
            var legend0 = option_top.legend.data;
            data0.splice(0, data0.length);
            legend0.splice(0, legend0.length);
            for (var i = 0; i < last_datas.length; i++) {
                data0.push({
                    name: last_datas[i]["_id"],
                    value: last_datas[i]["count"]
                });
                legend0.push(last_datas[i]["_id"]);
            }
            instance_top_src_ip.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(instance_traffic_timer_arr[4]);
    }
}

function set_instance_top_dst_ip(tenant_id, instance_id, curr_type) {
    var meter_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_dst_ip", curr_type);
    var instance_top_dst_ip = echarts.init(document.getElementById("instance_top_dst_ip"));
    var option_top = {
        title : {
            text: '虚拟机流量目的IP分布--TOP 10',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            padding: [30, 10, 0, 0],
            data:
                (function () {
                    var res = [];
                    for(var i=0; i<meter_datas.length; i++){
                        res.push(meter_datas[i]["_id"]);
                    }
                    return res;
                })()
        },
        series : [
            {
                name: 'IP',
                type: 'pie',
                radius : [15, 90],
                center: ['40%', '65%'],
                roseType: "radius",
                data:
                    (function () {
                        var res = [];
                        for(var i=0; i<meter_datas.length; i++){
                            res.push({
                                name: meter_datas[i]["_id"],
                                value: meter_datas[i]["count"]
                            });
                        }
                        return res;
                    })()
                ,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    instance_top_dst_ip.setOption(option_top);
    if(curr_type == "minute") {
        instance_traffic_timer_arr[5] = setInterval(function () {
            var last_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_dst_ip", curr_type);
            var data0 = option_top.series[0].data;
            var legend0 = option_top.legend.data;
            data0.splice(0, data0.length);
            legend0.splice(0, legend0.length);
            for (var i = 0; i < last_datas.length; i++) {
                data0.push({
                    name: last_datas[i]["_id"],
                    value: last_datas[i]["count"]
                });
                legend0.push(last_datas[i]["_id"]);
            }
            instance_top_dst_ip.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(instance_traffic_timer_arr[5]);
    }
}

function set_instance_top_src_port(tenant_id, instance_id, curr_type) {
    var meter_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_src_port", curr_type);
    var instance_top_src_port = echarts.init(document.getElementById("instance_top_src_port"));
    var option_top = {
        title : {
            text: '虚拟机流量源PORT分布--TOP 10',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            padding: [30, 10, 0, 0],
            data:
                (function () {
                    var res = [];
                    for(var i=0; i<meter_datas.length; i++){
                        res.push(meter_datas[i]["_id"]);
                    }
                    return res;
                })()
        },
        series : [
            {
                name: 'IP',
                type: 'pie',
                radius : [15, 90],
                center: ['40%', '65%'],
                roseType: "radius",
                data:
                    (function () {
                        var res = [];
                        for(var i=0; i<meter_datas.length; i++){
                            res.push({
                                name: meter_datas[i]["_id"],
                                value: meter_datas[i]["count"]
                            });
                        }
                        return res;
                    })()
                ,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    instance_top_src_port.setOption(option_top);
    if(curr_type == "minute") {
        instance_traffic_timer_arr[6] = setInterval(function () {
            var last_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_src_port", curr_type);
            var data0 = option_top.series[0].data;
            var legend0 = option_top.legend.data;
            data0.splice(0, data0.length);
            legend0.splice(0, legend0.length);
            for (var i = 0; i < last_datas.length; i++) {
                data0.push({
                    name: last_datas[i]["_id"],
                    value: last_datas[i]["count"]
                });
                legend0.push(last_datas[i]["_id"]);
            }
            instance_top_src_port.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(instance_traffic_timer_arr[6]);
    }
}

function set_instance_top_dst_port(tenant_id, instance_id, curr_type) {
    var meter_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_dst_port", curr_type);
    var instance_top_dst_port = echarts.init(document.getElementById("instance_top_dst_port"));
    var option_top = {
        title : {
            text: '虚拟机流量目的PORT分布--TOP 10',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            padding: [30, 10, 0, 0],
            data:
                (function () {
                    var res = [];
                    for(var i=0; i<meter_datas.length; i++){
                        res.push(meter_datas[i]["_id"]);
                    }
                    return res;
                })()
        },
        series : [
            {
                name: 'IP',
                type: 'pie',
                radius : [15, 90],
                center: ['40%', '65%'],
                roseType: "radius",
                data:
                    (function () {
                        var res = [];
                        for(var i=0; i<meter_datas.length; i++){
                            res.push({
                                name: meter_datas[i]["_id"],
                                value: meter_datas[i]["count"]
                            });
                        }
                        return res;
                    })()
                ,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    instance_top_dst_port.setOption(option_top);
    if(curr_type == "minute") {
        instance_traffic_timer_arr[7] = setInterval(function () {
            var last_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_dst_port", curr_type);
            var data0 = option_top.series[0].data;
            var legend0 = option_top.legend.data;
            data0.splice(0, data0.length);
            legend0.splice(0, legend0.length);
            for (var i = 0; i < last_datas.length; i++) {
                data0.push({
                    name: last_datas[i]["_id"],
                    value: last_datas[i]["count"]
                });
                legend0.push(last_datas[i]["_id"]);
            }
            instance_top_dst_port.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(instance_traffic_timer_arr[7]);
    }
}

function set_instance_top_session(tenant_id, instance_id, curr_type) {
    var meter_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_session", curr_type);
    var instance_top_session = echarts.init(document.getElementById("instance_top_session"));
    var option_top = {
        title : {
            text: '虚拟机流量Session排名--TOP 10',
            x:'center'
        },
        barWidth: '80%',
        tooltip : {
            trigger: 'axis',
            formatter: "{a} <br/>{b} : {c} KB"
        },
        xAxis : [
            {
                type : 'value',
                axisLabel: {
                    formatter: '{value} KB'
                }
            }
        ],
        yAxis : [
            {
                type : 'category',
                axisTick : {show: false},
                show : false,
                data : (function () {
                    var res = [];
                    for(var i=meter_datas.length-1; i>=0; i--) {
                        res.push(identify_protocol_port(meter_datas[i]["_id"]["ipprotocol"], meter_datas[i]["_id"]["srcport_or_icmptype"],
                                meter_datas[i]["_id"]["dstport_or_icmpcode"]) + "--" + identify_client_server(meter_datas[i]["_id"]["ipprotocol"],
                                meter_datas[i]["_id"]["ipsource"], meter_datas[i]["_id"]["srcport_or_icmptype"]) + "--" + identify_client_server(meter_datas[i]["_id"]["ipprotocol"],
                                meter_datas[i]["_id"]["ipdestination"], meter_datas[i]["_id"]["dstport_or_icmpcode"]));
                    }
                    return res;
                })()
            }
        ],
        series : [
            {
                name: 'Session',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}: {c} KB',
                        position: 'insideLeft',
                        color : '#eee'
                    }
                },
                data:
                    (function () {
                        var res = [];
                        for(var i=meter_datas.length-1; i>=0; i--){
                            res.push(new Number(meter_datas[i]["count"]/1024).toFixed(2));
                        }
                        return res;
                    })()
            }
        ]
    };
    instance_top_session.setOption(option_top);
    if(curr_type == "minute") {
        instance_traffic_timer_arr[8] = setInterval(function () {
            var last_datas = get_instance_statistics_data(tenant_id, instance_id, "instance_top_session", curr_type);
            var data0 = option_top.series[0].data;
            var yaxis0 = option_top.yAxis[0].data;
            data0.splice(0, data0.length);
            yaxis0.splice(0, data0.length);
            for (var i = last_datas.length-1; i >=0 ; i--) {
                data0.push(new Number(last_datas[i]["count"]/1024).toFixed(2));
                yaxis0.push(identify_protocol_port(last_datas[i]["_id"]["ipprotocol"], last_datas[i]["_id"]["srcport_or_icmptype"],
                        last_datas[i]["_id"]["dstport_or_icmpcode"]) + "--" + identify_client_server(last_datas[i]["_id"]["ipprotocol"],
                        last_datas[i]["_id"]["ipsource"], last_datas[i]["_id"]["srcport_or_icmptype"]) + "--" + identify_client_server(last_datas[i]["_id"]["ipprotocol"],
                        last_datas[i]["_id"]["ipdestination"], last_datas[i]["_id"]["dstport_or_icmpcode"]));
            }
            instance_top_session.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(instance_traffic_timer_arr[8]);
    }
}
