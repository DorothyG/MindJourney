mj.directive("waterfallAndLines", function(){
  return{
    restrict: "A",
    link: function(scope, elem, attrs) {
        $(elem).click(function() {
          $("div#waterfall").toggle();
          $("div#lines").toggle();
        });
      }
    }
});
