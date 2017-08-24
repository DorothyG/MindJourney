mj.directive("markdownInitialized", function(){
  return{
    restrict: 'A',
    link: function(){
      $(function(){
        $("#textEditor").markdown({
          autofocus: true,
          savable: true,
          iconlibrary: "fa",
          language: "zh"
        });
      });
    }
  }
});
