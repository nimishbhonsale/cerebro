'use strict';

angular.module('myApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        console.log('inside dashboard routeProvider');
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/index.html',
            controller: 'DashboardCntrl'
        });
    }])

    .controller('DashboardCntrl', [function() {

    }]);