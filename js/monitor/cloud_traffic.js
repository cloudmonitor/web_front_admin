/**
 * Created by lwj on 2016/12/18.
 */
var ajaxbg = $("#loading_monitor,#background_monitor");
ajaxbg.show();
setTimeout("ajaxbg.hide()", 2000);
var cloud_traffic_timer_arr =  [0, 0, 0, 0, 0, 0, 0, 0, 0];

$(function () {
    $('#option1').click();
    var curr_type = "minute";
    cloud_traffic_statistics(curr_type);


    //天时分改变
    $('#option1').click(function() {
        changeStatus(this);
        curr_type = "minute";
        cloud_traffic_statistics(curr_type)
    });
    $('#option2').click(function() {
        changeStatus(this);
        curr_type = "hour";
        cloud_traffic_statistics(curr_type)
    });
    $('#option3').click(function() {
        changeStatus(this);
        curr_type = "day";
        cloud_traffic_statistics(curr_type);
    });
});


function cloud_traffic_statistics(curr_type) {
    ajaxbg.show();
    setTimeout("ajaxbg.hide()", 2000);
    set_cloud_top_tenant(curr_type);
    set_cloud_top_instance(curr_type);
    set_cloud_top_protocol_port(curr_type);
    set_cloud_top_ip_link(curr_type);
    set_cloud_top_src_ip(curr_type);
    set_cloud_top_dst_ip(curr_type);
    set_cloud_top_src_port(curr_type);
    set_cloud_top_dst_port(curr_type);
    set_cloud_top_session(curr_type);
}

function changeStatus(that) {
    for (var i = 1; i < 4; i++)
        $("#option" + i).removeClass("active");
    $(that).addClass("active");
}

function get_cloud_traffic_statistics_data(data_type, curr_type) {
    if(clear_timer("/monitor/cloud_traffic", cloud_traffic_timer_arr)){
        return;
    }
    var meter_datas = "";
    $.ajax({
        type: "GET",
        url: config["host"] + "/v1.0/monitor/" + data_type +"/" + curr_type + "?token=" + window.localStorage.token,
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

function set_cloud_top_tenant(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_tenant", curr_type);
    var cloud_top_tenant = echarts.init(document.getElementById("cloud_top_tenant"));
    var option_top = {
        title : {
            text: '云平台租户流量--TOP 10',
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
                        res.push(meter_datas[i]["_id"]["tenant_name"]);
                    }
                    return res;
                })()
        },
        series : [
            {
                name: '租户流量',
                type: 'pie',
                radius : [15, 90],
                center: ['40%', '65%'],
                data:
                    (function () {
                        var res = [];
                        for(var i=0; i<meter_datas.length; i++){
                            res.push({
                                name: meter_datas[i]["_id"]["tenant_name"],
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
    cloud_top_tenant.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[0] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_tenant", curr_type);
            var data0 = option_top.series[0].data;
            var legend0 = option_top.legend.data;
            data0.splice(0, data0.length);
            legend0.splice(0, legend0.length);
            for (var i = 0; i < last_datas.length; i++) {
                data0.push({
                    name: last_datas[i]["_id"]["tenant_name"],
                    value: last_datas[i]["count"]
                });
                legend0.push(last_datas[i]["_id"]["tenant_name"]);
            }
            cloud_top_tenant.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[0]);
    }
}

function set_cloud_top_instance(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_instance", curr_type);
    var cloud_top_instance = echarts.init(document.getElementById("cloud_top_instance"));
    var option_top = {
        title : {
            text: '云平台虚拟机流量--TOP 10',
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
                        res.push(meter_datas[i]["_id"]["instance_name"]);
                    }
                    return res;
                })()
        },
        series : [
            {
                name: '虚拟机流量',
                type: 'pie',
                radius : [15, 90],
                center: ['40%', '65%'],
                data:
                    (function () {
                        var res = [];
                        for(var i=0; i<meter_datas.length; i++){
                            res.push({
                                name: meter_datas[i]["_id"]["instance_name"],
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
    cloud_top_instance.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[1] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_instance", curr_type);
            var data0 = option_top.series[0].data;
            var legend0 = option_top.legend.data;
            data0.splice(0, data0.length);
            legend0.splice(0, legend0.length);
            for (var i = 0; i < last_datas.length; i++) {
                data0.push({
                    name: last_datas[i]["_id"]["instance_name"],
                    value: last_datas[i]["count"]
                });
                legend0.push(last_datas[i]["_id"]["instance_name"]);
            }
            cloud_top_instance.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[1]);
    }
}

function set_cloud_top_ip_link(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_ip_link", curr_type);
    var cloud_top_ip_link = echarts.init(document.getElementById("cloud_top_ip_link"));
    var option_top = {
        title : {
            text: '云平台流量源IP-目的IP--TOP 10',
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
    cloud_top_ip_link.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[2] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_ip_link", curr_type);
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
            cloud_top_ip_link.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[2]);
    }
}

function set_cloud_top_protocol_port(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_protocol_port", curr_type);
    var cloud_top_protocol_port = echarts.init(document.getElementById("cloud_top_protocol_port"));
    var option_top = {
        title : {
            text: '云平台流量协议-目的端口--TOP 10',
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
    cloud_top_protocol_port.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[3] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_protocol_port", curr_type);
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
            cloud_top_protocol_port.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[3]);
    }
}

function set_cloud_top_src_ip(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_src_ip", curr_type);
    var cloud_top_src_ip = echarts.init(document.getElementById("cloud_top_src_ip"));
    var option_top = {
        title : {
            text: '云平台流量源IP分布--TOP 10',
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
    cloud_top_src_ip.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[4] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_src_ip", curr_type);
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
            cloud_top_src_ip.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[4]);
    }
}

function set_cloud_top_dst_ip(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_dst_ip", curr_type);
    var cloud_top_dst_ip = echarts.init(document.getElementById("cloud_top_dst_ip"));
    var option_top = {
        title : {
            text: '云平台流量目的IP分布--TOP 10',
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
    cloud_top_dst_ip.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[5] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_dst_ip", curr_type);
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
            cloud_top_dst_ip.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[5]);
    }
}

function set_cloud_top_src_port(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_src_port", curr_type);
    var cloud_top_src_port = echarts.init(document.getElementById("cloud_top_src_port"));
    var option_top = {
        title : {
            text: '云平台流量源端口分布--TOP 10',
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
    cloud_top_src_port.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[6] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_src_port", curr_type);
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
            cloud_top_src_port.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[6]);
    }
}

function set_cloud_top_dst_port(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_dst_port", curr_type);
    var cloud_top_dst_port = echarts.init(document.getElementById("cloud_top_dst_port"));
    var option_top = {
        title : {
            text: '云平台流量目的端口分布--TOP 10',
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
    cloud_top_dst_port.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[7] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_dst_port", curr_type);
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
            cloud_top_dst_port.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[7]);
    }
}

function set_cloud_top_session(curr_type) {
    var meter_datas = get_cloud_traffic_statistics_data("cloud_top_session", curr_type);
    var cloud_top_session = echarts.init(document.getElementById("cloud_top_session"));
    var option_top = {
        title : {
            text: '云平台流量协议Session--TOP 10',
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
    cloud_top_session.setOption(option_top);
    if(curr_type == "minute") {
        cloud_traffic_timer_arr[8] = setInterval(function () {
            var last_datas = get_cloud_traffic_statistics_data("cloud_top_session", curr_type);
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
            cloud_top_session.setOption(option_top);
        }, 5000);
    }
    else {
        clearInterval(cloud_traffic_timer_arr[8]);
    }
}



