$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 点击上传按钮上传文件
    $('#btnChooseImage').on('click', function() {
        // 触发点击文件上传事件
        // 手动点击文件上传事件
        // file.click();
        $('#file').click();
    });

    // 监听文件的change事件
    $('#file').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return layui.layer.msg('请选择图片');
        }

        // 更换图片 
        // 获取新图片
        var file = files[0];
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        $image.cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });

    // 为确定按钮，绑定点击事件
    $('#btnUpload').on('click', function() {
        // 获取剪裁的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 发起ajax请求将头像提交到服务器
        console.log(dataURL);
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败');
                }

                layui.layer.msg('更新头像成功');
                // 更新主页头像
                window.parent.getUserInfo();
            }
        });
    });
})