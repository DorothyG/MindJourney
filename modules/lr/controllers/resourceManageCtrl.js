mj.controller("resourceManageCtrl", function ($http, $scope, $q, handleData, fileUpload) {
    var idGroupUrl = "../bd/group/dataList ";
    var idSubjectsUrl = "../tr/subject/datalist";
    var idChapterUrl = "../tr/chapter/dataList";
    var idPointUrl = "../tr/point/dataList";

    //刷新页面
    $scope.refresh = function () {
        $scope.loadAllData();
    };

    $(function () {
        //模态框初始化
        $('.modal').modal({
            // ready: function (modal, trigger) {
            //
            // }
        });
        //初始化下拉框
        // $('select').material_select();
        //解除幕布
        $(".curtain").fadeOut(2000);
    });

    var commonUrl = "../tr/resource/";
    var isClick = [];

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadData("get", commonUrl + "datalist");
        promise.then(function (success) {
            $scope.resources = success.rows;
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

            //获取科目信息
            $http.get(idSubjectsUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.subjects = rows;
                console.log(rows);
            }).catch(function (err) {
                console.log(err);
            });

            //获取章节信息
            $http.get(idChapterUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.chapters = rows;
                // console.log(rows);
            }).catch(function (err) {
                console.log(err);
            });

            //获取知识点信息
            $http.get(idPointUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.points = rows;
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
            var checkbox = !$scope.Checked(tr.resource._id);
            var action = (checkbox ? 'add' : 'remove');
            updateSelected(action, tr.resource._id, "isSelected");
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
            $scope.resources = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.resources = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.resources = doPagination.paginateAll(rowsAll, (page + 1));
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

    //新建一个课件资源
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
                add.resourceFile = [];
                for (var i = 0; i < success.length; i++) {
                    add.resourceFile.push({idFile: success[i]._id});
                }
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
    }
    /*--------------------------------*/

    //修改一个公告
    $scope.modify = function () {
        var count = 0;
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                count++;
                var $announce = $(this).val();
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
    }

    //查看课件资源
    $scope.transfer = function (an) {
        $scope.view = an;
    };

    $scope.ok = function (view) {
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
