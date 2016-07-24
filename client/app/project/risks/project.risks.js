'use strict';

angular.module('myApp.project.risks', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/project/view/:id/risks/new',{
                templateUrl: 'project/risks/risks.add.html',
                controller: 'RisksCntrl'
            })
            .when('/project/view/:id/risks',{
                templateUrl: 'project/risks/risks.view.html',
                controller: 'RisksCntrl'
            });
    }])
    .controller('RisksCntrl', ['$rootScope','$scope', '$location', '$routeParams', 'UserService', 'ProjectService', 'TemplateService',
        function ($rootScope, $scope, $location, $routeParams, UserService, ProjectService, TemplateService) {

            $scope.risk = {};
            $scope.save = save;
            $scope.serverityList = ['High', 'Medium', 'Low'];

            init();

            function init() {
                console.log('inside risk view init');
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
                $scope.risk.updated = new Date();
                $scope.risk.by = {
                    id: $rootScope.globals.currentUser.userid,
                    name: $rootScope.globals.currentUser.fullname
                };

                var id = $routeParams.id;
                ProjectService.GetById(id)
                    .then(function (res) {
                        console.log('Project : ' + JSON.stringify(res));
                        if (res.success) {
                            var prj = res.data;
                            if(prj.risks === undefined)
                                prj.risks = [];
                            prj.risks.push($scope.risk);
                            ProjectService.Update(prj)
                                .then(function (res) {
                                    console.log('Project : ' + JSON.stringify(res));
                                    if (res.success) {
                                        $location.path('/project/view/' + prj._id + '/risks');
                                    }
                                });
                        }
                    });
            }
        }])
;