mj.controller("dataHandleCreateCtrl", function ($http, $scope, $state, $stateParams,
                                          handleData) {
    $(function () {
        $('ul.tabs').tabs();
    })

    var expression = "";
    var examModelUrl = "http://localhost:80/tr/examResult/model";
    var praticeModelUrl = "http://localhost:80/tr/practiceResult/model";
    var idGroupUrl = "../bd/group/dataList";
    var commonUrl = "../tr/rule/";

    $scope.loadModel = function () {
        var ruleCode = $stateParams.ruleId;
        $scope.ruleCode = ruleCode;
        if(ruleCode != 0){
            handleData.searchData("method", commonUrl + "datalist", ruleCode)
                .then(function (success) {
                    var data = success.data;
                    var row = data.rows[0];
                    $scope.expression = row.ruleContent;
                    expression = row.ruleContent;
                })
        }
        //加载exam的model
        $http({
            method: "get",
            url: examModelUrl
        }).then(function (response) {
            var data = response.data;
            if(data.success == true){
                $scope.examModels = data.rows;
            } else {
                Materialize.toast("考试模型加载失败", 3000);
            }
        });

        //加载practice的model
        $http({
            method: "get",
            url: praticeModelUrl
        }).then(function (response) {
            var data = response.data;
            if(data.success == true){
                $scope.practiceModels = data.rows;
            } else {
                Materialize.toast("练习模型加载失败", 3000);
            }
        });

        //获取学校信息
        $http.get(idGroupUrl).then(function (response) {
            var data = response.data;
            var rows = data.rows;
            $scope.groups = rows;
            // console.log(rows);
        }).catch(function (err) {
            console.log(err);
        });
    }
    $scope.loadModel();

    $scope.concat = function (operator) {
        expression += operator;
        $scope.add.ruleContent = expression;
    }

    $scope.cancel = function () {
        expression = "";
    }

    $scope.back = function (operator) {
        var length = expression.length;
        // expression.slice(0, length - 2);
        expression = expression.substring(0, length - 1);
        $scope.add.ruleContent = expression;
    }
    
    $scope.create = function (add) {
        var promise = handleData.WithoutData("post", commonUrl + "create", add);
        promise.then(function (success) {
            if (success.success == true) {
                //清空模态框内容
                $scope.add = null;
                expression = "";
                //新建成功就跳转
                $state.go("index.dataHandle");
            } else {
                Materialize.toast("请重新检查你的表单内容!", 3000);
            }
        }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    }

    $scope.goback = function () {
        $state.go("index.dataHandle");
    }
});