mj.directive("sideNav", function () {
    return{
        restrict: "E",
        replace: true,
        templateUrl: "../../modules/common/views/sideNav.html",
        link: function (scope, elem, attrs) {
            $(function () {
                $(".button-collapse").sideNav({
                    edge: "right",
                    closeOnClick: true
                });
            });

            if($cookieStore.get("loginUser")){
                scope.userName = $cookieStore.get("loginUser").userName;
            } else{
                scope.userName = "未登录";
            }

            scope.logout = function () {
                if($cookieStore.get("loginUser")){
                    var userCode = $cookieStore.get("loginUser").userCode;
                    $http.post("http://120.77.253.155/sm/user/logOut", userCode, {withCache: true})
                        .then(function (response) {
                            $cookieStore.remove("loginUser");
                            scope.userName = "未登录";
                        }).catch(function (err) {
                        console.log(err);
                    })
                } else{
                    Materialize.toast("对不起,你还没有登录", 4000);
                }
            }
        }
    }
})