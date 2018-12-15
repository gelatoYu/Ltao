$(function () {
    // 添加搜索记录

    // 1. 点击按钮获取输入值
    // 2. 非空判断 !search.trim()  先去空格 再 取反
    // 3. 获取之前的记录如果有就获取(getItem)转成数组JSON.parse 没有使用空数组
    // 4. 判断 值在数组中存不存在indexOf 存在把值删掉 splice
    // 5. 不存在或者删掉之后再往数组的前面添加 unshift
    // 6. 把数据保存到本地存储中 setItem 转成字符串JSON.stringfy()
    // 7. 重新调用查询刷新

    $('.search-btn').on('tap', function () {
        // 1. 点击按钮获取输入值
        var search = $('#input-search').val();
        // 2. 非空判断 !search.trim()  先去空格 再 取反
        if (!search.trim()) {
            alert('请输入查询内容');
            return;
        }
        // 3. 获取之前的记录如果有就获取(getItem)转成数组JSON.parse 没有使用空数组
        var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
        // 4. 判断 值在数组中存不存在indexOf 存在把值删掉 splice
        if (historyData.indexOf(search) != -1) {
            historyData.splice(historyData.indexOf(search), 1);
        }
        // 5. 不存在或者删掉之后再往数组的前面添加 unshift
        historyData.unshift(search);
        // 6. 把数据保存到本地存储中 setItem 转成字符串JSON.stringfy()
        localStorage.setItem('historyData', JSON.stringify(historyData));
        // 7. 重新调用查询刷新
        queryHistory();
        // 8. 加完了记录后跳到商品列表页面实现真实的商品搜索
        location = 'productlist.html?search='+search;
    });

    queryHistory();
    function queryHistory() {
        // 1. 获取本地存储中的数据 没有值设置为空数组
        var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
        // 2. 数据是一个数组 模板引擎要求对象 需要包装一下
        var data = {
            rows: historyData
        };
        console.log(data);

        // 3. 调用模板方法生成html
        var html = template('searchContentTpl', data);
        // 4. 把html渲染到ul里面
        $('.mui-card-content ul').html(html);
    }

    // 删除数据
    //1.点击删除标签
    $('.mui-card-content .mui-table-view').on('tap','.btn-delete',function () { 
        var index = $(this).data('index');
        console.log(index);
        //查询所有的历史记录
        var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
        //将点击的索引所对应的内容删除
        historyData.splice(index, 1);
        console.log(historyData);
        //删除后的数组保存到本地内存中
        localStorage.setItem('historyData',JSON.stringify(historyData));
        queryHistory();
     });

     // 4. 清空搜索记录
    // 1. 给清空按钮添加点击事件
     $('.mui-card-header').on('tap','.btn-clear',function () {
        localStorage.removeItem('historyData');
        queryHistory();
       });

});