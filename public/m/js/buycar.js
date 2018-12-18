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
                                            } else {
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

            /*3.商品选中计算总金额
                3.1 当复选框选择发生变化的时候要获取购物车内产品的价钱和数量
                3.2 计算总额 价钱*数量累加
                3.3 渲染到页面中
            */
            //1.选中变化事件
            $('.buy-list').on('change', '.choose', function () {
                // console.log(this);
                //获取所有选中的复选框
                var checkeds = $('.choose:checked');
                console.log(checkeds);

                //遍历,获取
                var sum = 0;
                checkeds.each(function (index, value) {
                    console.log(value);
                    //dom对象转换成
                    var price = $(value).data('price');
                    var num = $(value).data('num');
                    var count = price * num;
                    sum = sum + count;
                    console.log(sum.toFixed(2));

                });
                $('#order .order-total span').html(sum.toFixed(2));
            });

            /* 4.删除列表里的产品
                1.点击删除按钮,问客户是否确认删除
                2.确认删除,绑定id,发送请求删除数据,刷新页面,
                3.取消,改变位移变化            
            */
        //    1.点击删除按钮,问客户是否确认删除
           
            $('.buy-list').on('tap','.btn-delete',function () { 
                var that = this;
                mui.confirm( '确定不要我了吗', '温馨提示', ['yes','no'], function (e) { 
                    console.log(that);
                    if(e.index==0){
                        //确定不要了
                        var id = $(that).data('id');
                        $.ajax({
                            url:'/cart/deleteCart',
                            data:{id:id},
                            success:function (data) {
                                console.log(data);
                                if(data.success){
                                    //没有报错
                                    queryBuycar();
                                }else{
                                    //报错退回
                                    mui.swipeoutClose($(that).parent().parent()[0]);
                                }
                              }
                        });
                    }else if(e.index==1){
                        // 8.3 使用MUI官方提供函数 是MUI调用的  而且参数是a的父元素的父元素  必须的DOM对象
                        mui.swipeoutClose($(that).parent().parent()[0]);
                    }
                 });
             })

             /* 5.编辑商品列表里的内容
                    1. 点击编辑按钮,弹出确认框
                    2. 把商品尺码数量 的代码放到确认框里面
                    3. 准备一个尺码和数量的模板
                    4. 需要所有尺码 当前尺码 所有数量 当前数量  传入模板里面
                    5. 把模板生成 放到确认框的内容里面
             
             */
            $('.buy-list').on('tap','.btn-edit',function () {
                var that = this;
                var productList = $(this).data('product');
                    

                    //鞋码,需要提取然后遍历
                    var min = productList.productSize.split('-')[0]-0;
                    var max = productList.productSize.split('-')[1];
                    var productSize = [];
                    for(var i = min;i<=max;i++){
                        productSize.push(i);
                    }
                    //将鞋码加入productList中
                    productList.productSize = productSize;
                    console.log(productList)
                    var html = template('editTpl',productList);
                    // 去掉标签之间的回车换行,避免自动添加br标签,使其有间隙
                    html = html.replace(/[\r\n]/g,'');
                    // 渲染到确认框中
                    mui.confirm( html, '温馨提示', ['确认','取消'],function (e) { 
                        if(e.index==0){
                            //确认编辑
                            //将修改的内容进行修改,渲染到页面
                            $.ajax({
                                url:'/cart/updateCart',
                                data:{
                                    id:productList.id,
                                    num:mui('.mui-numbox').numbox().getValue(),
                                    size:$('.btn-size.mui-btn-warning').data('size')
                                },
                                type:'post',
                                success:function (data) {
                                    console.log(data);
                                    if(data.success){
                                        //成功修改,刷新页面
                                        queryBuycar();
                                    }else{
                                        mui.swipeoutClose($(that).parent().parent()[0]);
                                        //并提示什么原因
                                        mui.alert(data.message,'温馨提示', '确认');
                                        // mui.toast(data.message);
                                    }
                                  }
                            });
                        }else if(e.index==1){
                            //取消编辑
                            mui.swipeoutClose($(that).parent().parent()[0]);
                        }
                    
                 });
                // 7.2 初始化的时候 默认给赋值为当前选择的数量
                mui('.mui-numbox').numbox().setValue(productList.num);
                // 7.3 尺码默认也是不能点击的手动初始化
                $('.btn-size').on('tap', function () {
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                    console.log($(this).addClass('mui-btn-warning'));
    
                });
              });

            // 把请求购物车商品数据函数封装起来
            function queryBuycar() {
                $.ajax({
                        url: '/cart/queryCartPaging',
                        data: {
                            page: 1,
                            pageSize: 4
                        },
                        beforeSend:function () { 
                            $('.loading').show();
                         },
                        complete:function () { 
                            $('.loading').hide();
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