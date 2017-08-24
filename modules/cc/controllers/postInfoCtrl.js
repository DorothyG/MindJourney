mj.controller("postInfoCtrl", function ($http, $scope, $state, $stateParams,
                                        transferValues, handleData) {

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
        $(".curtain").fadeOut(2000);
    });

    var rowsAll = [];
    var commonUrl1 = "../pf/followCard/";
    var commonUrl2 = "../pf/card/";

    $scope.loadAllData = function () {
        var cardName = $stateParams.cardName;
        console.log($stateParams.cardName);
        // $http({
        //     method: "get",
        //     url: commonUrl2 + 'datalist',
        //     params: {
        //         cardName: cardName
        //     }
        // }).then(function (response) {
        //     var data = response.rows;
        //     var row = data;
        //     $scope.Card = row;
        //     rowsAll = row;
        //     console.log(response);
        //     console.log($scope.Card);
        // });
        $scope.Card = transferValues.get();
        rowsAll = transferValues.get();
        editor.$txt.html(rowsAll.cardContent);
        $http({
            method: "get",
            url: commonUrl1 + "dataList",
            params: {
                idCard: rowsAll._id
            }
        }).then(function (response) {
            var data = response.data;
            $scope.replies = data.rows;
        }).catch(function (err) {
            console.log(err);
            Materialize.toast("加载出错了", 3000);
        })
    };
    $scope.loadAllData();

    $scope.modify = function (card) {
        card.cardContent = editor.$txt.html();
        var promise = handleData.WithoutData("post", commonUrl2 + "modify", card);
        promise.then(function (success) {
            Materialize.toast("修改成功", 3000);
            $state.go('index.postManage');
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    }
})