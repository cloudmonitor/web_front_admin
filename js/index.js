$(function() {
    // $("#first_page").css({
    //     "color": "#fff",
    //     "background-color": "#428bca"
    // });
    // var chart_data;


    // $("#lagout").click(function() {
    //     $('#myModal').modal('toggle')
    //     window.localStorage.clear();
    //     // location.href = "#/";
    //     location.reload();
    // });


});

// function getDevice_info(tenantname) {
//     $.ajax({
//         type: "GET",
//         url: config["host"] + "/tenant/login?token=" + window.localStorage.token + "&tenantname=" + tenantname,
//         success: function(data) {
//             var data = JSON.parse(data);
//             // console.log(data);
//             window.localStorage.token = JSON.stringify(data.access.token);
//             //console.error("得到的localStorage  ::", window.localStorage.token);
//             window.localStorage.user = JSON.stringify(data.access.user);
//             $.ajax({
//                 type: "GET",
//                 url: config["host"] + "/limits?token=" + window.localStorage.token,
//                 success: function(data) {
//                     // var data = JSON.parse(data);
//                     // console.log(data);
//                     localStorage.limits = data;
//                     // createAndHideAlert(localStorage.limits);
//                     // console.warn("data", data);
//                     draw_charts(data);
//                 },
//                 error: function(data) {
//                     createAndHideAlert("信息获取失败");
//                     console.log(data);
//                 }
//             });
//         },
//         error: function(data) {
//             createAndHideAlert("信息获取失败");
//             console.log(data);
//         }
//     });
// }

//draw_charts(chart_data);
// function draw_charts(chart_data) {
//     var chart_info = JSON.parse(chart_data)["limits"]["absolute"];
//     // createAndHideAlert("ok");
//     // createAndHideAlert(chart_info);
//     //createAndHideAlert(chart_info.maxTotalInstances);
//     var myChart1 = echarts.init(document.getElementById('main1'));
//     //---------饼图一
//     var option1 = {
//         title: {
//             text: '云主机',
//             subtext: '使用率',
//             x: 'center'
//         },
//         tooltip: {
//             trigger: 'item',
//             formatter: "{a} <br/>{b} : {c} ({d}%)"
//         },
//         // legend: {     //     orient: 'vertical',     //     x: 'left',
//         //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']     // },
//         series: [{
//             name: '云主机',
//             type: 'pie',
//             radius: '40%',
//             center: ['50%', '50%'],
//             data: [{
//                 value: chart_info.totalInstancesUsed,
//                 name: '已使用'
//             }, {
//                 value: chart_info.maxTotalInstances - chart_info.totalInstancesUsed,
//                 name: '未使用'
//             }],
//             label: {
//                 normal: {
//                     show: false
//                 }
//             },
//             labelLine: {
//                 normal: {
//                     show: false,
//                 }
//             },
//             itemStyle: {
//                 emphasis: {
//                     shadowBlur: 10,
//                     shadowOffsetX: 0,
//                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                 }
//             }
//         }]
//     };

//     myChart1.setOption(option1);
// }
