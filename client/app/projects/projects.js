'use strict';

angular.module('myApp.projects', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log('inside project routeProvider');
        $routeProvider
            .when('/projects', {
                templateUrl: 'projects/index.html',
                controller: 'ProjectsCntrl'
            });
    }])

    .controller('ProjectsCntrl', ['$scope', '$http', 'ProjectService', function ($scope, $http, ProjectService) {

        $scope.search = search;
        $scope.pad = pad;
        $scope.searchparam = '';
        console.log('inside ProjectsContrller');

        init();

        function init() {
            console.log('init called');
            ProjectService.GetAll()
                .then(function (res) {
                    console.log('Projects : ' + JSON.stringify(res));
                    $scope.projects = res.data;
                    $scope.isPresent = res.data !== undefined && res.data !== null && res.data.length > 0;
                });
        }

        function search() {
            console.log('inside search..' + $scope.searchparam);
            ProjectService.GetByName($scope.searchparam)
                .then(function (res) {
                    console.log('Projects : ' + JSON.stringify(res));
                    $scope.projects = res.data;
                    $scope.isPresent = res.data !== undefined && res.data !== null && res.data.length > 0;
                });
        }

        function pad(width, string, padding) {
            return (width <= string.length) ? string : pad(width, padding + string, padding)
        }
    }]);