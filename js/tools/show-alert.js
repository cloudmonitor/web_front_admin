// 创建alert容器框
var createAlertContainer = function() {
    var containerAlert = document.createElement("div");
    $(containerAlert).attr({ "id": "alert-container" });
    $(containerAlert).css({
        "position": "fixed",
        "top": "70px",
        "right": "40px",
        "float": "right",
        "width": "300px",
        "z-index": "1100"
    });
    $("header").after(containerAlert);
}();
var createAndHideAlert = function(object) {
    // showAlert函数用来创建警告框
    var showAlert = (function(object) {
        // console.info("object = ", object);
        // 新建 a 元素
        var alertA = document.createElement("a");
        $(alertA).attr({
            "href": "#",
            "class": "close",
            "data-dismiss": "alert"
        });
        $(alertA).html("&times;");

        // 新建 div 元素
        var alertDIV = document.createElement("div");
        if ((typeof object) === 'string') {
            var str = object;
            var object = {};
            object.message = str;
            // console.info("object.message = ", object.message);
            object.className = "alert-danger";
        }
        // 如果object对象没有给className赋值，那就给他赋予默认值
        if (!object.className) {

            object.className = "alert-warning";
        }

        $(alertDIV).attr({
            "class": "alert fade in " + object.className
        });
        $(alertDIV).append(alertA);
        $(alertDIV).append(object.message)
        $("#alert-container").append(alertDIV);
        // console.info("当前对象： ", alertDIV);
        return alertDIV;
    })(object);
    // 为 alert 框添加可以关闭的功能
    $(showAlert).alert();
    var hide = function() {
        $(showAlert).alert('close');
    };
    if (!object.show) {
        setTimeout(hide, 3000);
    }
};
