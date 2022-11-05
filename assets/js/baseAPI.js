$.ajaxPrefilter(function(option) {
    // 在发起真正的ajax请求之前，统一为拼接请求的根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url;
    // 统一为需要权限的请求添加headers属性
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = { Authorization: localStorage.getItem('token') || '' };

        // 统一为需要权限的请求挂载complete函数
        option.complete = function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
                // 强制清空token
                localStorage.removeItem('token');
                // 强制退回登录页面
                location.href = '/login.html';
            }
        }
    }

});