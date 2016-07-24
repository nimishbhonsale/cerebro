'use strict';

angular.module('myApp.project', ['ngRoute', 'ngDialog'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log('inside project routeProvider');
        $routeProvider
            .when('/project/view/:id',{
                templateUrl: 'project/manage/view.html',
                controller: 'ProjectViewCntrl'
            })
            .when('/project/create', {
                templateUrl: 'project/manage/create.html',
                controller: 'ProjectCntrl'
            });
    }])

    .controller('ProjectCntrl', ['$scope', '$location', 'ngDialog', 'UserService', 'ProjectService', 'TemplateService',
        'UploadService', 'ConfigService',
        function ($scope, $location, ngDialog, UserService, ProjectService, TemplateService, UploadService, ConfigService) {

            $scope.project = {};
            $scope.myFile = null;
            $scope.openUpload = openUpload;
            $scope.search = search;
            $scope.rcolor = rcolor;
            $scope.searchstakeholder = searchstakeholder;
            $scope.setowner = setowner;
            $scope.setstakeholder = setstakeholder;
            $scope.templatelist = [];
            $scope.save = save;
            $scope.title = "Choose a Thumbnail";
            init();

            function openUpload() {
                console.log('open for upload file');
                ngDialog
                    .openConfirm({
                        template: 'upload/upload.html',
                        controller: 'UploadCtrl',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    })
                    .then(function (value) {
                        console.log('Value on ok: ' + JSON.stringify(value));
                        $scope.project.thumbnail = value;
                    }, function(value) {
                        console.log('Value on cancel: ' + JSON.stringify(value));
                    });
            }

            function init() {
                TemplateService.GetAll()
                    .then(function (res) {
                        console.log('Templates : ' + JSON.stringify(res));
                        if (res.success) {
                            $scope.templatelist = res.data;
                        }
                    });
            }

            function rcolor() {
                    var color = (function lol(m, s, c) {
                        return s[m.floor(m.random() * s.length)] +
                            (c && lol(m, s, c - 1));
                    })(Math, '3456789ABCDEF', 4);
                    return color;
            }

            function search() {
                console.log('inside search..' + $scope.searchusername);
                UserService.GetByName($scope.searchusername)
                    .then(function (res) {
                        console.log('Users : ' + JSON.stringify(res));
                        if (res.success) {
                            $scope.searchResultUsers = res.data;
                        }
                    });
            }

            function searchstakeholder() {
                console.log('inside search..' + $scope.searchsusername);
                UserService.GetByName($scope.searchsusername)
                    .then(function (res) {
                        console.log('Users : ' + JSON.stringify(res));
                        if (res.success) {
                            $scope.searchResultStakeHolders = res.data;
                        }
                    });
            };
            function setowner(user) {
                console.log('inside setowner..' + JSON.stringify(user));
                $scope.project.owner = user;

                if ($scope.project.stakeholders === undefined)
                    $scope.project.stakeholders = [];
                $scope.project.stakeholders.push(user);
                $scope.searchusername = null;
                $scope.searchResultUsers = null;

            }
            function setstakeholder(user) {
                if ($scope.project.stakeholders === undefined)
                    $scope.project.stakeholders = [];
                $scope.project.stakeholders.push(user);
                $scope.searchsusername = null;
                $scope.searchResultStakeHolders = null;
            }

            function save() {
                console.log('Printing save .. ' + JSON.stringify($scope.project));
                $scope.project.current_phase = $scope.project.template.phases[0];
                ProjectService.Create($scope.project)
                    .then(function (res) {
                        if (res.success) {
                            $location.path('/project/view/' + res.data._id);
                        }
                    });
            }


        }])
    .controller('ProjectViewCntrl', ['$scope', '$location', '$routeParams', 'UserService', 'ProjectService', 'TemplateService',
        function ($scope, $location, $routeParams, UserService, ProjectService, TemplateService) {

            $scope.project = {};
            $scope.setcolor = setcolor;

            init();

            function init() {
                console.log('inside project view init');
                var id = $routeParams.id;
                ProjectService.GetById(id)
                    .then(function (res) {
                        console.log('Project : ' + JSON.stringify(res));
                        if (res.success) {
                            $scope.project = res.data;
                        }
                    });
            }

            function setcolor(phase, current_phase){

                console.log('set color: ' + phase + ' current: ' + current_phase);
                var cindex = $scope.project.template.phases.indexOf(current_phase);
                var pindex = $scope.project.template.phases.indexOf(phase);

                if(current_phase === '!comple')
                {
                    cindex = $scope.project.template.phases.length;
                }
                console.log('pindex:' + pindex + ' cindex:' + cindex);
                if(pindex < cindex) {
                    return {background: "lightgreen"};
                }
                if(pindex === cindex) {
                    return {background: "orange"};
                }
                if(pindex > cindex) {
                    return {background: "lightgrey"};
                }
            }
        }])
;