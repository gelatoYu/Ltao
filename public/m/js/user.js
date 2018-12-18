$(function () {
    /*退出登录功能
    		1. 点击退出登录 就调用退出登录的API接口
    		2. 退出成功就跳转到登录页面
    		3. 登录完成后要返回个人中心页面*/

    $('.btn-exit').on('tap',function () { 
        $.ajax({
            url:'/user/logout',
            success:function (data) {
                console.log(data);
                if(data.success){
                    //退出成功,跳转到登录页面
                    // location = 'login.html?returnUrl=index.html'
                    location = 'login.html?returnUrl='+location.href;
                }
              }
        });
     });

     /* 
	查询用户的信息 更新用户名和手机号
		1. 页面加载的时候马上请求查询用户信息的API
		2. 查询成功就渲染到用户名和手机号的里面
    */
    $.ajax({
        url:'/user/queryUserMessage',
        success:function (data) {
            console.log(data);
            if(data.error){
                //结果出现报错,显示未登录错误,跳回登录页面
                location = 'login.html?returnUrl='+location.href;
            }else{
                //成功查询到信息渲染到页面上
                $('.username').html(data.username);
                $('.mobile').html(data.mobile);

            }
          }
    });
});