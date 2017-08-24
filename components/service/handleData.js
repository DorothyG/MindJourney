mj.factory("handleData", function ($http, $q) {
    var commonData = {};

    commonData.loadData = function (method, url) {
        var rowsAll = [];
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: {
                limit: '20',
                offset: '0'
            }
        }).then(function (response) {
            var data = response.data;
            // rowsAll = data.rows;
            deferred.resolve(data);
        }).catch(function (err) {
            // console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    commonData.loadAllData = function (method, url) {
        var rowsAll = [];
        var deferred = $q.defer();
        $http({
            method: method,
            url: url
        }).then(function (response) {
            var data = response.data;
            // rowsAll = data.rows;
            deferred.resolve(data);
        }).catch(function (err) {
            // console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    commonData.loadOnePageData = function (method, url) {
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: {
                limit: '20',
                offset: '0'
            }
        }).then(function (response) {
            var data = response.data;
            // rowsAll = data.rows;
            deferred.resolve(data);
        }).catch(function (err) {
            // console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    commonData.loadUser = function (method, url, userType) {
        var rowsAll = [];
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            params: {
                userType: userType,
                limit: '20',
                offset: '0'
            }
        }).then(function (response) {
            var data = response.data;
            // rowsAll = data.rows;
            deferred.resolve(data);
        }).catch(function (err) {
            // console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    commonData.loadAllUser = function (method, url, userType) {
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            params: {
                userType: userType
            }
        }).then(function (response) {
            var data = response.data;
            // rowsAll = data.rows;
            deferred.resolve(data);
        }).catch(function (err) {
            // console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    commonData.searchData = function (method, url, data) {
        var rows = [];
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            params: {
                search: data
            }
        }).then(function (response) {
            var data = response.data;
            rows = data.rows;
            deferred.resolve(rows);
        }).catch(function (err) {
            // console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    commonData.WithoutData = function (method, url, data) {
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: data
        }).then(function (response) {
            var data = response.data;
            deferred.resolve(data);
        }).catch(function (err) {
            console.log(err);
        });
        return deferred.promise;
    };

    commonData.deleteData = function (method, url, data) {
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: {
                _id: data
            }
        }).then(function (response) {
            var data = response.data;
            deferred.resolve(data);
        }).catch(function (err) {
            console.log(err);
        });
        return deferred.promise;
    };

    commonData.createUser = function (method, url, data, userType) {
        console.log(data);
        data.userType = userType;
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: data
        }).then(function (response) {
            var data = response.data;
            deferred.resolve(data);
        }).catch(function (err) {
            console.log(err);
        });
        return deferred.promise;
    };

    return commonData;
});