//不包含拖拽区域
mj.directive("fileinputInitialized", function(){
  return{
    restrict: 'A',
    link: function(){
      $(function(){
        $("#fileInput").fileinput({
          language: 'zh',
          uploadUrl: 'file:///Users/macintoshhd/Desktop/MindJourney/upload',
          allowedFileExtensions: '*',
          uploadAsync: true,
          showUpload: true, //是否显示上传按钮
          showRemove : true, //显示移除按钮
          showPreview : true, //是否显示预览
          showCaption: true,//是否显示标题
          browseClass: "btn btn-primary", //按钮样式
          dropZoneEnabled: false,//是否显示拖拽区域
          maxFileCount: 10, //表示允许同时上传的最大文件个数
          enctype: 'multipart/form-data',
          validateInitialCount:true,
          previewFileIcon: "<i class='fa fa-file'></i>",
          msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        });
      });
    }
  }
});

//包含拖拽区域
mj.directive("fileinputInitializedWithDrag", function(){
  return{
    restrict: 'A',
    link: function(){
      $(function(){
        $("#fileInput").fileinput({
          language: 'zh',
          uploadUrl: 'file:///Users/macintoshhd/Desktop/MindJourney/upload',
          allowedFileExtensions: '*',
          uploadAsync: true,
          showUpload: true, //是否显示上传按钮
          showRemove : true, //显示移除按钮
          showPreview : true, //是否显示预览
          showCaption: true,//是否显示标题
          browseClass: "btn btn-primary", //按钮样式
          dropZoneEnabled: true,//是否显示拖拽区域
          maxFileCount: 10, //表示允许同时上传的最大文件个数
          enctype: 'multipart/form-data',
          validateInitialCount:true,
          previewFileIcon: "<i class='fa fa-file'></i>",
          msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        });
      });
    }
  }
});

//最基础的文件上传初始化
mj.directive("fileinputInitializedBasic", function(){
  return{
    restrict: 'A',
    link: function(){
      $(function(){
        $("#fileInput").fileinput({
          showPreview: false
        });
      })
    }
}});
  // language: 'zh',
  //     uploadUrl: 'file:///Users/macintoshhd/Desktop/MindJourney/upload',
  //   allowedFileExtensions: '*',
  //   uploadAsync: true,
  //   showUpload: true, //是否显示上传按钮
  //   showRemove : true, //显示移除按钮
  //   showPreview : true, //是否显示预览
  //   showCaption: true,//是否显示标题
  //   browseClass: "btn btn-primary", //按钮样式
  //   dropZoneEnabled: false,//是否显示拖拽区域
  //   maxFileCount: 10, //表示允许同时上传的最大文件个数
  //   enctype: 'multipart/form-data',
  //   validateInitialCount:true,
  //   previewFileIcon: "<i class='fa fa-file'></i>",
  //   msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",

