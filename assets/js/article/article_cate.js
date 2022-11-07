$(function() {
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败');
                }
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);

            }
        });
    }
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    //表单标签 事件委托的形式绑定提交事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.close(indexAdd);
                    return layer.msg('新增文章分类失败');
                }

                initArtCateList();
                layer.close(indexAdd);
            }
        });
    })

    // 编辑按钮事件委托的形式绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        });
    });

    // 编辑功能
    // 修改分类表单委托submit事件
    // 发起ajax请求更改数据
    // 重新渲染表格
    // 关闭弹窗
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }

                layer.msg('更新分类数据成功');
                initArtCateList();
                layer.close(indexEdit);
            }
        });
    });

    // 删除功能
    // 为删除按钮委托click事件
    // 弹出询问提示框（confirm）
    // 发起ajax请求根据id删除数据
    // 渲染页面
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 确认删除之后的交互内容
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章类型失败');
                    }

                    layer.msg('删除文章类型成功');

                    initArtCateList();
                }
            });
            layer.close(index);
        });
    })
})