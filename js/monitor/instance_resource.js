//$(window).load(function(){$("#loading").hide();});
var ajaxbg = $("#loading_monitor,#background_monitor");
ajaxbg.show();
//createAndHideAlert(ajaxbg);
setTimeout("ajaxbg.hide()", 2000);

var instance_resource_timer_arr = [0, 0, 0, 0];

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
                    $(".monitor_rsc_tenant").append('<option value="' + tenants[i].id + '">' + tenants[i].name + '</option>');
                curr_tenant_id = tenants[0].id;
                if (monitor_tenant_id !=null && monitor_tenant_id.toString().length>1) {
                    curr_tenant_id = monitor_tenant_id;
                    $(".monitor_rsc_tenant option[value='" + curr_tenant_id + "']").attr("selected", true);
                }
            } else {
                createAndHideAlert("当前没有租户^.^!");
            }
            //主机的获取
            $.ajax({
                type: "GET",
                url: config["host"] + "/v1.0/admin/tenant/instances/" + curr_tenant_id + "?token=" + window.localStorage.token,
                success: function(data) {
                    // console.log(data);
                    var arr = [0, 0, 0, 0];
                    var servers = JSON.parse(data)['servers'];
                    if (servers.length != 0) {
                        for (var i = 0; i < servers.length; i++)
                            $(".monitor_rsc_cloud_host").append('<option value="' + servers[i].id + '">' + servers[i].name + '</option>');
                        curr_server_id = servers[0].id;
                        if (monitor_server_id !=null && monitor_server_id.toString().length>1) {
                            curr_server_id = monitor_server_id;
                            $(".monitor_rsc_cloud_host option[value='" + curr_server_id + "']").attr("selected", true);
                        }
                        preSetAjax(curr_server_id, curr_type, arr);
                    } else {
                        createAndHideAlert("该租户当前没有虚拟机^.^!");
                    }
                },
                error: function(data) {
                    createAndHideAlert("当前没有云主机或云主机信息获取失败！");
                }
            })},
        error: function(data) {
            createAndHideAlert("当前没有租户或租户信息获取失败！");
        }
    });

    //select事件
    $('.monitor_rsc_tenant').change(function() {
        ajaxbg.show();
        clear_timer_when_switch(instance_resource_timer_arr);
        var id = $(this).children('option:selected').val();
        $('.monitor_rsc_cloud_host').empty();
        curr_tenant_id = id;
        //主机的获取
        $.ajax({
            type: "GET",
            url: config["host"] + "/v1.0/admin/tenant/instances/" + curr_tenant_id + "?token=" + window.localStorage.token,
            success: function(data) {
                var arr = [0, 0, 0, 0];
                var servers = JSON.parse(data)['servers'];
                if (servers.length != 0) {
                    for (var i = 0; i < servers.length; i++)
                        $(".monitor_rsc_cloud_host").append('<option value="' + servers[i].id + '">' + servers[i].name + '</option>');
                    curr_server_id = servers[0].id;
                    if (monitor_server_id !=null && monitor_server_id.toString().length>1) {
                        curr_server_id = monitor_server_id;
                        $(".monitor_rsc_cloud_host option[value='" + curr_server_id + "']").attr("selected", true);
                    }
                    preSetAjax(curr_server_id, curr_type, arr);
                } else {
                    createAndHideAlert("该租户当前没有虚拟机^.^!");
                    setTimeout("ajaxbg.hide()", 2000);
                }
            },
            error: function(data) {
                createAndHideAlert("当前没有云主机或云主机信息获取失败！");
                setTimeout("ajaxbg.hide()", 2000);
            }
        });
    });

    //select事件
    $('.monitor_rsc_cloud_host').change(function() {
        ajaxbg.show();
        clear_timer_when_switch(instance_resource_timer_arr);
        var id = $(this).children('option:selected').val();
        var arr = [0, 0, 0, 0];
        curr_server_id = id;
        preSetAjax(curr_server_id, curr_type, arr);
    });
    //天时分改变
    $('#option1').click(function() {
        changeStatus(this);
        ajaxbg.show();
        curr_type = "minute";
        var arr = [0, 0, 0, 0];
        preSetAjax(curr_server_id, curr_type, arr);
    });
    $('#option2').click(function() {
        changeStatus(this);
        ajaxbg.show();
        curr_type = "hour";
        var arr = [0, 0, 0, 0];
        preSetAjax(curr_server_id, curr_type, arr);
    });
    $('#option3').click(function() {
        changeStatus(this);
        ajaxbg.show();
        curr_type = "day";
        var arr = [0, 0, 0, 0];
        preSetAjax(curr_server_id, curr_type, arr);
    });
});

function changeStatus(that) {
    for (var i = 1; i < 4; i++)
        $("#option" + i).removeClass("active");
    $(that).addClass("active");
}

function preSetAjax(id, curr_type, arr) {
    setAjax(id, curr_type, "cpu_util", arr);
    setAjax(id, curr_type, "memory.usage", arr);
    setAjax(id, curr_type, "disk.read.bytes.rate", arr);
    setAjax(id, curr_type, "disk.write.bytes.rate", arr);
    setAjax(id, curr_type, "network.incoming.bytes.rate", arr);
    setAjax(id, curr_type, "network.outgoing.bytes.rate", arr);
    setTimeout("ajaxbg.hide()", 2000);
}

function get_one_meter(id, curr_type, meter_name) {
    if(clear_timer("/monitor/instance_resource", instance_resource_timer_arr)){
        return;
    }
    var meter_data = "";
    $.ajax({
        type: "GET",
        url: config["host"] + "/v1.0/monitor/" + id + "/" + meter_name + "/" + curr_type + "?limit=1&token=" + window.localStorage.token,
        async: false,
        success: function (data) {
            meter_data = JSON.parse(data)[meter_name][0];
            var time_str = getTimeStr(meter_data.timestamp);
            var time_temp = "";
            //时间的转换
            if (curr_type != 'day') {
                time_temp = time_str.split(" ")[1];
            } else {
                time_temp = time_str.substr(0, 10);
            }
            meter_data.timestamp = time_temp;
            meter_data = JSON.stringify(meter_data);
        },
        error: function (data) {
            createAndHideAlert("信息获取失败！");
        }
    });
    return meter_data;
}

function setAjax(id, curr_type, meter_name, arr) {
    //  主机监控折线图： 1.CPU监控信息    2.磁盘读写信息  3.网络监控信息  4.接受速率监控信息
    //---------CPU监控信息
    $.ajax({
        type: "GET",
        url: config["host"] + "/v1.0/monitor/" + id + "/" + meter_name + "/" + curr_type + "?limit=50&token=" + window.localStorage.token,
        success: function(data) {
            var meter_datas = JSON.parse(data)[meter_name];
            if (meter_datas[0] != null && meter_datas[0] != "") {
                var temp_flag = "";
                for (var i = 0; i < meter_datas.length; i++) {
                    //------------时间格式的控制
                    // 返回数据为空的时间格式为前一个不空的数据的时间依次往后
                    if (meter_datas[i] == null) {
                        if (curr_type == 'minute') {
                            temp_flag = moment(temp_flag, "HH:mm:ss").subtract(10, "seconds").format("HH:mm:ss");
                        } else if (curr_type == 'hour') {
                            temp_flag = moment(temp_flag, "HH:mm:ss").subtract(30, "minute").format("HH:mm:ss");
                        } else {
                            temp_flag = moment(temp_flag, "YYYY-MM-DD").subtract(1, 'day').format("YYYY-MM-DD");
                        }
                        meter_datas[i] = {};
                        meter_datas[i].timestamp = temp_flag;
                        meter_datas[i].counter_volume = 0;
                    } else {
                        var time_str = getTimeStr(meter_datas[i].timestamp);
                        //时间的转换
                        if (curr_type != 'day')
                        {
                            temp_flag = time_str.split(" ")[1];
                        } else {
                            temp_flag = time_str.substr(0, 10);
                        }
                        meter_datas[i].timestamp = temp_flag;
                        //百分比转换
                        meter_datas[i].counter_volume = new Number(meter_datas[i].counter_volume).toFixed(2);
                    }
                }
                if (meter_name == "cpu_util") {
                    setCpu(id, curr_type, meter_name, meter_datas);
                }
                else if (meter_name == "network.incoming.bytes.rate" || meter_name == "network.outgoing.bytes.rate") {
                    if (meter_name == "network.incoming.bytes.rate")
                        arr[0] = meter_datas;
                    else
                        arr[1] = meter_datas;
                    if (arr[0] != 0 && arr[1] != 0)
                        setNet(id, curr_type, arr[0], arr[1]);
                }
                else if (meter_name == "disk.write.bytes.rate" || meter_name == "disk.read.bytes.rate") {
                    if (meter_name == "disk.read.bytes.rate")
                        arr[2] = meter_datas;
                    if (meter_name == "disk.write.bytes.rate")
                        arr[3] = meter_datas;
                    if (arr[2] != 0 && arr[3] != 0)
                        setDisk(id, curr_type, arr[2], arr[3]);
                }
                else {
                    setMem(id, curr_type, meter_name, meter_datas);
                }
                // createAndHideAlert(arr[0] + arr[1] + arr[2] + arr[3]);
                // 等待图片消失
                if ((arr[0] + arr[1] + arr[2] + arr[3]) != 0)
                    ajaxbg.hide();
            }
            else {
                var show_info = '<div id="content" class="col-md-12 monitor-chart" style="background:pink;width:220px;height:40px;text-align:center;padding-top:12px;position:absolute;left:40%;top:100px;z-index:0"><b>暂时没有数据!</b></div>';
                if (meter_name == "cpu_util" || meter_name == "memory.usage") {
                    if (meter_name == "cpu_util") {
                        showInfo_cpu();
                        $("#chart1").append(show_info);
                    } else {
                        showInfo_mem();
                        $("#chart2").append(show_info);
                    }

                } else if (meter_name == "network.incoming.bytes.rate" || meter_name == "disk.write.bytes.rate") {
                    var option = "";
                    var title = "";
                    if (meter_name == "network.incoming.bytes.rate") {
                        option = "chart4";
                        title = "网络监控信息";

                    } else if (meter_name == "disk.write.bytes.rate") {
                        option = "chart3";
                        title = "磁盘读写信息";

                    }
                    showInfo_disk_Net(option, title);
                }
                if (meter_name == "network.incoming.bytes.rate")
                    $("#chart4").append(show_info);
                else if (meter_name == "disk.write.bytes.rate")
                    $("#chart3").append(show_info);
            }
        },
        error: function(data) {
            createAndHideAlert("信息获取失败！");
        }
    });
}

//--------CPU没数据时显示信息
function showInfo_cpu() {
    var myChart1 = echarts.init(document.getElementById('chart1'));
    // 1.CPU监控信息
    var option1 = {
        // backgroundColor: 'grey',
        title: {
            text: 'CPU监控信息',
            left: 'center'
        },
        legend: {
            data: [{
                name: 'CPU使用率',
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
    myChart1.setOption(option1);
}
//--------Mem没数据时显示信息
function showInfo_mem() {
    var myChart2 = echarts.init(document.getElementById('chart2'));
    // 1.CPU监控信息
    var option2 = {
        // backgroundColor: 'grey',
        title: {
            text: '内存监控信息',
            left: 'center'
        },
        legend: {
            data: [{
                name: '内存使用率',
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
    myChart2.setOption(option2);
}
//--------磁盘和网络没有数据是显示
function showInfo_disk_Net(option, title) {
    var myChart3 = echarts.init(document.getElementById(option));
    // 3.网络监控信息
    var option3 = {
        // backgroundColor: 'grey',
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


//---------设置CPU信息
function setCpu(id, curr_type, meter_name, data) {
    var myChart1 = echarts.init(document.getElementById('chart1'));
    // 1.CPU监控信息
    var option1 = {
        // backgroundColor: 'grey',
        title: {
            text: 'CPU监控信息',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br>{a}: {c}%'
        },
        legend: {
            data: [{
                name: 'CPU使用率',
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
                (function (){
                    var res = [];
                    for(var i=data.length; i>=1; i--){
                        res.push(data[i-1].timestamp);
                    }
                    return res;
                })()
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: [0, '20%'],
            axisLabel: {
                formatter: '{value} %'
            }
        }],
        series: [{
            name: 'CPU使用率',
            type: 'line',
            stack: '总量',
            step: 'middle',
            smooth: true,
            data:
                (function (){
                    var res = [];
                    for(var i=data.length; i>=1; i--){
                        res.push(data[i-1].counter_volume);
                    }
                    return res;
                })()
        }]

    };
    myChart1.setOption(option1);
    if(curr_type == "minute") {
        instance_resource_timer_arr[0] = setInterval(function () {
                var meter_data = get_one_meter(id, curr_type, meter_name);
                var last_data = JSON.parse(meter_data);
                var data0 = option1.series[0].data;
                data0.shift();
                data0.push(last_data.counter_volume);
                option1.xAxis[0].data.shift();
                option1.xAxis[0].data.push(last_data.timestamp);
                myChart1.setOption(option1);
            }, 10000);
    }
    else {
        clearInterval(instance_resource_timer_arr[0]);
    }
}

//---------设置Mem信息
function setMem(id, curr_type, meter_name, data) {
    var myChart2 = echarts.init(document.getElementById('chart2'));
    // 1.CPU监控信息
    var option2 = {
        // backgroundColor: 'grey',
        title: {
            text: '内存监控信息',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br>{a}: {c}%'
        },
        legend: {
            data: [{
                name: '内存使用率',
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
                // [data[6].timestamp, data[5].timestamp, data[4].timestamp, data[3].timestamp, data[2].timestamp, data[1].timestamp, data[0].timestamp]
                (function (){
                    var res = [];
                    for(var i=data.length; i>=1; i--){
                        res.push(data[i-1].timestamp);
                    }
                    return res;
                })()
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: [0, '20%'],
            max: "100",
            axisLabel: {
                formatter: '{value} %'
            }
        }],
        series: [{
            name: '内存使用率',
            type: 'line',
            stack: '总量',
            smooth: true,
            step: 'middle',
            data:
                // [(data[6].counter_volume / (data[6].resource_metadata == undefined ? -1 : data[6].resource_metadata.memory_mb) * 100).toFixed(2), (data[5].counter_volume / (data[5].resource_metadata == undefined ? -1 : data[5].resource_metadata.memory_mb) * 100).toFixed(2), (data[4].counter_volume / (data[4].resource_metadata == undefined ? -1 : data[4].resource_metadata.memory_mb) * 100).toFixed(2), (data[3].counter_volume / (data[3].resource_metadata == undefined ? -1 : data[3].resource_metadata.memory_mb) * 100).toFixed(2), (data[2].counter_volume / (data[2].resource_metadata == undefined ? -1 : data[2].resource_metadata.memory_mb) * 100).toFixed(2), (data[1].counter_volume / (data[1].resource_metadata == undefined ? -1 : data[1].resource_metadata.memory_mb) * 100).toFixed(2), (data[0].counter_volume / (data[0].resource_metadata == undefined ? -1 : data[0].resource_metadata.memory_mb) * 100).toFixed(2)]
                (function (){
                    var res = [];
                    for(var i=data.length; i>=1; i--){
                        res.push((data[i-1].counter_volume / (data[i-1].resource_metadata == undefined ? -1 : data[i-1].resource_metadata.memory_mb) * 100).toFixed(2));
                    }
                    return res;
                })()
        }]

    };
    myChart2.setOption(option2);
    if(curr_type == "minute") {
        instance_resource_timer_arr[1] = setInterval(function () {
            var meter_data = get_one_meter(id, curr_type, meter_name);
            var last_data = JSON.parse(meter_data);
            var data0 = option2.series[0].data;
            data0.shift();
            data0.push((last_data.counter_volume / (last_data.resource_metadata == undefined ? -1 : last_data.resource_metadata.memory_mb) * 100).toFixed(2));
            option2.xAxis[0].data.shift();
            option2.xAxis[0].data.push(last_data.timestamp);
            myChart2.setOption(option2);
        }, 10000);
    }
    else {
        clearInterval(instance_resource_timer_arr[1]);
    }
}

//-----设置磁盘
function setDisk(id, curr_type, disk_reads, disk_writes) {
    //console.log(cpu_utils);
    var myChart3 = echarts.init(document.getElementById('chart3'));
    // 2.磁盘读写信息
    var option3 = {
        // backgroundColor: 'grey',
        title: {
            text: '磁盘读写信息',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br> {a0}: {c0} B/S<br>{a1}: {c1} B/S'
        },
        legend: {
            data: [{
                name: '磁盘读速率',
                icon: 'rect'
            }, {
                name: '磁盘写速率',
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
                // [disk_reads[6].timestamp, disk_reads[5].timestamp, disk_reads[4].timestamp, disk_reads[3].timestamp, disk_reads[2].timestamp, disk_reads[1].timestamp, disk_reads[0].timestamp]
                (function (){
                    var res = [];
                    for(var i=disk_reads.length; i>=1; i--){
                        res.push(disk_reads[i-1].timestamp);
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
            name: '磁盘读速率',
            type: 'line',
            // stack: '磁盘',
            smooth: true,
            step: 'middle',
            lineStyle: {
                normal: {
                    width: '2'
                }
            },
            data:
                // [disk_writes[6].counter_volume, disk_writes[5].counter_volume, disk_writes[4].counter_volume, disk_writes[3].counter_volume, disk_writes[2].counter_volume, disk_writes[1].counter_volume, disk_writes[0].counter_volume]
                (function (){
                    var res = [];
                    for(var i=disk_reads.length; i>=1; i--){
                        res.push(disk_reads[i-1].counter_volume);
                    }
                    return res;
                })()
        }, {
            name: '磁盘写速率',
            type: 'line',
            // stack: '磁盘',
            smooth: true,
            step: 'middle',
            lineStyle: {
                normal: {
                    width: '2',
                    color: '#0000ff'
                }
            },
            data:
                // [disk_reads[6].counter_volume, disk_reads[5].counter_volume, disk_reads[4].counter_volume, disk_reads[3].counter_volume, disk_reads[2].counter_volume, disk_reads[1].counter_volume, disk_reads[0].counter_volume]
                (function (){
                    var res = [];
                    for(var i=disk_writes.length; i>=1; i--){
                        res.push(disk_writes[i-1].counter_volume);
                    }
                    return res;
                })()
        }]
    };
    myChart3.setOption(option3);
    if(curr_type == "minute") {
        instance_resource_timer_arr[2] = setInterval(function () {
            var meter_data1 = get_one_meter(id, curr_type, "disk.read.bytes.rate");
            var meter_data2 = get_one_meter(id, curr_type, "disk.write.bytes.rate");
            var last_data1 = JSON.parse(meter_data1);
            var last_data2 = JSON.parse(meter_data2);
            var data0 = option3.series[0].data;
            var data1 = option3.series[1].data;
            data0.shift();
            data0.push(last_data1.counter_volume);
            data1.shift();
            data1.push(last_data2.counter_volume);
            option3.xAxis[0].data.shift();
            option3.xAxis[0].data.push(last_data1.timestamp);
            myChart3.setOption(option3);
        }, 10000);
    }
    else {
        clearInterval(instance_resource_timer_arr[2]);
    }
}

//-------设置网络
function setNet(id, curr_type, net_ins, net_outs) {
    var myChart4 = echarts.init(document.getElementById('chart4'));
    // 3.网络监控信息
    var option4 = {
        // backgroundColor: 'grey',
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
            // stack: '网速',
            smooth: true,
            step: 'middle',
            lineStyle: {
                normal: {
                    width: '2'
                }
            },
            data:
                // [net_ins[6].counter_volume, net_ins[5].counter_volume, net_ins[4].counter_volume, net_ins[3].counter_volume, net_ins[2].counter_volume, net_ins[1].counter_volume, net_ins[0].counter_volume]
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
            // stack: '网速',
            smooth: true,
            step: 'middle',
            lineStyle: {
                normal: {
                    width: '2',
                    color: '#0000ff'
                }
            },
            data:
                // [net_outs[6].counter_volume, net_outs[5].counter_volume, net_outs[4].counter_volume, net_outs[3].counter_volume, net_outs[2].counter_volume, net_outs[1].counter_volume, net_outs[0].counter_volume]
                (function (){
                    var res = [];
                    for(var i=net_outs.length; i>=1; i--){
                        res.push(net_outs[i-1].counter_volume);
                    }
                    return res;
                })()
        }]
    };
    myChart4.setOption(option4);
    if(curr_type == "minute"){
        instance_resource_timer_arr[3] = setInterval(function () {
            var meter_data1 = get_one_meter(id, curr_type, "network.incoming.bytes.rate");
            var meter_data2 = get_one_meter(id, curr_type, "network.outgoing.bytes.rate");
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
            myChart4.setOption(option4);
        }, 10000);
    }
    else {
        clearInterval(instance_resource_timer_arr[3]);
    }
}




