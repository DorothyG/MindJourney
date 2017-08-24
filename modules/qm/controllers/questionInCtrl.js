mj.controller("questionInCtrl", function($http, $scope, handleData){
    var questionTypeUrl = "../qc/type/datalist";

    var subjectUrl = "../tr/subject/dataList ";
    var chapterUrl = "../tr/subject/dataList ";
    var pointUrl = "../tr/subject/dataList ";

    var editorContent = new wangEditor("indent");
    var editorAnalysis = new wangEditor("analysis");
    var configs = [
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
        'img',
        'video',
        'insertcode',
        '|',
        'undo',
        'redo',
        'fullscreen'
    ];
    editorContent.config.menus = configs;
    editorAnalysis.config.menus = configs;
    editorContent.create();
    editorAnalysis.create();

  $(function(){
    //下拉列表初始化
    // $('select').material_select();
    //markdown初始化
    // $(".questionText").markdown({
    //       autofocus: true,
    //       iconlibrary: "fa",
    //       language: "zh"
    // });
      //去掉幕布
      $(".curtain").fadeOut(2000);
  });

    $scope.load = function () {
        //获取题型
        $http.get(questionTypeUrl).then(function (response) {
            var data = response.data;
            var rows = data.rows;
            $scope.types = rows;
            // console.log(rows);
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
    };
    $scope.load();

    //创建一个题目
    $scope.create = function (question) {
        question.idType = $scope.questionType._id;
        question.questionContent = editContent.$txt.html();
        question.analysis = editorAnalysis.$txt.html();
        console.log(question);
        handleData.WithoutData("post", "../qc/question/create", question)
            .then(function (success) {
                if (success.success == false) {
                    Materialize.toast(success.msg, 3000);
                } else {
                    Materialize.toast("新建成功", 4000);
                    $scope.question = null;
                    editContent.$txt.html('');
                    editorAnalysis.$txt.html('');
                }
            }).then(function (err) {
            if (err != null) {
                Materialize.toast("啊哦,出错了...", 3000);
                console.log(err);
            }
        });
    }
});
