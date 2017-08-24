/**
 * Created by Administrator on 2017/3/26.
 */
/**
 * zTree - zTree插件指令
 */
mj.directive('zTree', function() {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element,attrs, ngModel) {
            var setting = {
                view: {
                    selectedMulti: false,
                    fontCss: function (treeId, treeNode) {
                        return treeNode.__s == 0 ? {color: "red"} : {};
                    },
                    nameIsHTML: true
                },
                check: {
                    enable: false
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
                    onClick: function (event, treeId, treeNode) {
                        scope.$apply(function () {
                            var selectNode = treeNode;
                            if (selectNode.p_id != 0) {
                                selectNode.p_id = {
                                    '_id': treeNode.getParentNode()._id,
                                    'display': treeNode.getParentNode().display
                                };
                            }
                            selectNode.childNodes = getChildNode(treeNode);
                            ngModel.$setViewValue(selectNode);
                        });
                    }
                }
            };

            function getChildNode(treeNode) {
                var childNode = [];
                if (treeNode.isParent) {
                    var nodes = treeNode.children;
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].isParent) {
                            childNode = getChildNode(nodes[i]);
                        } else {
                            childNode.push(nodes[i].id);
                        }
                    }
                }
                childNode.push(treeNode.id);
                return childNode;
            }

            scope.$watch('zNodes', function (zNodes) {
                if (scope.treeObj) {
                    $.fn.zTree.init(scope.treeObj, setting, zNodes)//.expandAll(true);
                }
                else {
                    $.fn.zTree.init(element, setting, zNodes)//.expandAll(true);
                }
            }, true);
        }
    };
});