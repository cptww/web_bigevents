$(function() {
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少数据
        cate_id: '', //文章分类的id
        state: '', //文章的状态
    };


    // 美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            var dt = new Date(date);

            var y = dt.getFullYear();
            var m = dt.getMonth() + 1;
            m = padZero(m);
            var d = dt.getDate();
            d = padZero(d);


            var hh = dt.getHours();
            hh = padZero(hh);
            var mm = dt.getMinutes();
            mm = padZero(mm);
            var ss = dt.getSeconds();
            ss = padZero(ss);

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;

        }
        // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 1、渲染列表
    // 发起ajax请求
    // 定义表格模板
    // 在请求成功后的回调函数中调用template函数
    // 将结果渲染进tbody中
    initTable();

    function initTable() {
        $.ajax({
            mathod: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                var htmlstr = template('tpl-tbody', res)
                console.log(res);
                $('tbody').html(htmlstr);
                initPage(res.total);
            }
        })
    }

    // 获取文章分类数据
    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败');
                }

                var htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr);
                // 通知layui.js重新渲染select
                form.render();
            }
        });
    }

    // 2、筛选
    // 为表单绑定submit事件
    // 获取下拉框的值
    // 根据获取的值更新q对象里对应的内容
    // 重新初始化表格
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });

    ///3、分页
    // 在html中定义一个容器存放分页内容
    // 查看layui文档-》内置模块-》分页
    // 引入页面模块laypage
    // 定义一个函数来调用laypage.render（）
    // 在参数对象中填写四个必备属性：elem、count、linit、curr
    // jump:切换分页的回调：触发条件：1、执行render方法时（first=true），2、切换分页时（first=false）
    // jump（）的参数：1、obj：当前分页的所有选项值(obj.curr:当前页；obj.limit:得到每页显示的条数)；2、first：回调函数的触发方式
    // 通过jump完成分页的切换表格内容也随之切换
    // 增加分页其他内容 layout属性：自定义排版
    // 在初始化表格成功后，调用这个函数
    function initPage(total) {
        laypage.render({
            elem: 'pageBox', //容器的ID
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排版
            limits: [2, 3, 5, 10], //每页条数的选择项
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit; //得到每页显示的条数
                // 这样就能通过发起ajax请求改变表格内容
                if (!first) { //防止死循环
                    initTable();
                }
            }
        });
    }


    // 4、删除
    // 为动态添加的删除按钮以委托的形式绑定点击事件
    // 设置弹出层
    // 发起ajax请求，根据id删除文章
    // 删除完成后重新渲染表格
    // 渲染表格之前，需要判断删除之后当前页码值是否有文章数据
    // 判断方法：删除之前，若当前页码对应的表格中只有一个按钮，则删除之后，表格就没有数据了，此时页码值需要减1，但是页码值最小只能是1
    $('body').on('click', '.btn-delete', function() {
        var len = $('.btn-length').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }

                    layer.msg('删除文章成功');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });

            layer.close(index);
        });

    });

    // 5、编辑
    // 为动态添加的编辑按钮以委托的形式绑定点击事件
    // 弹出层layer.open
    // 定义内容模板,并将其作为弹出层的属性content的属性值


    var indexEdit = null;
    $('tbody').on('click', '#btnEdit', function() {

        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章',
            content: $('#form-edit').html()
        });


        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败');
                }
                console.log('ok');
                form.val('form-pub', res.data);
            }
        });

    });
})