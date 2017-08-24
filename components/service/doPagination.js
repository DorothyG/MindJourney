mj.factory("doPagination", function ($http, $q) {
    var onePage = [];

    onePage.paginateAll = function (datalist, pageNum) {
        var pageData = [];
        for(var i = 0; i <= datalist.length / 20; i++){
            pageData[i] = datalist.slice(20 * i, 20 * i + 19);
        }
        return pageData[pageNum - 1];
    };

    onePage.paginate = function (method, url, offset) {
        console.log(offset);
        var rowsAll = [];
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: {
                limit: '20',
                offset: offset
            }
        }).then(function (response) {
            var data = response.data;
            rowsAll = data.rows;
            deferred.resolve(rowsAll);
        }).catch(function (err) {
            // console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    return onePage;
});