$(function () {
    /*1. 注册功能
    	1. 点击注册按钮 进行 非空验证  （使用MUI验证代码）
    	2. 有很多表单挨个获取判断很麻烦 获取所有表单 循环遍历 只要有一个为空表示有错 提示用输入
    	3. 获取用户输入所有信息
    		验证手机是否合法
    		延迟用户名是否合法
    		验证2次密码是否一致
    		验证码是否一致
    */
    var vCode = '';
    //    1. 点击注册按钮 进行 非空验证
    $('.mui-input-group .btn-register').on('tap', function () {
        var check = true;
        // 2. 有很多表单挨个获取判断很麻烦 获取所有表单 循环遍历 只要有一个为空表示有错 提示用输入
        mui(".mui-input-group input").each(function () {
            console.log(this);

            //若当前input为空，则alert提醒 
            if (!this.value || this.value.trim() == "") {
                var label = this.previousElementSibling;
                mui.alert(label.innerText + "不允许为空");
                check = false;
                return false;
            }
        }); //校验通过，继续执行业务逻辑 
        if (check) {
            //判断手机号
            var mobile = $('.mobile').val();
            if (!(/^1[345678]\d{9}$/.test(mobile))) {
                mui.alert("您输入的手机号不合法");
                return false;
            }

            //判断用户名 用户名长度不能超过
            var username = $('.username').val();
            // if(!(/^[a-zA-Z0-9_-]{4,16}$/.test(username))){
            //     mui.alert("您输入的用户名不正确");
            //     return false;
            // }
            if (username.lenght > 10) {
                mui.alert("您输入的用户名太长,小于10位");
                return false;
            }

            //判断输入的密码
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            if (password1 != password2) {
                mui.alert("您输入的密码不一致");
                return false;
            }

            // 获取当前输入的验证码  小写的vcode是当前用户的输入  全局变量大写vCode按钮获取
            var vcode = $('.vcode').val();

            console.log(vCode);
            if (vCode != vcode) {
                mui.alert("您输入的验证码不一致");
                return false;
            }

            $.ajax({
                url: '/user/register',
                type: 'post',
                data: {
                    username: username,
                    password: password1,
                    mobile: mobile,
                    vCode: vCode
                },
                success: function (data) {
                    console.log(data);
                    if (data.success) {
                        //注册成功,返回登录页面登录
                        mui.toast('注册成功,将跳转到登录页面');
                        setTimeout(function () {
                            location = 'login.html?returnUrl=user.html';
                        }, 2000);

                    } else {
                        //注册失败,提示失败原因
                        mui.toast(data.message);
                    }
                }
            });
        }
    });


    //点击获取验证码,获取验证码
    $('.btn-getVcode').on('tap', function () {
        $.ajax({
            url: '/user/vCode',
            success: function (data) {
                console.log(data);
                vCode = data.vCode;
            }
        });
    });

});