mj.factory('AuthService', function ($http, $q, Session, $cookieStore,
                                    DOMAIN) {
    var authService = {};
    var deferred = $q.defer();

    authService.login = function (credentials) {
        return $http({
            method: "post",
            url: "http://localhost:80/sm/user/login",
            data: credentials
        }).then(function(response){
            var data = response.data;
            var rows = data.rows;
            if(data.success){
                //登陆成功跳转到首页
                console.log("login success");
                Session.create(rows.userCode);
                deferred.resolve(data);
                return deferred.promise;
            } else{
                //登录失败返回原界面
                $state.go("login");
                Materialize.toast("你输入的账号或者密码有误", 2000);
            }
            // alert(JSON.stringify(row));
        }).catch(function (err) {
            Materialize.toast("啊哦,系统出错了。。。", 2000);
            console.log(err);
        });
    };

    authService.getAuths = function () {
        var auth = [];
        var defer = $q.defer();
        if($cookieStore.get('loginUser')){
            // console.log($cookieStore.get('loginUser').userCode);
            if ($cookieStore.get('loginUser').userCode == 'admin') {
                $http.get("../sm/auth/dataList").then(function (response) {
                    var data = response.data;
                    for (var i = 0; i < data.rows.length; i++) {
                        auth.push(data.rows[i].authCode);
                    }
                    defer.resolve(auth);
                });
            } else {
                $http.get("../sm/user/userAuthList", $cookieStore.get('loginUser')._id).then(function (response) {
                    var data = response.data;
                    auth = data.rows;
                    defer.resolve(auth);
                });
            }
        }
        return defer.promise;
    }

    authService.isAuthenticated = function () {
        //确保返回值是布尔类型的
        // return !!Session.userId;
        return true;
    };

    authService.isAuthorized = function (authorizedRoles) {
        //如果角色数组不为空则将其赋值给局部变量
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    return authService;
});

mj.service("Session", function () {
    //建立一个会话,储存用户id和用户角色(后期添加userRole)
    this.create = function (userId) {
        // this.id = sessionId;
        this.userId = userId;
        this.userRole = "admin";
    };
    //销毁一个会话
    this.destroy = function () {
        // this.id = null;
        this.userId = null;
        this.userRole = "admin";
    };
    return this;
});