$(function() {
    // 1、登录注册的切换
    (function() {
        // 点击“去注册”链接
        $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        });
        // 点击“去登陆”链接
        $('#link_login').on('click', function() {
            $('.login-box').show();
            $('.reg-box').hide();
        });
    })();
    // 2、自定义密码框的验证
    (function() {
        // 从layui中获取form对象
        var form = layui.form;
        // 通过form.verify()函数自定义效验规则
        form.verify({
            // 自定义了一个叫做pwd的规则
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 密码确认框的验证
            // value是表单的值，item的表单的DOM元素
            repwd: function(value, item) {
                // 获取密码框的值
                // 与确认密码框进行比较
                // 不相等就返回提示消息
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return "两次密码不一致！"
                }
            }
        });
    })();
    ///3、注册表单的提交事件
    var layer = layui.layer;
    (function() {
        $('#form_reg').on('submit', function(e) {
            // 阻止表单提交默认行为
            e.preventDefault();
            // 发起post请求
            var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录');
                $('#link_login').click();
            });
        })
    })();
    // 4、登录表单的提交事件
    (function() {
        $('#form_login').submit(function(e) {
            e.preventDefault();
            // 发起post请求
            $.ajax({
                method: 'POST',
                url: '/api/login',
                data: $('#form_login').serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }

                    layer.msg('登陆成功');
                    localStorage.setItem('token', res.token);
                    location.href = '/index.html'
                }
            });
        });
    })()

})