mj.controller("classAfterListCtrl", function ($http, $scope, $stateParams,
                                           handleData, doPagination) {
    var practiceUrl = "../tr/practiceResult/";
    var isClick = [];

    $scope.load = function () {
        var idExam = $stateParams.praticeId;
        $http({
            method: "get",
            url: practiceUrl + "datalist",
            params: {
                idExam: idExam
            }
        }).then(function (response) {
            var success = response.data;
            $scope.papers = success.rows;
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
        }).catch(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    }
    $scope.load();

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
            $scope.papers = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.papers = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.papers = doPagination.paginateAll(rowsAll, (page + 1));
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

    //刷新页面
    $scope.refresh = function () {
        $scope.load();
    };

    $scope.answers = null;
    $scope.correct = function (paper) {
        $scope.answers = paper;
    }

    $scope.forTotal = function() {
        var actualScore = 0;
        $("input[name='isSelected']").each(function () {
            var score = parseInt($(this).val());
            actualScore += score;
        });
        if(actualScore > parseInt($scope.answers.totalScore)){
            Materialize.toast("评分有误,请检查!", 3000);
        } else {
            $scope.answers.actualScore = actualScore + '';
        }
    }

    $scope.modify = function (answers) {
        console.log(answers);
        handleData.WithoutData("post", practiceUrl + "modify", answers)
            .then(function (success) {
                if(success.success == true){
                    Materialize.toast("修改成功", 4000);
                    $scope.answers = null;
                    $scope.load();
                } else {
                    Materialize.toast("请检查你的表单内容", 4000);
                }
            }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    }
})