mj.controller("homeCtrl", function($scope, handleData){
  $(function () {
    //瀑布流插件初始化
    $("#waterfallList li").wookmark({
      container: $("#waterfallList"),
      align: "left",
      // offset: 20,
      itemWidth: 282,
      outerOffset: 10
    });
    //轮播初始化
    jQuery('#carouselBroadcast').carousel({
      interval: 3000
    });

    $(".curtain").fadeOut(2000);

  });

  //url前缀
  var commonUrl = "../id/announcement/";

  //页面加载完成之后加载数据
  $scope.loadAllData = function () {
    var promise = handleData.loadData("get", commonUrl + "datalist");
    promise.then(function (success) {
      $scope.announce = success;
      $(".loading").hide();
    }).then(function (err) {
      if(err != null){
        Materialize.toast("啊哦,出错了...", 3000);
        console.log(err);
      }
    });
  };
  $scope.loadAllData();

});
