$(function () {
    // 1.拿到参数鞋
    //2.查找API数据
    //3.创建列表模板,传入数据
    //4.渲染到页面

    //1.获取参数
    var search = getQueryString(search);
    console.log(search);
    //2.
    queryProduct()



    /*2. 商品列表的商品搜索功能
        1. 点击搜索按钮获取当前输入的值  
        2. 做非空判断
        3. 调用API传入当前要搜索的商品关键字
        4. 接受返回的商品数据 调用模板渲染页面
    */

    $('.search-form .search-btn').on('tap', function () {
        search = $('#input-search').val();
        if (!search.trim()) {
            alert('请输入要搜索的商品');
            return;
        }
        queryProduct()
    });



    /*3. 商品排序
		1. 如何排序 调用API传入参数进行排序 如果价格传入price 数量传入num
		2. 排序顺序 price=1升序 从小到大  price=2降序  从大到小
		3. 点击了排序按钮后 如果现在是升序(1) 点击了后变成降序(2)
		4. 在a标签默认存储一个排序顺序 默认1升序
		5. 点击后切换这个排序顺序的属性的值
		6. 还需要知道当前点击a排序方式是price还是num  获取a身上的排序方式
		7. 调用APi传入 传入对应排序方式和排序顺序即可 后面渲染页面
    */
    $('.product-list .product-title ul li a').on('tap', function () {
        // 3. 点击了排序按钮后 如果现在是升序(1) 点击了后变成降序(2)
        var sort = $(this).data('sort');
        sort = sort == 1 ? 2 : 1;
        $(this).data('sort', sort);
        // 6. 还需要知道当前点击a排序方式是price还是num  获取a身上的排序方式
        var sortType = $(this).data('sort-type');
        parmas = {
            page: 1,
            pageSize: 4,
            proName: search
        };
        parmas[sortType] = sort;
        console.log(parmas);

        $.ajax({
            url: '/product/queryProduct',
            data: parmas,
            success: function (data) {
                console.log(data);
                //渲染页面
                var html = template('productListTpl', data);
                $('.product-list .content ul').html(html);
            }
        });

    });
    /*4. 下拉刷新和上拉加载
        	1. 调用MUI的初始化方法初始化下拉刷新和上拉加载效果
        	2. 指定下拉刷新的回调函数 实现刷新数据
        	3. 调用MUI结束下拉刷新的效果不然会一直转
        	4. 指定上拉加载的回调函数加载更多数据
        	5. 定义一个page当前页码数 每次上拉把page++ 请求下一页数据(更多的数据)
        	6. 把数据渲染后追加到页面 使用append
        	7. 追加完成结束上拉加载效果
        	8. 判断当如果上拉没有数据的时候 要结束上拉并且提示没有数据了 传入一个true
        	9. 但是再次下拉的时候需要能够重新上拉所以下拉完了后要重置上拉加载效果
        	10. 而且page也要从头开始 重置为1
        */
    page = 1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50, //可选,默认50.触发下拉刷新拖动距离,
                // auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    setTimeout(function () {
                        queryProduct();
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        page = 1;
                    }, 1000);

                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            up: {
                height: 50, //可选.默认50.触发上拉加载拖动距离
                // auto:true,//可选,默认false.自动上拉加载一次
                contentrefresh: "小弟正在拼命加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    setTimeout(function () {
                        page++;
                        $.ajax({
                            url: '/product/queryProduct',
                            data: {
                                page: 1, //第几页
                                pageSize: 4, //每页大小
                                proName: search //搜索的关键字
                            },
                            success: function (data) {
                                console.log(data);
                                if (data.data.length > 0) {
                                    //调用模板
                                    var html = template('productListTpl', data);
                                    //追加到模板中
                                    $('.product-list .content ul').append(html);
                                    // 7.3 加载完成后结束上拉加载的效果 MUI 结束上拉的函数endPullupToRefresh
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                } else {
                                    // 8. 没有长度提示没有数据 了 endPullupToRefresh提示没有数据传人一个true
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }                       
                            }
                        });
                    }, 1000);
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });

    /*5. 点击立即购买跳转到商品详情去购买商品
	    1. 给所有购买按钮添加点击事件
	    2. 获取当前点击商品id 
	    3. 使用location跳转商品详情页面  把id作为参数传递到商品详情
	    */

        $('.product-list').on('tap','.btn',function () { 
            // 获取id
            var id = $(this).data('id');
            //将页面跳转到商品详情页面,并将id传过去
            location = 'detail.html?id='+id;
         });


    function queryProduct() {
        $.ajax({
            url: '/product/queryProduct',
            data: {
                page: 1, //第几页
                pageSize: 4, //每页大小
                proName: search //搜索的关键字
            },
            success: function (data) {
                console.log(data);

                //调用模板
                var html = template('productListTpl', data);
                $('.product-list .content ul').html(html);
            }
        });
    }


    // 根据url参数名取值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        // console.log(r);
        if (r != null) {
            //转码方式改成 decodeURI
            return decodeURI(r[2]);
        }
        return null;
    }
});