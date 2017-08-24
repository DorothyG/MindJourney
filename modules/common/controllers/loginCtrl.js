//设置登录时候的cookies
mj.config(function ($cookiesProvider, $httpProvider) {
    $cookiesProvider.defaults.path = '/';
    //   domain: '120.77.253.155',
    //   secure: true
    // }
    // $httpProvider.defaults = {
    //     withCredentials: true
    // }
});

mj.controller("loginCtrl", function ($http, $rootScope, $scope, $cookies, $cookieStore, $state, $q, AuthService, AUTH_EVENTS) {
    $(function () {
        $scope.userName = "";
        $scope.password = "";
        angular.element("#navLeft").addClass("hidden");
        angular.element("#navTop").addClass("hidden");
        angular.element("#navSide").addClass("hidden");
        $(".curtain").fadeOut(2000);
        //logo和输入框渐现
        Materialize.fadeInImage('.loginLogo');
        $(".piece").fadeIn(2000);
    });

    //登录操作
    $scope.login = function (account, password) {
        var credentials = {
            userCode: account,
            userPwd: password
        };
        $("#loging").show();
        var promise = AuthService.login(credentials);
        promise.then(function (success) {
            if (success.success == true) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                //存储cookies
                $cookieStore.put("loginUser", success.rows);
                $state.go("index.home");
            } else {
                Materialize.toast("啊哦,网络出错了,请重试!", 3000);
                $scope.password = null;
                $("#loging").hide();
            }
        }, function () {
            Materialize.toast("啊哦,出错了。。。", 3000);
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
        javascript:void(0);
        // var promise = AuthService.login(credentials);
        // promise.then(function (success) {
        //存储cookies
        //     $cookieStore.put("loginUser", success);
        //     angular.element("#navLeft").removeClass("hidden");
        //     angular.element("#navTop").removeClass("hidden");
        //     angular.element("#navSide").removeClass("hidden");
        //     $state.go("home");
        // // });
    };
    // $scope.login = function(account, password){
    //     $http({
    //         method: "post",
    //         url: "http://120.77.253.155:80/sm/user/login",
    //         data:{
    //             userCode: account,
    //             userPwd: password
    //         }
    //     }).then(function(response){
    //         var data = response.data;
    //         // alert(JSON.stringify(response));
    //         var rows = data.rows;
    //             // "_id": row._id,
    //             // "userCode": row.userCode,
    //             // "userName": row.userName,
    //             // "age": row.age,
    //             // "memo": row.memo,
    //             // "sex": row.sex,
    //             // "telephone": row.telephone,
    //             // "shortTel": row.shortTel
    //         // var rowsAll = response.rows;
    //         if(data.success){
    //             //登陆成功跳转到首页
    //             //存储cookies
    //             angular.element("#navLeft").removeClass("hidden");
    //             angular.element("#navTop").removeClass("hidden");
    //             angular.element("#navSide").removeClass("hidden");
    //             $cookieStore.put("loginUser", rows);
    //             console.log("login success");
    //             console.log(rows);
    //             $state.go("home");
    //         } else{
    //             //登录失败返回原界面
    //             $scope.userName = "";
    //             $scope.password = "";
    //             $state.go("login");
    //             Materialize.toast("你输入的账号或者密码有误", 2000);
    //         }
    //         // alert(JSON.stringify(row));
    //     }).catch(function (err) {
    //         console.log(err);
    //     });
    // }
});