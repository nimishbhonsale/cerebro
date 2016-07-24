'use strict';

angular.module('myApp.project.milestone', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/project/:id/phase/:phase/milestone/new', {
                templateUrl: 'project/milestone/milestone.add.html',
                controller: 'MilestoneCntrl'
            })
            .when('/project/:id/phase/:phase/milestone/:milestone_id/edit', {
                templateUrl: 'project/milestone/milestone.edit.html',
                controller: 'MilestoneCntrl'
            });
    }])
    .controller('MilestoneCntrl', ['$rootScope', '$scope', '$location', '$routeParams', 'UserService', 'ProjectService', 'TemplateService',
        function ($rootScope, $scope, $location, $routeParams, UserService, ProjectService, TemplateService) {

            $scope.milestone = {};
            $scope.project = {};
            $scope.save = save;
            $scope.phase = '';
            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };
            $scope.popup1 = {
                opened: false
            };

            init();

            $scope.open1 = function() {
                $scope.popup1.opened = true;
            };

            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }



            function init() {
                console.log('inside milestone view init');
                var id = $routeParams.id;
                $scope.phase = decodeURI($routeParams.phase);
                var milestone_id = $routeParams.milestone_id;
                ProjectService.GetById(id)
                    .then(function (res) {
                        console.log('Project : ' + JSON.stringify(res));
                        if (res.success) {
                            var project = res.data;
                            $scope.project = project;
                            /*$scope.milestone = project.milestones.find(function (mstone) {
                                return mstone.id === milestone_id;
                            });*/
                        }
                    });
            }

            function edit() {
                var id = $routeParams.id;
                ProjectService.GetById(id)
                    .then(function (res) {
                        console.log('Project : ' + JSON.stringify(res));
                        if (res.success) {
                            var prj = res.data;
                            if (prj.milestone === undefined)
                                prj.milestone = [];
                            prj.milestone.push($scope.milestone);
                            ProjectService.Update(prj)
                                .then(function (res) {
                                    console.log('Project : ' + JSON.stringify(res));
                                    if (res.success) {
                                        $location.path('/project/view/' + prj._id + '/milestone');
                                    }
                                });
                        }
                    });
            }

            function save() {

                $scope.milestone.sign_off = [];
                $scope.milestone.media = [];
                $scope.milestone.phase = $scope.phase;

                var id = $routeParams.id;
                var phase = $routeParams.phase;
                ProjectService.GetById(id)
                    .then(function (res) {
                        console.log('Project : ' + JSON.stringify(res));
                        if (res.success) {
                            var prj = res.data;
                            if (prj.milestones === undefined) {
                                prj.milestones = [];
                            }
                            prj.milestones.push($scope.milestone);

                            var curr_index = prj.template.phases.length, new_index = prj.template.phases.length;
                            for ( var i = 0; i < prj.template.phases.length; i++)
                            {
                                if(prj.template.phases[i] === prj.current_phase) {
                                    curr_index = i;
                                    break;
                                }
                            }
                            for ( var j = 0; i < prj.template.phases.length; j++)
                            {
                                if(prj.template.phases[j] === phase) {
                                    new_index = j;
                                    break;
                                }
                            }

                            if(new_index < curr_index)
                                prj.current_phase = phase;

                            console.log('Milestone before update : ' + JSON.stringify(prj));
                            ProjectService.Update(prj)
                                .then(function (res) {
                                    console.log('Project : ' + JSON.stringify(res));
                                    if (res.success) {
                                        $location.path('/project/view/' + prj._id + '/phase/' + phase);
                                    }
                                });
                        }
                    });
            }
        }])
;