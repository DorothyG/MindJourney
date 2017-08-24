mj.controller("navTopCtrl", function($http, $scope, $cookies, $cookieStore) {

    if($cookieStore.get("loginUser").userName){
        $scope.userName = $cookieStore.get("loginUser").userName;
    } else{
        $scope.userName = "未登录";
    }

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
        //
        // $scope.logout = function () {
        //     if($cookieStore.get("loginUser")){
        //         var userCode = $cookieStore.get("loginUser").userCode;
        //         $http.post("http://120.77.253.155/sm/user/logOut", userCode, {withCache: true})
        //             .then(function (response) {
        //                 $cookieStore.remove("loginUser");
        //                 $scope.userName = "未登录";
        //             }).catch(function (err) {
        //             console.log(err);
        //         })
        //     } else{
        //         Materialize.toast("对不起,你还没有登录", 4000);
        //     }
        // }
    }

  // 控制右侧窗口的隐藏和显示（加动画）
  //   $scope.windowRightShow = function(){
  //     jQuery("div#windowRight").slideToggle();
  //       clearInterval(shakeInterval);
  //   }
  //   var shakeInterval;
  //   $scope.avatorShake = function(){
  //       shakeInterval = setInterval(function(){
  //         jQuery("div#avator").fadeTo(1500, 0.3).fadeTo(1500, 1);
  //       }, 0);
  //   }
    
    // $scope.isLogin = function () {
    //     if($cookieStore.get("logInfo").isEmpty()){
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }


  //   function Log() {
  //       if($cookieStore.get("logInfo").userName == null){
  //           $scope.userName = "未登录";
  //       } else {
  //           $scope.userName = $cookieStore.get("logInfo").userName
  //       }
  //   }
  //
  //   $scope.logout = function(){
  //       var userCode = $cookieStore.get("logInfo").userCode;
  //       $http({
  //           method: "post",
  //           url: "http://120.77.253.155/sm/user/logOut",
  //           data:{
  //               userCode: userCode
  //           }
  //       }).then(function () {
  //           // alert("hdjsgfjdhs");
  //           $state.go("login");
  //           $scope.userName = "";
  //           $cookies.remove("logInfo");
  //       }).catch(function (err) {
  //           console.log(JSON.stringify(err));
  //       });
  //   }
  // }

//   var options = [
//       {selector: '#navTop', offser: 60}, callback: 'navFade()'}
//   ];
// function navFade() {
//     // $("#navTop").css("opacity", "-0.3");
// }
// Materialize.scrollFire(options);
);
