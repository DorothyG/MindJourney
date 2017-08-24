mj.controller("userManageCtrl", function ($http, $scope, $cookieStore, handleData, AuthService) {
    var auths = [];
    var role = null;
    var idGroupUrl = "http://localhost:80/bd/group/dataList ";
    var idSubjectUrl = "http://localhost:80/tr/subject/dataList ";

    $scope.setAuth = function (user, $event) {
        $scope.selectUser = user;
        $event.stopPropagation();
        $("#authmanage").modal('open');
    };
    $(function () {
        var authUrl = "../sm/auth/datalist";
        var roleUrl = "../sm/role/datalist";
        //模态框初始化
        $("#add").modal({
            ready: function (modal, trigger) {
                // var promise = handleData.loadUser("get", commonUrl + "datalist", 2);
                // promise.then(function (success) {
                //     $scope.users = success;
                // });
                console.log(modal + " " + trigger);
            }
        });

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
                $http.get(authUrl).then(function (response) {
                    var data = response.data;
                    var rows = data.rows;
                    $.fn.zTree.init($("#tree"), setting, rows).expandAll(true);
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    for (var i = 0; i < $scope.selectUser.userAuth.length; i++) {
                        if (!treeObj.getNodeByParam("_id", $scope.selectUser.userAuth[i].idAuth, null).isParent) {
                            treeObj.checkNode(treeObj.getNodeByParam("_id", $scope.selectUser.userAuth[i].idAuth, null), true, true);
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                })
            }
        });
        $("#roleManage").modal({
            ready: function () {
                console.log("hdjshfd");
                $http.get(roleUrl).then(function (response) {
                    var data = response.data;
                    var rows = data.rows;
                    $scope.roles = rows;
                }).catch(function (err) {
                    console.log(err);
                })
            }
        });
        //解除幕布
        $('.curtain').fadeOut(2000);

        //跟标签有关的操作
        // $('.chips').material_chip();

        $("input[type='radio']").on('click', function () {
            role = $(this).val();
        });
    });

    var commonUrl = "http://localhost:80/sm/user/";
    var isClick = [];

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadOnePageData("get", commonUrl + "datalist");
        promise.then(function (success) {
            $scope.users = success.rows;
            $scope.total = success.total;
            console.log(success.rows);

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
            $http.get(idSubjectUrl).then(function (response) {
                var data = response.data;
                var rows = data.rows;
                $scope.subjects = rows;
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
            var checkbox = !$scope.Checked(tr.user._id);
            var action = (checkbox ? 'add' : 'remove');
            updateSelected(action, tr.user._id, "isSelected");
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
            $scope.users = doPagination.paginateAll(rowsAll, page);
        } else if (page == "<<") {
            $scope.users = doPagination.paginateAll(rowsAll, (page - 1));
        } else if (page == ">>") {
            $scope.users = doPagination.paginateAll(rowsAll, (page + 1));
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
                $scope.users = success;
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
        console.log(add.userType);
        var promise = handleData.createUser("post", commonUrl + "create", add, add.userType);
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
                    $('input[name="isSelected"]').prop('checked',false);
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
        var _id = null;
        //遍历表格中被选中的记录,找出它的code
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                _id = angular.fromJson($(this).val())._id;
                // alert(_id);
                count++;
            }
        });
        if (count == 0) {
            Materialize.toast("你还没有选择任何数据", 3000);
        } else {
            var promise = handleData.deleteData("post", commonUrl + "delete", _id);
            promise.then(function (success) {
                $scope.loadAllData();
                Materialize.toast("删除成功", 4000);
            }).then(function (err) {
                if (err != null) {
                    Materialize.toast("啊哦,出错了...", 3000);
                    console.log(err);
                }
            })
        }
    };


    //角色管理
    $scope.roleManage = function () {
        var count = 0;
        var _id = null;
        $('table').find(':checkbox').each(function () {
            if ($(this).is(":checked")) {
                count++;
                console.log(count);
                _id = angular.fromJson($(this).val())._id;
                //发送请求
                $http({
                    method: "post",
                    url: "../sm/user/role",
                    data: {
                        userRole: role._id,
                        _id: _id
                    }
                }).then(function (response) {
                    var data = response.data;
                    Materialize.toast(data.msg, 4000);
                    //操作完成后取消选中
                    $('input[name="isSelected"]').prop('checked',false);
                }).catch(function (err) {
                    console.log(err);
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
        var _id = $scope.selectUser._id;
        $scope.getAllAuths();
        //发送请求
        $http({
            method: "post",
            url: "../sm/user/auth",
            data: {
                userAuth: JSON.stringify(auths),
                _id: _id
            }
        }).then(function (response) {
            var data = response.data;
            Materialize.toast(data.msg, 4000);
            //操作完成后取消选中
            $('input[name="isSelected"]').prop('checked',false);
        }).catch(function (err) {
            console.log(err);
        });
        // $('table').find(':checkbox').each(function () {
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
    }
});
