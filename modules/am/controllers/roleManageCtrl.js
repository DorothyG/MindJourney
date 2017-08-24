mj.controller("roleManageCtrl", function ($http, $scope, handleData, AuthService) {
    var auths = null;
    $scope.setAuth = function (role, $event) {
        $scope.selectRole = role;
        $event.stopPropagation();
        $("#authmanage").modal('open');
    };
    $(function () {
        //模态框初始化
        var authUrl = "../sm/auth/dataList ";
        $("#add").modal();
        var zTreeObj = null;
        var setting = {
            view: {
                selectedMulti: false,
                fontCss: function (treeId, treeNode) {
                    return treeNode.__s == 0 ? {color: "red"} : {};
                },
                nameIsHTML: true
            },
            check: {
                enable: true
            },
            data: {
                key: {
                    name: 'display'
                },
                simpleData: {
                    enable: true,
                    idKey: "_id",
                    pIdKey: "p_id",
                    rootPId: 0
                }
            },
            edit: {
                enable: false
            }
        };
        $("#authmanage").modal({
            ready: function () {
                //获取权限信息
                $http.get(authUrl).then(function (response) {
                    var data = response.data;
                    var rows = data.rows;
                    $.fn.zTree.init($("#tree"), setting, rows);//.expandAll(true);
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    for (var i = 0; i < $scope.selectRole.userAuth.length; i++) {
                        if (!treeObj.getNodeByParam("_id", $scope.selectRole.userAuth[i].idAuth, null).isParent) {
                            treeObj.checkNode(treeObj.getNodeByParam("_id", $scope.selectRole.userAuth[i].idAuth, null), true, true);
                        }
                    }
                    // $scope.auths = rows;
                    // console.log(rows);
                }).catch(function (err) {
                    console.log(err);
                });
            }
        })
        //解除幕布
        $('.curtain').fadeOut(2000);

        //跟标签有关的操作
        // $('.chips').material_chip();
    });

    var commonUrl = "../sm/role/";
    var isClick = [];

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadOnePageData("get", commonUrl + "datalist");
        promise.then(function (success) {
            $scope.roles = success.rows;
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
            $scope.index = 1;
            // isClick[1] = true;
            $scope.c = isClick;

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
            var checkbox = !$scope.Checked(tr.role._id);
            var action = (checkbox ? 'add' : 'remove');
            updateSelected(action, tr.role._id, "isSelected");
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
            $scope.roles = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.roles = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.roles = doPagination.paginateAll(rowsAll, (page + 1));
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

    // $scope.paginating = function (page) {
    //     var index = parseInt(page);
    //     // console.log(index);
    //     isClick[index] = true;
    //     for (var i = 0; i < isClick.length; i++) {
    //         if (i != index) {
    //             isClick[i] = false;
    //         }
    //     }
    //     // console.log(isClick[index]);
    //     if (typeof page === 'number' && !isNaN(page)) {
    //         $scope.index = page;
    //         doPagination.paginate("get", commonUrl + "datalist", 20 * page);
    //     } else if (page == "<<") {
    //         doPagination.paginate("get", commonUrl + "datalist", 20 * (page - 1));
    //     } else if (page == ">>") {
    //         doPagination.paginate("get", commonUrl + "datalist", 20 * (page + 1));
    //     }
    // };

    //查找按钮事件
    $scope.search = function (searchContent) {
        if (searchContent != null) {
            var promise = handleData.searchData("get", commonUrl + "datalist", searchContent);
            promise.then(function (success) {
                $scope.roles = success;
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

    //新建一个学生信息
    $scope.create = function (add) {
        add.roleType = 1;
        var promise = handleData.WithoutData("post", commonUrl + "create", add);
        promise.then(function (success) {
            console.log(success);
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
    };

    //修改一个学生信息
    $scope.modify = function () {
        var count = 0;
        var index = null;
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                count++;
                var $announce = $(this).val();
                var promise = handleData.WithoutData("post", commonUrl + "modify", $announce);
                promise.then(function (success) {
                    Materialize.toast("修改成功", 4000);
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
            Materialize.toast("你还没有选择任何数据", 3000);
        }
    };

    //删除一个学生信息
    $scope.delete = function () {
        var count = 0;
        var acount = 0;
        var _id = null;
        //遍历表格中被选中的记录,找出它的code
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                _id = angular.fromJson($(this).val())._id;
                // alert(_id);
                count++;
                handleData.deleteData("post", commonUrl + "delete", _id)
                    .then(function (success) {
                        acount++;
                        $scope.loadAllData();
                        if(count == acount && count != 0){
                            Materialize.toast("删除成功!", 3000);
                        }
                    }).then(function (err) {
                    if (err != null) {
                        Materialize.toast("啊哦,出错了...", 3000);
                        console.log(err);
                    }
                })
            }
        });
        if (count == 0) {
            Materialize.toast("你还没有选择任何数据", 3000);
        }
    };

    //获取当前所选中的权限
    $scope.getAllAuths = function () {
        var nodes = $.fn.zTree.getZTreeObj("tree").getCheckedNodes(true);
        for (var i = 0; i < nodes.length; i++) {
            auths.push({'idAuth': nodes[i].id})
        }
    };

    //权限管理
    $scope.authManage = function () {
        // var auths = $('.chips').material_chip('data');
        var _id = $scope.selectRole._id;
        $scope.getAllAuths();
        console.log($scope.getAllAuths());
        //发送请求
        $http({
            method: "post",
            url: "../sm/role/auth",
            data: {
                userAuth: JSON.stringify(auths),
                _id: _id
            }
        }).then(function (response) {
            var data = response.data;
            Materialize.toast(data.msg, 4000);
            //操作完成后取消选中
            $(this).removeAttr("checked");
        }).catch(function (err) {
            console.log(err);
        });
        // $('table').find(':checkbox').each(function() {
        //     if ($(this).is(":checked")) {
        //         count++;
        //         _id = angular.fromJson($(this).val())._id;
        //         //发送请求
        //         $http({
        //             method: "post",
        //             url: "http://120.77.253.155/sm/user/auth",
        //             data: {
        //                 userAuth: JSON.stringify(auths),
        //                 _id: _id
        //             }
        //         }).then(function (response) {
        //             var data = response.data;
        //             Materialize.toast(data.msg, 4000);
        //             //操作完成后取消选中
        //             $(this).removeAttr("checked");
        //         }).catch(function (err) {
        //             console.log(err);
        //         })
        //     }
        // });
    };

});
