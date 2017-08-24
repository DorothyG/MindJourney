// mj.directive("fileMode", function () {
//     return {
//         restrict: "EA",
//         scope: {
//             setFileData: "&"
//         },
//         link: function (scope, elem, attrs) {
//             elem.on("change", function () {
//                 scope.$apply(function () {
//                     var val = elem[0].files[0];
//                     scope.setFileData({value: val});
//                 });
//             });
//         }
//     }
// });
mj.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            var file = [];

            element.bind('change', function(){
                scope.$apply(function(){
                    for(var i = 0; i < element[0].files.length; i++){
                        file.push(element[0].files[i]);
                    }
                    modelSetter(scope, file);
                    // modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);