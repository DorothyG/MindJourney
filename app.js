var mj = angular.module("mindjourney", [
  'ui.router',
  'oc.lazyLoad',
  'ngCookies',
  'ngStorage',
    'xeditable',
    'ngSanitize',
    'ui.bootstrap'
]);

// //定义所有可能遇到的事件代码
mj.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

//定义所有可能的用户角色
mj.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  student: "student",
  teacher: "teacher",
  parent: "parent"
});

mj.constant('DOMAIN', {
  // domain: 'http://120.77.253.155'
  domain: "http://localhost:80"
});

mj.run(function ($http, $rootScope, $state, $cookies, editableOptions, AUTH_EVENTS, AuthService) {
  editableOptions.theme = "bs3";
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

  //确认登录权限,并发出广播
  $rootScope.$on("$stateChangeStart", function (event, next) {
    console.log(next.url);
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      // 如果加上这个那么原本的路由跳转事件不会执行
      // event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    } else{
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }
  });

  // $rootScope.$on('$destroy', function() {
  //   window.onbeforeunload = undefined;
  // });
  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    // event.preventDefault();
    angular.element(".curtain").fadeOut(2000);
    // $rootScope.$state.go("index");
    // if(!confirm("Are you sure you want to leave this page?")) {
    //   event.preventDefault();
    // }
  });
});

mj.config(function ($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
  // $httpProvider.defaults.headers.common['Authorization'] = $cookieStore.get("loginUser");
  // $httpProvider.defaults = {
  //   withCredentials: true
  // }
});

// mj.provider('myCSRF',[function(){
//   var headerName = 'X-CSRFToken';
//   var cookieName = 'csrftoken';
//   var allowedMethods = ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'];
//
//   this.setHeaderName = function(n) {
//     headerName = n;
//   }
//   this.setCookieName = function(n) {
//     cookieName = n;
//   }
//   this.setAllowedMethods = function(n) {
//     allowedMethods = n;
//   }
//   this.$get = ['$cookies', function($cookies){
//     return {
//       'request': function(config) {
//         if(allowedMethods.indexOf(config.method) === -1) {
//           // do something on success
//           config.headers[headerName] = $cookies[cookieName];
//         }
//         return config;
//       }
//     }
//   }];
// }]).config(function($httpProvider) {
//   $httpProvider.interceptors.push('myCSRF');
// });

