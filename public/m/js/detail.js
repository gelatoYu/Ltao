$(function () {


    var id = getQueryString('id');

    $.ajax({
        url: '/product/queryProductDetail',
        data: {
            id: id
        },
        success: function (data) {
            console.log(data);

            // 3. 这个返回数据data.size尺码是字符串 40-50字符串 把字符串转成数组
            // 3.1  拿到当前字符串最小值 data.size--40-50
            min = data.size.split('-')[0] - 0;
            max = data.size.split('-')[1];
            data.size = [];
            for (var i = min; i <= max; i++) {
                data.size.push(i);
            }
            console.log(data);
            var html = template('productInfoTpl', data);
            $('.productDetail').html(html);


            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
            // 6. 等轮播图结构出来了之后再初始化轮播图
            mui('.mui-slider').slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
            // 7. 数字框也是动态添加要手动初始化 
            mui('.mui-numbox').numbox();
            //给鞋子尺码加类,选中显示颜色
            $('.btn-size').on('tap', function () {
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                console.log($(this).addClass('mui-btn-warning'));

            });
        }

    });
    // 1. 给加入购物车按钮加事件
    // 2. 让尺码能够点击 给所有尺码加点击事件 切换active类名
    // 3. 获取选中尺码和数量
    // 4. 判断当前尺码和数量是否选中
    // 5. 没有选中使用mui.toast('消息提示框') 提示用户选择
    // 6. 调用API加入购车
    //    1. 传参设置productId:当前url获取id(作为全局变量) size:获取的尺码  num: 当前获取的数量
    //    2. type设置为post 提交 都是post
    //    3. 还需要登录 （先使用完整版登录 cookie都是一个网站是共享的）
    //    4. 返回错误信息表示未登录 跳转到登录页
    //    5. 如果成功跳转到购物车(未实现)
    //    6. 如果加入成功可以去完整版购物车查看 

    $('.add-car').on('tap',function () { 
        //获取选中尺码
        var size = $('.btn-size.mui-btn-warning').data('size');
        if(!size){
            mui.toast('请选择尺码',{ duration:2000, type:'div' });
            return false; 
        }
        var number = mui('.mui-numbox').numbox().getValue();
        if(!number){
            mui.toast('请选择数量',{ duration:2000, type:'div' });
            return false;
        }
        $.ajax({
            url:'/cart/addCart',
            data: {
                productId:id,
                num:number,
                size:size
            },
            type: 'post',
            success:function (data) { 
                console.log(data);
                if(data.success){
                    //登录
                    mui.confirm( '是否到购物车查看', '温馨提示', ['yes','no'],function (e) {
                        // 获取当前用户点击了左边的还是右边
        					console.log(e);
                            if(e.index == 0){
                                //点击了左边 跳转到购物车查看
                                location = 'buycar.html';
                            }else{
                                // 点击否就不看 表示还继续吗
        						mui.toast('继续剁手吧', { duration: 2000, type: 'div' });
                            }
        				
        						

                      });
                }else {
                    //没登录
                    location = 'login.html?returnUrl='+location.href;
                }
             }


        });
        
        
     });

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