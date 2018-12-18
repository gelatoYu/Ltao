$(function () {
    /* 
    	1. 实现登录功能
    		1. 点击登录的时候获取用户名和密码
    		2. 进行非空判断
    		3. 调用的APi 传入 当前用户名和密码
    		4. 获取后台返回登录结果  成功就返回上一页去继续加入购物车
    		5. 如果失败就提示用户输入正确的用户名和密码
    */
    // 1. 点击登录的时候获取用户名和密码
    $('.btn-login').on('tap', function () {
        var username = $('.username').val();
        console.log(username);
        // 2. 进行非空判断
        if (!username) {
            mui.toast('请输入用户名', {
                duration: '2000',
                type: 'div'
            });
            return false;
        }

        var password = $('.password').val();
        console.log(password);
        // 2. 进行非空判断
        if (!password) {
            mui.toast('请输入密码', {
                duration: '2000',
                type: 'div'
            });
            return false;
        }

        // 3. 调用的APi 传入 当前用户名和密码
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                console.log(data);
                if (data.success) {
                    //如果登录成功,跳转上一页面
                    // 6. 成功 成功返回到上一页继续去购买
                    // 6.1 接收当前登录成功需要返回的地址
                    var returnUrl = getQueryString('returnUrl');
                    console.log(returnUrl);
                    location = returnUrl;

                } else {
                    //失败则继续提示
                    mui.toast(data.message, {
                        duration: '2000',
                        type: 'div'
                    });
                }
            }
        });
    });
    //如果用户没有注册,则点击注册跳转到注册页面
    $('.btn-register').on('tap', function () {
        location = 'register.html';
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