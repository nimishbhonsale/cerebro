'use strict';

angular.module('myApp.project.feedback', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/project/view/:id/feedback/new',{
                templateUrl: 'project/feedback/feedback.add.html',
                controller: 'FeedbackCntrl'
            })
            .when('/project/view/:id/feedback',{
                templateUrl: 'project/feedback/feedback.view.html',
                controller: 'FeedbackCntrl'
            });
    }])
    .controller('FeedbackCntrl', ['$rootScope', '$scope', '$location', '$routeParams', 'UserService', 'ProjectService', 'TemplateService',
        function ($rootScope, $scope, $location, $routeParams, UserService, ProjectService, TemplateService) {

            $scope.feedbackEntry = { by:{}};
            $scope.save = save;
            $scope.artifactTypeList = ['Project', 'Phase', 'Milestone', 'Artifact'];

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

            function save() {
                console.log('Current user value ..' + JSON.stringify($rootScope.globals.currentUser));
                $scope.feedbackEntry.updated = new Date();
                $scope.feedbackEntry.by = {
                    id: JSON.stringify($rootScope.globals.currentUser.userid),
                    name: JSON.stringify($rootScope.globals.currentUser.fullname)
                };
                console.log('Feedback to be updated ..' + JSON.stringify($scope.feedbackEntry));
                var id = $routeParams.id;
                ProjectService.GetById(id)
                    .then(function (res) {
                        if (res.success) {
                            var prj = res.data;
                            if(prj.feedback === undefined)
                                prj.feedback = [];
                            prj.feedback.push($scope.feedbackEntry);
                            console.log('Project : ' + JSON.stringify(res));
                            ProjectService.Update(prj)
                                .then(function (res) {
                                    console.log('Project : ' + JSON.stringify(res));
                                    if (res.success) {
                                        $location.path('/project/view/' + prj._id + '/feedback');
                                    }
                                });
                        }
                    });
            }
        }])
;