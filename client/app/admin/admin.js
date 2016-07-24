'use strict';

angular.module('myApp.admin', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        console.log('inside admin routeProvider');
        $routeProvider.when('/admin', {
            templateUrl: 'admin/index.html',
            controller: 'AdminCntrl'
        });
    }])

    .controller('AdminCntrl', [function() {

    }]);