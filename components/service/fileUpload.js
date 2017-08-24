mj.service('fileUpload', function ($http, $rootScope, $q) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var dataAll = [];
        var deferred = $q.defer();
        var count = 0;
        var i = 0;
        for(i = 0; i < file.length; i++){
            var fd = new FormData();
            fd.append("file", file[i]);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                //不能设置为multi/part form,会报错
                headers: {'Content-Type': undefined},
                uploadEventHandlers: {
                    progress: function (e) {
                        $rootScope.progress = parseInt(100.0 * e.loaded / e.total);
                    }
                }
            }).then(function(response){
                var data = response.data;
                count ++;
                dataAll.push(data);
                // console.log(dataAll);
                // deferred.resolve(data);
                // Materialize.toast("文件上传完成!", 2000);
            }).catch(function(err){
                console.log(err);
                Materialize.toast("文件上传失败!", 2000);
                // deferred.reject(err);
            }).finally(function () {
                if(count == file.length){
                    Materialize.toast(count + "个文件上传完成!", 2000);
                    deferred.resolve(dataAll);
                }
            });
        }
        //用同步请求返回一个promise对象
        return deferred.promise;
    }
});
