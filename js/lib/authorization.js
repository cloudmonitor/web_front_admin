$(function() {
    var flag = localStorage.login_flag;
    if (flag != undefined && flag != "") {
        if (flag == "token") {
            createAndHideAlert("请先登录！");
        } else if (flag == "expires") {
            createAndHideAlert("凭证过期,请重新登录！");
        } else {
            createAndHideAlert("长时间未操作,请重新登录！");
        }
        localStorage.clear();
    }
});
