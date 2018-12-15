$(function () {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });



    $.ajax({
        url: '/category/queryTopCategory',
        success:function (data) { 
            console.log(data);
            var html = template('categorLeftTpl',data);

            $('.category-left .mui-scroll-wrapper ul').html(html);
            
         }
    });

    $('.category-left .mui-scroll-wrapper ul').on('tap','li a',function () { 
        // 获取点击li下的id
        var id = $(this).data('id');
        console.log(id);
        querySecondCategory(id); 
        $(this).parent().addClass('active').siblings().removeClass('active');
     });
  });
  querySecondCategory(1); 
  function querySecondCategory(id) { 
    $.ajax({
        url:'/category/querySecondCategory',
        data:{id:id},
        success:function (data) { 
            console.log(data);
            
            var html = template('categoryRightTpl',data);
            $('.category-right ul').html(html);
         }
    });
   }
