$(function() {
    var form = layui.form;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 新密码不能跟原密码相同
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能跟原密码相同！';
            }
        },
        // 确认密码要跟新密码相同
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '确认密码跟新密码必须一致！'
            }
        }
    });

    // 发起请求时限提交密码的功能
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户密码失败！');
                }

                layui.layer.msg('更新用户密码成功！');

                $('.layui-form')[0].reset();
            }
        });
    });
})