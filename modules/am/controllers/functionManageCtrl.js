mj.controller("functionManageCtrl", function ($http, $scope, handleData, doPagination) {

    $(function () {
        //模态框初始化
        $(".modal").modal();
        // Materialize.updateTextFields();
        $(".curtain").fadeOut(2000);
    });

    var commonUrl = "../sm/auth/";

    // $scope.orgaTree = function (datalist) {
    //     $scope.compare = function (data1, data2) {
    //         if(data1._id == data2.p_id){
    //             data1.nodes.push(data2);
    //         }
    //     };
    //     var treeData = [];
    //     var list = datalist;
    //     var orderedList = [];
    //     var i = 0;
    //     while(list.length != 0){
    //         list[i].text = list[i].authName;
    //         if(list[i].p_id == null || list[i].p_id == ''){
    //             orderedList.push(list[i]);
    //             list.splice(i, 1);
    //         } else {
    //
    //         }
    //         i++;
    //     }
    //     jQuery('.js-tree-icons').treeview({
    //         data: treeData,
    //         color: '#555',
    //         expandIcon: 'fa fa-plus',
    //         collapseIcon: 'fa fa-minus',
    //         nodeIcon: 'fa fa-folder text-primary',
    //         onhoverColor: '#f9f9f9',
    //         selectedColor: '#555',
    //         selectedBackColor: '#f1f1f1',
    //         showBorder: false
    //     });
    // };

    function onSelected(event, treeId, treeNode) {
        $scope.auth = treeNode;
        $scope.$apply();
    };
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
        },
        callback: {
            onClick: onSelected,
            onCheck: onSelected
        }
    };

    //页面加载完成之后加载数据
    var rowsAll = [];
    $scope.loadAllData = function () {
        var promise = handleData.loadData("get", commonUrl + "datalist");
        promise.then(function (success) {
            rowsAll = success.rows;
            console.log(rowsAll);
            // $scope.auths = success.rows;
            $scope.total = success.rows.length;
            // console.log(angular.fromJson(success)[1].idFiles[0].idFile.filePath);
            $.fn.zTree.init($("#tree"), setting, success.rows);//.expandAll(true);
            zTreeObj = $.fn.zTree.getZTreeObj("tree");
            // for (var i = 0; i < $scope.auth.userAuth.length; i++) {
            //     if (!treeObj.getNodeByParam("_id", $scope.user.userAuth[i].idAuth, null).isParent) {
            //         treeObj.checkNode(treeObj.getNodeByParam("_id", $scope.user.userAuth[i].idAuth, null), true, true);
            //     }
            // }

            // var Pages = [];
            // if (parseInt($scope.total) % 20 != 0) {
            //     for (var i = 1; i <= parseInt($scope.total) / 20 + 1; i++) {
            //         Pages[i - 1] = i;
            //     }
            // } else {
            //     for (var i = 1; i <= parseInt($scope.total) / 20; i++) {
            //         Pages[i - 1] = i;
            //     }
            // }
            // Pages.unshift("<<");
            // Pages.push(">>");
            // $scope.pages = Pages;
            // $scope.index = 0;
            // $scope.auths = success.rows.slice(0, 20);
            // $scope.auth = rowsAll[0];

            $(".loading").hide();
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    };
    $scope.loadAllData();

    // $scope.paginating = function (page) {
    //     console.log(page);
    //     console.log(doPagination.paginateAll(rowsAll, page));
    //     if(typeof page === 'number' && !isNaN(page)){
    //         $scope.index = page;
    //         $scope.auths = doPagination.paginateAll(rowsAll, page);
    //     } else if(page == "<<"){
    //         $scope.auths = doPagination.paginateAll(rowsAll, (page - 1));
    //     } else if(page == ">>"){
    //         $scope.auths = doPagination.paginateAll(rowsAll, (page + 1));
    //     }
    // };

    //刷新页面
    $scope.refresh = function () {
        $scope.loadAllData();
    };

    //新建一个学生信息
    $scope.create = function (add) {
        var promise = handleData.WithoutData("post", commonUrl + "create", add);
        promise.then(function (success) {
            $scope.loadAllData();
            //在权限树上增加一个新节点
            zTreeObj.addNodes($scope.auth, add);
            Materialize.toast("新建成功", 4000);
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        })
    };

    //修改一个学生信息
    $scope.modify = function () {
        var promise = handleData.WithoutData("post", commonUrl + "modify", $scope.auth);
        promise.then(function (success) {
            Materialize.toast("修改成功", 4000);
            //操作完成后取消选中
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
        // var index = null;
        // $('table').find(':checkbox').each(function () {
        //     if ($(this).is(":checked")) {
        //         // var $announce = $(this).val();
        //         handleData.WithoutData("post", commonUrl + "modify", $scope.auth);
        //         //操作完成后取消选中
        //         // $(this).removeAttr("checked");
        //     }
        // });
    };

    //删除一个学生信息
    $scope.delete = function () {
        // var _id = null;
        // //遍历表格中被选中的记录,找出它的code
        // $('table').find(':checkbox').each(function () {
        //     if ($(this).is(":checked")) {
        //         _id = angular.fromJson($(this).val())._id;
        //         // alert(_id);
        //     }
        // });
        var _id = $scope.auth._id;
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
    };

});
