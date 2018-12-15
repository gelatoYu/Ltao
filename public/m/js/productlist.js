$(function () { 
    // 1.拿到参数鞋
    //2.查找API数据
    //3.创建列表模板,传入数据
    //4.渲染到页面

    //1.获取参数
    var search = decodeURI(location.search.split("=")[1]);
    console.log(search);
    //2.
    $.ajax({
        url:'/product/queryProduct',
        data:{
            page:1,//第几页
            pageSize:3,//每页大小
            proName:search//搜索的关键字
        },
        success:function (data) {  
            console.log(data);
            
            //调用模板
            var html = template('productListTpl',data);
            $('.product-list .content ul').html(html);
        }
    });
    




 });