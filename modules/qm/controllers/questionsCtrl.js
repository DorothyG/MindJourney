mj.controller('questionsCtrl', function ($http, $scope, handleData) {
    var viewIndex = null;

    var questionTypeUrl = "../qc/type/datalist";

    var subjectUrl = "../tr/subject/dataList ";
    var chapterUrl = "../tr/subject/dataList ";
    var pointUrl = "../tr/subject/dataList ";
    $(function () {
        //模态框初始化
        $(".modal").modal({
            // ready: function(modal, trigger) {
            //     viewIndex = $(trigger).index();
            //     // alert(viewIndex);
            //     $scope.view = $scope.questions[viewIndex];
            //     $scope.$apply();
            // }
        });
        //去掉幕布
        $(".curtain").fadeOut(2000);
    });

    var commonUrl = "../qc/question/";
    var rowsAll = null;
    var isClick = [];
    var isChecked = null;

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadData("get", commonUrl + "datalist");
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

            //获取题型
            $http.get(questionTypeUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.types = rows;
                console.log(rows);
            }).catch(function (err) {
                console.log(err);
            });

            //获取科目信息
            $http.get(subjectUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.subjects = rows;
                // console.log(rows);
            }).catch(function (err) {
                console.log(err);
            });

            //获取章节信息
            $http.get(chapterUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.chapters = rows;
                // console.log(rows);
            }).catch(function (err) {
                console.log(err);
            });

            //获取知识点信息
            $http.get(pointUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.points = rows;
                // console.log(rows);
            }).catch(function (err) {
                console.log(err);
            });

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

    $scope.View = function (question) {
        $scope.view = question;
    }

    //查找按钮事件
    $scope.search = function (searchContent) {
        if (searchContent != null) {
            var promise = handleData.searchData("get", commonUrl + "datalist", searchContent);
            promise.then(function (success) {
                $scope.questions = success;
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

    //刷新页面
    $scope.refresh = function () {
        $scope.loadAllData();
    };

    //修改一个学生信息
    $scope.modify = function(){
        var count = 0;
        // var index = null;
        $('table').find(':checkbox').each(function(){
            if ($(this).is(":checked")) {
                count++;
                var $announce =  $(this).val();
                var promise = handleData.WithoutData("post", commonUrl + "modify", $announce);
                promise.then(function (success) {
                    console.log(success);
                    Materialize.toast("修改成功", 3000);
                    //操作完成后取消选中
                    $('input[name="isSelected"]').prop('checked', false);
                }).then(function (err) {
                    if (err != null) {
                        Materialize.toast("啊哦,出错了...", 3000);
                        console.log(err);
                    }
                });
            }
        });
        if (count == 0) {
            Materialize.toast("你还没有选择数据", 3000);
        }
    };

    //删除一个学生信息
    $scope.delete = function () {
        var _id = null;
        //遍历表格中被选中的记录,找出它的code
        var count = 0;
        var acount = 0;
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                _id = angular.fromJson($(this).val())._id;
                count++;
                handleData.deleteData("post", commonUrl + "delete", _id)
                    .then(function (success) {
                        acount++;
                        $scope.loadAllData();
                        if(count == acount && count != 0){
                            Materialize.toast(count + "条数据删除成功!", 3000);
                        }
                    });
            }
        });
        if(count == 0){
            Materialize.toast("你还没有选择数据", 3000);
        }
    };

    //修改题目内容
    $scope.modifyQuestion = function () {
        var $view = $scope.view;
        var promise = handleData.WithoutData("post", commonUrl + "modify", $view);
        promise.then(function (success) {
            Materialize.toast("修改成功", 3000);
            //操作完成后取消选中
            // $('input[name="isSelected"]').prop('checked', false);
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
        $("#view").modal('close');
    }
})