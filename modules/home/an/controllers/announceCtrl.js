mj.controller("announceCtrl", function ($http, $rootScope, $scope, $cookieStore, $q,
                                        handleData, fileUpload, doPagination) {
    var editor = new wangEditor("indent");
    var editorModal = new wangEditor("indentEdit");
    config = [
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
        'undo',
        'redo',
        'fullscreen'
    ];
    editor.config.menus = config;
    editorModal.config.menus = config;
    editor.create();
    editorModal.create();

    //一些插件的初始化
    $(function () {
        // //markdown初始化
        // $("#anContent").markdown({
        //     autofocus: true,
        //     iconlibrary: "fa",
        //     language: "zh"
        // });

        //模态框初始化
        $(".modal").modal();
        //下拉列表初始化
        $('select').material_select();
        $(".curtain").fadeOut(2000);
    });

    //url前缀
    var commonUrl = "../id/announcement/";
    var isClick = [];

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadOnePageData("get", commonUrl + "datalist");
        promise.then(function (success) {
            $scope.announce = success.rows;
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

            // console.log(angular.fromJson(success)[2].idFiles[0].idFile.filePath);
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
            var checkbox = !$scope.Checked(tr.an._id);
            var action = (checkbox ? 'add' : 'remove');
            updateSelected(action, tr.an._id, "isSelected");
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
            $scope.announce = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.announce = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.announce = doPagination.paginateAll(rowsAll, (page + 1));
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
                $scope.announce = success;
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

    //新建一个公告
    $scope.create = function (add) {
        //附件先上传,上传完了获取返回信息
        if($scope.add.idFiles == undefined){
            add.announcementContent = editor.$txt.html();
            promise = handleData.WithoutData("post", commonUrl + "create", add);
            promise.then(function (success) {
                $scope.loadAllData();
                Materialize.toast("新建成功!", 3000);
                //清空模态框内容
                $scope.add = null;
                //清空富文本框
                $scope.clearFile("#fileInput");
                editorModal.clear();
                console.log(editorModal.$txt.html());
                //---------------------
                //关闭模态框
                $(".modal").modal('close');
            }).then(function (err) {
                if (err != null) {
                    Materialize.toast("啊哦,出错了...", 3000);
                    console.log(err);
                }
            });
        } else {
            // 打开文件上传的进度条
            angular.element(".fileLoading").show();
            var file = $scope.add.idFiles;
            var uploadUrl = "http://120.77.253.155/id/announcement/uploading";
            var promise = fileUpload.uploadFileToUrl(file, uploadUrl);
            promise.then(function (success) {
                console.log(success);
                add.idFiles = [];
                for (var i = 0; i < success.length; i++) {
                    add.idFiles.push({idFile: success[i]._id});
                }
                add.announcementContent = editor.$txt.html();
                console.log(add);
                // add.idFiles.push({"idFile": success._id});
                angular.element(".fileLoading").hide();

                promise = handleData.WithoutData("post", commonUrl + "create", add);
                promise.then(function (success) {
                    if(success.success == true){
                        $scope.loadAllData();
                        Materialize.toast("新建成功!", 3000);
                        //清空模态框内容
                        //清空文件上传
                        $scope.add.idFiles.length = 0;
                        $scope.add = null;
                        $scope.clearFile("input[type='file']");
                        $(".file-path").val('');
                        //清空富文本框
                        editor.clear();
                        //---------------------
                        //关闭模态框
                        $(".modal").modal('close');
                    } else {
                        Materialize.toast("请检查表单内容是否有误", 3000);
                    }
                }).then(function (err) {
                    if (err != null) {
                        Materialize.toast("啊哦,出错了...", 3000);
                        console.log(err);
                    }
                });
            }).then(function (err) {
                if (err != null) {
                    Materialize.toast("啊哦,出错了...", 3000);
                    console.log(err);
                }
            });
        }
    };

    $scope.Reset = function () {
        if($scope.add.idFiles != undefined){
            //清空文件上传
            $scope.add.idFiles.length = 0;
            $scope.clearFile("input[type='file']");
            $(".file-path").val('');
            // console.log($scope.add.idFiles);
            //----------------
        }
        //清空富文本框
        editor.clear();
    }
    /*--------------------------------*/

    //修改一个公告
    $scope.modify = function () {
        // handleData.WithoutData("post", commonUrl + "modify", an);
        // var index = null;
        var count = 0;
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                count++;
                var $announce = $(this).val();
                $announce.anContent = editorModal.$txt.html();
                console.log($announce);
                var promise = handleData.WithoutData("post", commonUrl + "modify", $announce);
                promise.then(function (success) {
                    Materialize.toast("修改成功", 4000);
                }).then(function (err) {
                    if (err != null) {
                        Materialize.toast("啊哦,出错了...", 3000);
                        console.log(err);
                    }
                });
                //操作完成后取消选中
                $('input[name="isSelected"]').prop('checked', false);
            }
        });
        if (count == 0) {
            Materialize.toast("你还没有选择任何数据", 3000);
        }
    };

    //删除一个公告
    $scope.delete = function () {
        var _id = null;
        var count = 0;
        //遍历表格中被选中的记录,找出它的code
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                _id = angular.fromJson($(this).val())._id;
                // alert(_id);
                count++;
                handleData.deleteData("post", commonUrl + "delete", _id)
                    .then(function (success) {
                        $scope.loadAllData();
                    }).then(function (err) {
                    if (err != null) {
                        Materialize.toast("啊哦,出错了...", 3000);
                        console.log(err);
                    }
                });
            }
        });
        if (count == 0) {
            Materialize.toast("你还没有选择任何数据", 3000);
        } else {
            Materialize.toast("删除成功!", 4000);
        }
    };

    //发布一个公告
    $scope.publish = function () {
        var _id = null;
        // //获取所选中的角色
        // var announcementRole = $("#announceRole").val();
        // console.log(announcementRole);
        // alert(announcementRole);
        var count = 0;
        // 遍历表格中被选中的记录,找出它的code
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                _id = angular.fromJson($(this).val())._id;
                count++;
                // alert(_id);
                //发送发布请求
                $http({
                    method: "post",
                    url: "../id/announcement/publish",
                    data: {
                        _id: _id
                    }
                }).then(function (response) {
                    var data = response.data;
                    Materialize.toast(data.msg, 4000);
                    //操作完成后取消选中
                    $('input[name="isSelected"]').prop('checked', false);
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });
        $scope.loadAllData();
        if (count == 0) {
            Materialize.toast("你还没有选择任何数据!", 4000);
        }
    };

    //下线一个公告
    $scope.offline = function () {
        var _id = null;
        var count = 0;
        //遍历表格中被选中的记录,找出它的code
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                _id = angular.fromJson($(this).val())._id;
                count++;
                // alert(_id);
                handleData.WithoutData("post", commonUrl + "offline", _id);
                //操作完成后取消选中
                $('input[name="isSelected"]').prop('checked', false);
            }
        });
        if (count == 0) {
            Materialize.toast("你还没有选择任何数据!", 4000);
        }
    }

    //查看公告
    $scope.transfer = function (an) {
        $scope.view = an;
        editorModal.$txt.html(an.announcementContent);
    };

    $scope.ok = function (view) {
        view.announcementContent = editorModal.$txt.html();
        handleData.WithoutData("post", commonUrl + "modify", view)
            .then(function (success) {
                Materialize.toast("修改成功", 4000);
            }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    }

    //清除文件上传内容
    $scope.clearFile = function (selector) {
        var fi;
        var sourceParent;

        if (selector) {
            fi = $(selector);
            sourceParent = fi.parent();
        }
        else {
            return;
        }

        $("<form id='tempForm'></form>").appendTo(document.body);

        var tempForm = $("#tempForm");

        tempForm.append(fi);
        tempForm.get(0).reset();

        sourceParent.append(fi);
        tempForm.remove();
    }

});