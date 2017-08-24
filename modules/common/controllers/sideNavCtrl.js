mj.controller("sideNavCtrl", function ($http, $rootScope, $scope, $state, $cookies, $cookieStore) {
    // $scope.forCookie = function () {
    //     var interval = setInterval(function () {
    //         var cookie = $cookieStore.get("loginUser").userName;
    //         $scope.$apply(function () {
    //             $scope.userName = cookie;
    //         });
    //         if(cookie != null){
    //             clearInterval(interval);
    //         }
    //     }, 1000);
    // };
    // $scope.forCookie();

    $scope.logout = function () {
        var loginUser = $cookieStore.get("loginUser");
        if(loginUser != null){
            $cookieStore.remove("loginUser");
            $state.go("login");
            // $state.go("login");
            Materialize.toast("退出成功!", 3000);
        } else{
            Materialize.toast("对不起,你还没有登录", 4000);
        }
    }
});