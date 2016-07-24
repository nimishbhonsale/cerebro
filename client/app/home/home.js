'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        console.log('inside home routeProvider');
        $routeProvider.when('/home', {
            templateUrl: 'home/home.index.view.html',
            controller: 'HomeCntrl'
        });
    }])

    .controller('HomeCntrl', ['$scope', 'ConfigService', function($scope, ConfigService) {
        init();

        function init() {
            $scope.cerebroFlowImage = ConfigService.GetArtifactUri("cerebro-flow.png");
            console.log($scope.cerebroFlowImage);
        }
    }]);