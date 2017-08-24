mj.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'USER_ROLES',
    function ($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {
        $urlRouterProvider.otherwise('/login');
        //消除因为版本带来的!
        $locationProvider.hashPrefix('');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/common/views/login.html',
                controller: 'loginCtrl',
                data: {
                    data: ''
                }
            })
            .state('index', {
                url: "/index",
                templateUrl: 'modules/common/views/index.html',
                abstract: true,
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            //首页模块
            .state('index.home', {
                url: '/home',
                templateUrl: 'modules/home/views/home.html',
                controller: 'homeCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    // loadPlugin: function ($ocLazyLoad) {
                    //     return $ocLazyLoad.load([
                    //         {
                    //             name: 'controllers',
                    //             files: ['modules/home/controllers/homeCtrl.js']
                    //         }
                    //     ]);
                    // }
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            // serie: true,
                            files: [
                                'lib/Wookmark-jQuery-1.4.8/jquery.wookmark.min.js'

                            ]
                        });
                    }]

                },
                onEnter: function () {
                    // $controllerProvider.register("homeCtrl", "modules/home/controllers/homeCtrl.js");
                    $(".curtain").fadeOut(2000);
                }
            })
            //公告管理
            .state('index.announce', {
                url: '/announce',
                templateUrl: 'modules/home/an/views/announce.html',
                controller: 'announceCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                'lib/bootstrap-select-1.12.2/dist/css/bootstrap-select.min.css',
                                'lib/bootstrap-markdown/js/bootstrap-markdown.js',
                                "lib/wangEditor/css/wangEditor.min.css",
                                "lib/wangEditor/js/wangEditor.min.js"
                                // 'lib/bootstrap-markdown/js/markdown.js',
                                // 'lib/bootstrap-markdown/js/to-markdown.js',
                                // 'lib/bootstrap-markdown/locale/bootstrap-markdown.zh.js'
                                // 'lib/bootstrap-select-1.12.2/dist/js/bootstrap-select.min.js',
                                // 'lib/bootstrap-select-1.12.2/dist/js/i18n/default-*.min.js'
                            ]
                        });
                    }]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            //角色
            .state('index.studentInfo', {
                url: '/studentInfo',
                templateUrl: 'modules/sm/views/studentInfo.html',
                controller: 'studentInfoCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.teacherInfo', {
                url: '/teacherInfo',
                templateUrl: 'modules/tm/views/teacherInfo.html',
                controller: 'teacherInfoCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.parentsInfo', {
                url: '/parentsInfo',
                templateUrl: 'modules/pm/views/parentsInfo.html',
                controller: 'parentsInfoCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            //资源
            .state('index.subjectDefi', {
                url: '/subjectDefi',
                templateUrl: 'modules/lr/sm/views/subjectDefi.html',
                controller: 'subjectDefiCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.subjectInfo', {
                url: '/subjectInfo',
                templateUrl: 'modules/lr/sm/views/subjectInfo.html',
                controller: 'subjectDefiCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.chapterDefi', {
                url: '/chapterDefi',
                templateUrl: 'modules/lr/sm/views/chapterDefi.html',
                controller: 'chapterDefiCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.chapterInfo', {
                url: '/chapterInfo',
                templateUrl: 'modules/lr/sm/views/chapterInfo.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.pointDefi', {
                url: '/pointDefi',
                templateUrl: 'modules/lr/sm/views/pointDefi.html',
                controller: 'pointDefiCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.resourceManage', {
                url: '/resourceManage',
                templateUrl: 'modules/lr/views/resourceManage.html',
                controller: 'resourceManageCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.practiceManage', {
                url: '/practiceManage',
                templateUrl: 'modules/lr/views/practiceManage.html',
                controller: 'practiceManageCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.practiceCreate', {
                url: '/practiceCreate',
                templateUrl: 'modules/lr/views/practiceCreate.html',
                controller: 'practiceCreateCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.practiceList', {
                url: '/practiceManage/:practiceCode',
                templateUrl: 'modules/lr/views/practiceList.html',
                controller: 'practiceListCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.classBefore', {
                url: '/classBefore',
                templateUrl: 'modules/lr/views/classBefore.html',
                controller: 'classBeforeCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.classBeforeCreate', {
                url: '/classBeforeCreate',
                templateUrl: 'modules/lr/views/classBeforeCreate.html',
                controller: 'classBeforeCreateCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.classOn', {
                url: '/classOn',
                templateUrl: 'modules/lr/views/classOn.html',
                controller: 'classOnCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.classOnCreate', {
                url: '/classOnCreate',
                templateUrl: 'modules/lr/views/classOnCreate.html',
                controller: 'classOnCreateCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.classOnList', {
                url: '/classOnList/:practiceId',
                templateUrl: 'modules/lr/views/classOnList.html',
                controller: 'classOnListCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.classAfter', {
                url: '/classAfter',
                templateUrl: 'modules/lr/views/classAfter.html',
                controller: 'classAfterCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.classAfterCreate', {
                url: '/classAfterCreate',
                templateUrl: 'modules/lr/views/classAfterCreate.html',
                controller: 'classAfterCreateCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.classAfterList', {
                url: '/classAfterList/:practiceId',
                templateUrl: 'modules/lr/views/classAfterList.html',
                controller: 'classAfterListCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.examManage', {
                url: '/examManage',
                templateUrl: 'modules/lr/views/examManage.html',
                controller: 'examManageCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                'lib/moment/moment.min.js'
                            ]
                        });
                    }]
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.examCreate', {
                url: '/examCreate',
                templateUrl: 'modules/lr/views/examCreate.html',
                controller: 'examCreateCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                'lib/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css',
                                'lib/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.min.js',
                                // 'lib/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.zh-CN.js'
                            ]
                        });
                    }]
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.paperManage', {
                url: '/paperManage',
                templateUrl: 'modules/lr/pc/views/paperManage.html',
                controller: 'paperManageCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.paperList', {
                url: '/paperList/:examId',
                templateUrl: 'modules/lr/pc/views/paperList.html',
                controller: 'paperListCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.questionTypes', {
                url: '/questionTypes',
                templateUrl: 'modules/qm/views/questionTypes.html',
                controller: 'questionTypesCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            //题目管理
            .state('index.questions', {
                url: '/questions',
                templateUrl: 'modules/qm/views/questions.html',
                controller: 'questionsCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            //录入题目
            .state('index.questionIn', {
                url: '/questionIn',
                templateUrl: 'modules/qm/views/questionIn.html',
                controller: 'questionInCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                "lib/wangEditor/css/wangEditor.min.css",
                                "lib/wangEditor/js/wangEditor.min.js"
                            ]
                        });
                    }]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.questionFavo', {
                url: '/questionFavo',
                templateUrl: 'modules/qm/views/questionFavo.html',
                controller: 'questionFavoCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.dataHandle', {
                url: '/dataHandle',
                templateUrl: 'modules/dh/views/dataHandle.html',
                controller: 'dataHandleCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.dataHandleCreate', {
                url: '/dataHandleCreate/:ruleId',
                templateUrl: 'modules/dh/views/dataHandleCreate.html',
                controller: 'dataHandleCreateCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.postManage', {
                url: '/postManage',
                templateUrl: 'modules/cc/views/postManage.html',
                controller: 'postManageCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                "lib/wangEditor/css/wangEditor.min.css",
                                "lib/wangEditor/js/wangEditor.min.js"
                            ]
                        });
                    }]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.postInfo', {
                url: '/postInfo/:cardName',
                templateUrl: 'modules/cc/views/postInfo.html',
                controller: 'postInfoCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                "lib/wangEditor/css/wangEditor.min.css",
                                "lib/wangEditor/js/wangEditor.min.js"
                            ]
                        });
                    }]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.complaintManage', {
                url: '/complaintManage',
                templateUrl: 'modules/cc/views/complaintManage.html',
                controller: 'complaintManageCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.schoolManage', {
                url: '/schoolManage',
                templateUrl: "modules/scm/views/schoolManage.html",
                controller: "schoolManageCtrl",
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.roleManage', {
                url: '/roleManage',
                templateUrl: 'modules/am/views/roleManage.html',
                controller: 'roleManageCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                // 'lib/bootstrap-treeview/bootstrap-treeview.min.css',
                                // 'lib/bootstrap-treeview/bootstrap-treeview.min.js'
                                'lib/ztree/metroStyle/metroStyle.css',
                                'lib/ztree/jquery.ztree.all.min.js',
                                'lib/ztree/jquery.ztree.exhide.min.js'
                            ]
                        });
                    }]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.userManage', {
                url: '/userManage',
                templateUrl: 'modules/am/views/userManage.html',
                controller: 'userManageCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                // 'lib/bootstrap-treeview/bootstrap-treeview.min.css',
                                // 'lib/bootstrap-treeview/bootstrap-treeview.min.js'
                                'lib/ztree/metroStyle/metroStyle.css',
                                'lib/ztree/jquery.ztree.all.min.js',
                                'lib/ztree/jquery.ztree.exhide.min.js'
                            ]
                        });
                    }]
                },
                onEnter: function () {
                    $(".curtain").fadeOut(2000);
                }
            })
            .state('index.functionManage', {
                url: '/functionManage',
                templateUrl: 'modules/am/views/functionManage.html',
                controller: 'functionManageCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                // controllerProvider: function ($rootScope,$cookieStore) {
                //     if (!$cookieStore.get("loginUser")) {
                //         $rootScope.$state.go('login');
                //     }
                //     return function () {
                //
                //     }
                // },
                resolve: {
                    deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                // 'lib/bootstrap-treeview/bootstrap-treeview.min.css',
                                // 'lib/bootstrap-treeview/bootstrap-treeview.min.js'
                                'lib/ztree/metroStyle/metroStyle.css',
                                'lib/ztree/jquery.ztree.all.min.js',
                                'lib/ztree/jquery.ztree.exhide.min.js'
                            ]
                        });
                    }]
                },
                onEnter: function () {
                    // $controllerProvider()
                    $(".curtain").fadeOut(2000);
                }
            })
    }]);
