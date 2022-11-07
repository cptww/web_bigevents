$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();

    // 2、初始化富文本编辑器
    initEditor();

    // 3、图片裁剪区域
    // 初始化图片裁剪器
    var $image = $('#image')

    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 初始化裁剪区域
    $image.cropper(options)


    // 4、更换头像
    // 在HTML中设置一个隐藏的文件选择框
    // 点击选择封面按钮，就打开文件选择框
    // 设置监听文件选择框改变事件
    // 判断文件是否上传（长度不为0）
    // 有文件则按照素材更换图像
    $('#btnChooseImg').on('click', function() {
        $('#coverFile').click();
    });
    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 5、上传文章
    // 为表单绑定提交事件
    // 阻止默认事件
    // 准备发布文章请求的数据
    // 定义状态默认值为“已发布”
    // 一旦点击草稿按钮，状态改为“草稿”
    // FormData快速获得表单数据
    // 将裁剪后的图片输出为文件
    // 将其他属性追加到fd对象中
    // 发起Ajax请求
    var state = "已发布";
    $('#btnSave').on('click', function() {
        state = '草稿';
    });

    $('#form-pub').on('submit', function(e) {
        e.preventDefault();

        var fd = new FormData($(this)[0]);

        fd.append('state', state);

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                publishPage(fd);
            })


    });

    function publishPage(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }

                layer.msg('发布文章成功');
                location.href = '/article/article_list.html';
            }
        });
    }

    // 1、定义加载文章分类的方法
    // 发起ajax请求
    // 定义模板
    // 调用template()函数
    // 生成的html代码插入下拉选择框
    // form.render()提醒layui渲染渲染下拉选择框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败');
                }

                layer.msg('获取分类列表成功');

                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    }
})