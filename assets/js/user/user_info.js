$(function() {
    layui.form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度必须在1~6个字符之间！"
            }
        }
    });
    var layer = layui.layer;
    var form = layui.form;
    // 初始化表单数据 initUserInfo函数
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                form.val("formUserInfo", res.data);
                // 快速为表单元素赋值
                // form.val('filter', object)：用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。第二个参数中的键值是表单元素对应的 name 和 value。

            }
        });
    }

    $('#btnReset').on('click', function(e) {
        // 阻止表单默认清空的行为
        e.preventDefault();
        // 重新内调用为表单赋值函数
        initUserInfo();
    });

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交事件
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }

                layer.msg('更新用户信息成功');
                // 更新文字头像区域
                // 子页面调用父页面的方法
                // window.parent.xxx();
                window.parent.getUserInfo();
            }
        });
    });
})