mj.controller("commuCircleCtrl", function($http, $scope, handleData){
    $(function () {
        //markdown初始化
        $("#cardContent").markdown({
            autofocus: true,
            iconlibrary: "fa",
            language: "zh"
        });
        $('modal').modal();
        $(".curtain").fadeOut(2000);
    });

    var commonUrl = "http://120.77.253.155/pf/card/";

    //新建一个帖子
    $scope.create = function(add) {
        //附件先上传,上传完了获取返回信息
        var file = $scope.add.idFiles;
        var uploadUrl = "http://120.77.253.155/id/announcement/uploading";
        var promise = fileUpload.uploadFileToUrl(file, uploadUrl);
        promise.then(function (success) {
            add.idFiles = success._id;
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });

        promise = handleData.WithoutData("post", commonUrl + "create", add);
        promise.then(function (success) {
            $scope.loadAllData();//关闭模态框
            $(".modal").modal('close');
            Materialize.toast("新建成功", 4000);
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        })
    };

    //页面加载完成之后加载数据
    $scope.loadAllData = function () {
        var promise = handleData.loadData("get", commonUrl + "datalist");
        promise.then(function (success) {
            $scope.cards = success;
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

    //修改一个学生信息
    $scope.modify = function(){
        var index = null;
        $('table').find(':checkbox').each(function(){
            if ($(this).is(":checked")) {
                var $announce =  $(this).val();
                handleData.WithoutData("post", commonUrl + "modify", $announce);
                //操作完成后取消选中
                $(this).removeAttr("checked");
            }
        });
    };

    //删除一个学生信息
    $scope.delete = function () {
        var _id = null;
        //遍历表格中被选中的记录,找出它的code
        $('table').find(':checkbox').each(function(){
            if ($(this).is(":checked")) {
                _id = angular.fromJson($(this).val())._id;
                // alert(_id);
            }
        });
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
