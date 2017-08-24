mj.controller("paperManageCtrl", function ($http, $scope, $state,
                                           handleData, doPagination) {
    var commonUrl = "../tr/exam/";
    var isClick = [];

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadData("get", commonUrl + "datalist");
        promise.then(function (success) {
            $scope.exams = success.rows;
            $scope.total = success.total;

            var Pages = [];
            if (parseInt($scope.total) % 20 != 0) {
                for (var i = 1; i <= parseInt($scope.total) / 20 + 1; i++) {
                    Pages[i - 1] = i;
                    isClick[i - 1] = false;
                }
            } else {
                for (var i = 1; i <= parseInt($scope.total) / 20; i++) {
                    Pages[i - 1] = i;
                    isClick[i - 1] = false;
                }
            }
            Pages.unshift("<<");
            Pages.push(">>");
            $scope.pages = Pages;
            $scope.index = 1;
            // isClick[1] = true;
            $scope.c = isClick;
            // console.log(angular.fromJson(success)[1].idFiles[0].idFile.filePath);
            $(".loading").hide();
        }).then(function (err) {
            if(err != null){
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    };
    $scope.loadAllData();

    //分页
    $scope.paginating = function (page) {
        var index = parseInt(page);
        // console.log(index);
        isClick[index] = true;
        for (var i = 0; i < isClick.length; i++) {
            if (i != index) {
                isClick[i] = false;
            }
        }
        //加载全部内容然后分页
        if (typeof page === 'number' && !isNaN(page)) {
            $scope.index = page;
            $scope.exams = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.exams = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.exams = doPagination.paginateAll(rowsAll, (page + 1));
        }
        //分页加载数据
        // var promise = null;
        // if (typeof page === 'number' && !isNaN(page)) {
        //     $scope.index = page;
        //     promise = doPagination.paginate("get", commonUrl + "datalist", 20 * (page - 1));
        //     // alert("嘿咻" + 20 * (page - 1));
        // } else if (page == "<<") {
        //     promise = doPagination.paginate("get", commonUrl + "datalist", 20 * (page - 2));
        // } else if (page == ">>") {
        //     promise = doPagination.paginate("get", commonUrl + "datalist", 20 * page);
        // }
        // promise.then(function (success) {
        //     $scope.students = success;
        // });
    };

    //查看试卷内容
    $scope.transfer = function (classAfter) {
        $state.go("index.practiceList", {practiceCode: classAfter.idPractice.practiceCode});
    }

    $scope.correct = function (exam) {
        $state.go("index.paperList", {examId: exam._id});
    }
})