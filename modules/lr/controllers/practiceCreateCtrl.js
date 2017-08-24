mj.controller("practiceCreateCtrl", function ($http, $scope, $state,
                                              handleData, doPagination) {
    $(function () {
        $(".modal").modal();
    })

    var questionUrl = "../qc/question/";
    var rowsAll = null;
    var isClick = [];
    var isChecked = null;

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadData("get", questionUrl + "datalist");
        promise.then(function (success) {
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

            $(".loading").hide();
        }).then(function (err) {
            if(err != null){
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    };
    $scope.loadAllData();

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

    var commonUrl = "../tr/practice/";

    //新建一个练习信息
    $scope.create = function (add) {
        add.practiceList = [];
        $('table').find(':checkbox').each(function() {
            if ($(this).is(":checked")) {
                var question =  angular.fromJson($(this).val());
                add.practiceList.push({idQuestion: question._id});
            }
        });
        //把json对象转换成字符串
        var practiceList = angular.toJson(add.practiceList);
        add.practiceList = practiceList;
        var promise = handleData.WithoutData("post", commonUrl + "create", add);
        promise.then(function (success) {
            if(success.success == true){
                $scope.add = null;
                $state.go("index.practiceManage");
            } else {
                Materialize.toast("请检查你的表单内容", 3000);
            }
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    };

    $scope.View = function (question) {
        $scope.view = question;
    }

})