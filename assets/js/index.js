$(function() {
    // 调用函数getUserInfo()
    getUserInfo();

    var layer = layui.layer;
    // 点击退出按钮，退出到登录页面
    (function() {
        // 确认是否退出
        $('#btnLogout').on('click', function() {
            layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
                //do something
                // 清除本地存储的taken
                // 退出到登录页面
                localStorage.removeItem('token');
                location.href = '/login.html'
                    // 关闭弹出层
                layer.close(index);
            });
        })
    })()
})

// 请求用户信息的函数getUserInfo()
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 响应成功的时候调用success回调函数
        // 响应失败的时候调用error回调函数
        // complete回调函数不管成功还是失败都会调用
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('身份认证失败');
            }

            // 渲染用户的头像函数renderAvatar
            renderAvatar(res.data);
            console.log(res);
        }
    });
}

function renderAvatar(user) {
    // 获取用户的名字
    var name = user.nickname || user.username;
    // 设置文字
    $('.welcome').html('欢迎你&nbsp;&nbsp;' + name);
    // 判断图片头像是否存在
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', 'user.user_pic').show();
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}