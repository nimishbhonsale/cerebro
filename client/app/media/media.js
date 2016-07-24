'use strict';

angular.module('myApp.media', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log('inside media routeProvider');
        $routeProvider
            .when('/media', {
                templateUrl: 'media/index.html',
                controller: 'MediaCntrl'
            })
            .when('/media/view/:id', {
                templateUrl: 'media/manage/view.html',
                controller: 'MediaViewCntrl'
            });
    }])
    .controller('MediaCntrl', ['$scope', '$http', 'MediaService', function ($scope, $http, MediaService) {

        $scope.search = search;
        $scope.searchparam = '';

        init();

        function init() {
            console.log('init called');
            MediaService.GetAll()
                .then(function (res) {
                    console.log('Media : ' + JSON.stringify(res));
                    $scope.media = res.data;
                    $scope.isPresent = res.data !== undefined && res.data !== null && res.data.length > 0;
                });
        }

        function search() {
            console.log('inside search..' + $scope.searchparam);
            MediaService.GetByName($scope.searchparam)
                .then(function (res) {
                    console.log('Media : ' + JSON.stringify(res));
                    $scope.media = res.data;
                    $scope.isPresent = res.data !== undefined && res.data !== null && res.data.length > 0;
                });
        }
    }])
    .controller('MediaViewCntrl', ['$scope', '$location', '$routeParams', 'UserService', 'ProjectService', 'MediaService',
        function ($scope, $location, $routeParams, UserService, ProjectService, MediaService) {

            $scope.media = {};
            $scope.like = like;
            $scope.setrating = setrating;
            $scope.addcomment = addcomment;
            $scope.details = "";

            init();

            function addcomment(det, userid) {
                var id = $routeParams.id;
                MediaService.GetById(id)
                    .then(function (res) {
                        console.log('Media : ' + JSON.stringify(res));

                        if (res.success) {
                            var med = res.data;
                            if (med.comments === undefined) {
                                med.comments = [];
                            }
                            var com = { comment : det, by : userid };
                            med.comments.push(com);
                            MediaService.Update(med)
                                .then(function (res1) {
                                    if (res1.success) {
                                        $scope.media = med;
                                        $scope.details = "";
                                    }
                                });
                        }
                    });
            }

            function setrating(rate) {
                var id = $routeParams.id;
                MediaService.GetById(id)
                    .then(function (res) {
                        console.log('Media : ' + JSON.stringify(res));

                        if (res.success) {
                            var med = res.data;
                            var rating = roundit((med.rating + rate) / 2.0);
                            med.rating = rating;
                            MediaService.Update(med)
                                .then(function (res1) {
                                    if (res1.success) {
                                        $scope.media = med;
                                    }
                                });
                        }
                    });
            }

            function roundit(num) {
                return Math.round(num * 2) / 2;
            }

            function like() {
                var id = $routeParams.id;
                MediaService.GetById(id)
                    .then(function (res) {
                        console.log('Media : ' + JSON.stringify(res));

                        if (res.success) {
                            var med = res.data;
                            med.likes += 1;
                            MediaService.Update(med)
                                .then(function (res1) {
                                    if (res1.success) {
                                        $scope.media = med;
                                    }
                                });
                        }
                    });
            }

            function init() {
                console.log('inside media init');
                var id = $routeParams.id;
                MediaService.GetById(id)
                    .then(function (res) {
                        console.log('Media : ' + JSON.stringify(res));
                        if (res.success) {
                            $scope.media = res.data;
                        }
                    });
            }
        }]);