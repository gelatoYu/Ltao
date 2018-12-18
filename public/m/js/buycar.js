$(function () {
     /* 
    1. 动态渲染购物车的商品信息
    	1. 页面加载请求购物车的商品的数据  请求查询购物车的API接口 带分页的
    	2. 创建购物车列表模板 渲染模板
    */
    queryBuycar();
    var page = 1;
    /* 2.初始化上拉下拉*/
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                // height:50,//可选,默认50.触发下拉刷新拖动距离,
                // // auto: true,//可选,默认false.首次加载自动下拉刷新一次
                // contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                // contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                // contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    setTimeout(function () {
                        queryBuycar();
                        // 4. 结束下拉刷新的效果(不结束会一直转) 在官方文档函数后 多加一个 ToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 11. 下拉结束后重置上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 12. 把page也要重置为1
                        page = 1;

                    }, 1000);
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            up: {
                callback: function () {
                    setTimeout(function () {
                        // 上拉加载的回调函数让page++
                        page++;
                        $.ajax({
                            url: '/cart/queryCartPaging',
                            data: {
                                page: page,
                                pageSize: 4
                            },
                            success: function (data) {
                                console.log(data);
                                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                                if (data.error) {
                                    location = 'login.html?returnUrl=' + location.href;
                                } else {
                                    //如果购物车为空,将数组转为对象
                                    if (data instanceof Array) {
                                        data = {
                                            data: data
                                        }
                                    }
                                    if (data.data.length > 0) {
                                        var html = template('buycarTpl', data);
                                        $('.mui-scroll .buy-list').append(html);
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                    }else{
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }

                                }
                            }
                        });
                    }, 1000);
                }
            }
        }
    });
    
    /*3.商品选中计算总金额*/
    
    
    // 把请求购物车商品数据函数封装起来
    function queryBuycar() {
        $.ajax({
            url: '/cart/queryCartPaging',
            data: {
                page: 1,
                pageSize: 4
            },
            success: function (data) {
                console.log(data);

                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                if (data.error) {
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                    //如果购物车为空,将数组转为对象
                    if (data instanceof Array) {
                        data = {
                            data: data
                        }
                        console.log(data);

                    }
                    var html = template('buycarTpl', data);
                    $('.mui-scroll .buy-list').html(html);
                }
            }

        });
    }
    
});