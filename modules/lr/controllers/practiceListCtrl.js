mj.controller("practiceListCtrl", function ($http, $rootScope, $scope, $stateParams,
                                            handleData, doPagination, transferValues) {
    $(function () {
        $(".modal").modal();
    })

    var commonUrl = "../tr/practice/";

    $scope.load = function () {
        var practiceCode = $stateParams.practiceCode;
        handleData.searchData("get", commonUrl + "datalist", practiceCode)
        .then(function (success) {
            $scope.practice = success[0];
            // console.log($scope.practice);
            $(".loading").hide();
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    }
    $scope.load();

    //刷新页面
    $scope.refresh = function () {
        $scope.load();
    };

    $scope.refreshQuestion = function () {
        $scope.loadQuestion();
    };

    var questionUrl = "../qc/question/";
    var rowsAll = null;
    var isClick = [];
    var isChecked = null;

    $scope.loadQuestion = function () {
        //操作完成后取消选中
        $('input[name="isSelected"]').each(function () {
            $(this).prop('checked', false);
        });
        handleData.loadData("get", questionUrl + "datalist")
        .then(function (success) {
            $scope.questions = success.rows;
            rowsAll = success.rows;
            $scope.total = success.total;

            var Pages = [];
            if (parseInt($scope.total) % 20 != 0) {
                for (var i = 1; i <= parseInt($scope.total) / 20 + 1; i++) {
                    Pages[i - 1] = i;
                }
            } else {
                for (var i = 1; i <= parseInt($scope.total) / 20; i++) {
                    Pages[i - 1] = i;
                }
            }
            Pages.unshift("<<");
            Pages.push(">>");
            $scope.pages = Pages;
            $scope.c = isClick;
            $scope.index = 1;
            isChecked = true;
            // console.log(angular.fromJson(success)[1].idFiles[0].idFile.filePath);

            $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                //assign the "from" parameter to something
                console.log(from + "dhjdfgs");
            });

            $(".loading").hide();
        }).then(function (err) {
            if(err != null){
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    }

    /*-----------------表格选中优化--------------------*/
    $scope.selected = [];
    $scope.selectedTags = [];

    //更新选中或消除
    var updateSelected = function (action, id, name) {
        if (action == 'add' && $scope.selected.indexOf(id) == -1) {
            $scope.selected.push(id);
            $scope.selectedTags.push(name);
        }
        if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
            $scope.selectedTags.splice(idx, 1);
        }
        console.log("我运行了");
    }

    //点击复选框选中
    $scope.Check = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, checkbox.name);
        $event.stopPropagation();
    }

    //绑定给复选框
    $scope.Checked = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    //点击行选中
    $scope.checkTr = function ($event, tr) {
        if ($($event.target).is("td")) {
            var checkbox = !$scope.Checked(tr.question._id);
            var action = (checkbox ? 'add' : 'remove');
            updateSelected(action, tr.question._id, "isSelected");
        }
    };

    //选中全部
    $scope.checkAll = function () {
        var bischecked = $('#cboxchecked').is(':checked');
        var fruit = $('input[name="isSelected"]');
        fruit.prop('checked', bischecked);
    };
    /*----------------------------------------------*/


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
            $scope.questions = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.questions = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.questions = doPagination.paginateAll(rowsAll, (page + 1));
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

    $scope.View = function (question) {
        $scope.view = question;
    }

    $scope.transfer = function (list) {
        console.log(list);
        $scope.more = list.idQuestion;
    }

    var commonUrl = "../tr/practice/";

    $scope.modify = function () {
        var count = 0;
        $('table').find(':checkbox').each(function() {
            if ($(this).is(":checked")) {
                count++;
                var question = angular.fromJson($(this).val());
                $scope.practice.practiceList.push({idQuestion: question});
            }
        });
        console.log($scope.practice);
        if(count == 0){
            Materialize.toast("你还没有选择任何内容", 3000);
        } else {
            // //把json对象转换成字符串
            // var practiceList = angular.toJson(add.practiceList);
            // add.practiceList = practiceList;
            var promise = handleData.WithoutData("post", commonUrl + "modify", $scope.practice);
            promise.then(function (success) {
                if(success.success == true){
                    $scope.isAdd = false;
                    $scope.load();
                    // $scope.load();
                    console.log("成功");
                } else {
                    Materialize.toast("请检查你的表单内容", 3000);
                }
            }).then(function (err) {
                if (err != null) {
                    Materialize.toast("啊哦,出错了...", 3000);
                    console.log(err);
                }
            });
            var i = 0;
            //操作完成后取消选中
            $('input[name="isSelected"]').each(function () {
                i++;
                $(this).prop('checked', false);
            });
            console.log(i);
        }
    }

    $scope.delete = function () {
        var count = 0;
        $('input[name="isSelected"]').each(function (index) {
            if ($(this).is(":checked")) {
                count++;
                $scope.practice.practiceList.splice(index, 1);
            }
        });
        console.log($scope.practice);
        if(count == 0){
            Materialize.toast("你还没有选择任何内容", 3000);
        } else {
            var promise = handleData.WithoutData("post", commonUrl + "modify", $scope.practice);
            promise.then(function (success) {
                if(success.success == true){
                    $scope.isAdd = false;
                    $scope.load();
                    console.log("成功");
                } else {
                    Materialize.toast("请检查你的表单内容", 3000);
                }
            }).then(function (err) {
                if (err != null) {
                    Materialize.toast("啊哦,出错了...", 3000);
                    console.log(err);
                }
            });
            //操作完成后取消选中
            $('input[name="isSelected"]').each(function () {
                $(this).prop('checked', false);
            });
        }
    }

    $scope.Return = function () {
        window.history.go(-1);
    }
});