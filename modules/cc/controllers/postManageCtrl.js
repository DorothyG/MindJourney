mj.controller("postManageCtrl", function ($http, $scope, $q, $state,
                                          fileUpload, handleData, transferValues) {
    var idGroupUrl = "../bd/group/dataList ";

    var editor = new wangEditor("indent");
    editor.config.menus = [
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontfamily',
        'fontsize',
        'head',
        'unorderlist',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        'table',
        'emotion',
        '|',
        'video',
        'insertcode',
        '|',
        'undo',
        'redo',
        'fullscreen'
    ];
    editor.create();

    $(function () {
        $('.modal').modal();
        $(".curtain").fadeOut(2000);
    });

    var commonUrl = "../pf/card/";
    var rowsAll = null;
    var isClick = [];
    var isChecked = null;

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadData("get", commonUrl + "datalist");
        promise.then(function (success) {
            console.log(success);
            $scope.cards = success.rows;
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
            // console.log(angular.fromJson(success)[2].idFiles[0].idFile.filePath);

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
            var checkbox = !$scope.Checked(tr.card._id);
            var action = (checkbox ? 'add' : 'remove');
            updateSelected(action, tr.card._id, "isSelected");
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
            $scope.cards = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.cards = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.cards = doPagination.paginateAll(rowsAll, (page + 1));
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

    //查找按钮事件
    $scope.search = function (searchContent) {
        if (searchContent != null) {
            var promise = handleData.searchData("get", commonUrl + "datalist", searchContent);
            promise.then(function (success) {
                $scope.cards = success;
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

    //新建一个帖子
    $scope.create = function (add) {
        // add.cardContent = editor.$txt.html();
        console.log(editor.$txt.html());
        //附件先上传,上传完了获取返回信息
        var file = $scope.add.cardPictures;
        var uploadUrl = "../id/announcement/uploading";
        var promise = fileUpload.uploadFileToUrl(file, uploadUrl);
        promise.then(function (success) {
            add.cardPictures = [];
            for (var i = 0; i < success.length; i++) {
                var Pictures = {};
                Pictures.picture = success[i].filePath;
                add.cardPictures.push(Pictures);
            }
            // add.cardPictures = JSON.stringify(Pictures);
            console.log(add.cardPictures);
            add.cardContent = editor.$txt.html();
            handleData.WithoutData("post", commonUrl + "create", add)
                .then(function (success) {
                    if (success.success == false) {
                        Materialize.toast(success.msg, 3000);
                        $scope.add = null;
                    } else {
                        $scope.loadAllData();
                        $(".modal").modal("close");
                        Materialize.toast("新建成功", 4000);
                        $scope.add = null;
                    }
                }).then(function (err) {
                if (err != null) {
                    Materialize.toast("啊哦,出错了...", 3000);
                    console.log(err);
                }
            })

            // add.cardPictures.push("_id", success._id);
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    };

    //修改一个学生信息
    $scope.modify = function () {
        // var index = null;
        var count = 0;
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                var $announce = $(this).val();
                var promise = handleData.WithoutData("post", commonUrl + "modify", $announce);
                promise.then(function (success) {
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
        var count = 0;
        var acount = 0;
        //遍历表格中被选中的记录,找出它的code
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                _id = angular.fromJson($(this).val())._id;
                // alert(_id);
                handleData.deleteData("post", commonUrl + "delete", _id)
                    .then(function (success) {
                        acount++;
                        $scope.loadAllData();
                        if (count == acount && count != 0) {
                            Materialize.toast(count + "条数据删除成功!", 3000);
                        }
                    })
            }
        });
        if (count == 0) {
            Materialize.toast("你还没有选择数据", 3000);
        }
    };

    $scope.transfer = function (card) {
        transferValues.transfer(card);
        // console.log(card.cardName);
        $state.go("index.postInfo", {cardName: card.cardName});
    }
});