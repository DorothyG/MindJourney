mj.controller("navLeftCtrl", ['$scope', function($scope){
  jQuery(function(){
    jQuery("#studentManage").on("show.bs.collapse", function(){
      jQuery(this).css("background-color", "#000000");
      jQuery(this).parent().css("background-color", "#000000");
    });
    jQuery("#studentManage").on("hide.bs.collapse", function(){
      jQuery(this).css("background-color", "#8ecc14");
      jQuery(this).parent().css("background-color", "#8ecc14");
    });
  });

  //滚动条初始化
  $("#accordion").mCustomScrollbar({
    theme: "mininal-dark",
    scrollInertia: 550
  });

}]);
