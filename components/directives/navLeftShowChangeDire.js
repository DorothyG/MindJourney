mj.directive("navLeftShowChange", function(){
  return{
    restrict: "A",
    link: function(scope, elem, attrs) {
        $(elem).click(function() {
          //改变被选中的颜色以及同胞的css属性
          // $(this).css("color", "#36C1B7")
          //         .find("a.second").css("color", "#36C1B7");
          $(this).parent().css("background-color", "#444d53").find("i.fa-angle-double-right").toggleClass("fa-angle-double-up");
          //$(this).parent().css({"background-color": "#444d53", "color": "#d6e4db"}).find("i.fa-angle-double-right").toggleClass("fa-angle-double-up");
          //.css("color", "#e9f7ee")
          $(this).parent().siblings(".itemLeft").css("background-color", "#67bd45").children("ul").removeClass("in");
          $(this).parent().siblings().children("a").find("i.fa-angle-double-up").removeClass("fa-angle-double-up");

          //进入动画
          var $li = $(this).siblings().find("li");
          //alert($li.text());
          for(var i=0;i<$li.length;i++){
            $li.eq(i).animate({right:'0'},i*25);
          }

          // 网上修补collapse插件的bug
          // event.stopPropagation();
          // var $this = $(this);
          //
          // var parent = $this.data('parent');
          // var actives = parent && $(parent).find('.collapse.in');
          //
          // // From bootstrap itself
          // if (actives && actives.length) {
          //   hasData = actives.data('collapse');
          //   //if (hasData && hasData.transitioning) return;
          //   actives.collapse('hide');
          // }
          //
          // var target = $this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); //strip for ie7
          //
          // $(target).collapse('toggle');
          //
        });
    }
  }
});
