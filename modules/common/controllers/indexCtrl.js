mj.controller("indexCtrl", function ($scope, $window, USER_ROLES, AuthService) {
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    var options = [{
        selector: '#platform', offset: 0, callback: function () {
            $(".page-footer").show(function () {
                setTimeout(function () {
                    $(this).hide();
                }, 5000);
            });
        }
    }];
    Materialize.scrollFire(options);
})
;