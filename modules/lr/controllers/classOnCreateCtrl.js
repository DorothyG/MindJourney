mj.controller("classOnCreateCtrl", function ($http, $scope, $state,
                                             handleData) {
    var idGroupUrl = "../bd/group/dataList";
    var practiceUrl = "../tr/practice/";
    var isClick = [];

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadData("get", practiceUrl + "datalist");
        promise.then(function (success) {
            $scope.practices = success.rows;
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

            //获取学校信息
            $http.get(idGroupUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.groups = rows;
                // console.log(rows);
            }).catch(function (err) {
                console.log(err);
            });

            // console.log(angular.fromJson(success)[1].idFiles[0].idFile.filePath);
            $(".loading").hide();
        }).then(function (err) {
            if (err != null) {
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
            var checkbox = !$scope.Checked(tr.practice._id);
            var action = (checkbox ? 'add' : 'remove');
            updateSelected(action, tr.practice._id, "isSelected");
        }
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
            $scope.practices = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.practices = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.practices = doPagination.paginateAll(rowsAll, (page + 1));
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

    var commonUrl = "../tr/keZhong/";

    //查找按钮事件
    $scope.search = function (searchContent) {
        if (searchContent != null) {
            var promise = handleData.searchData("get", commonUrl + "datalist", searchContent);
            promise.then(function (success) {
                $scope.classBefores = success;
            }).then(function (err) {
                if (err != null) {
                    Materialize.toast("啊哦,出错了...", 3000);
                    console.log(err);
                }
            });
        } else {
            Materialize.toast("你还没输入任何内容", 3000);
        }
    };

    //查看课件资源
    $scope.transfer = function (practice) {
        $state.go("index.practiceList", {practiceCode: practice.practiceCode});
    }

    //新建一个课堂信息
    $scope.create = function (add) {
        var promise = handleData.WithoutData("post", commonUrl + "create", add);
        promise.then(function (success) {
            if (success.success == true) {
                //清空模态框内容
                $scope.add = null;
                //新建成功就跳转
                $state.go("index.classOn");
            } else {
                Materialize.toast("请重新检查你的表单内容!", 3000);
            }
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    };

    $scope.cancel = function () {
        $('table').find(':radio').each(function () {
            if ($(this).is(":checked")) {
                //如果选中则取消选中
                $('input[name="isSelected"]').prop('checked', false);
            }
        });
    }
})