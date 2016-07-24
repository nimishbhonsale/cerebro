'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngCookies',
    'ngFlash',
    'myApp.projects',
    'myApp.project',
    'myApp.project.feedback',
    'myApp.project.risks',
    'myApp.project.phase',
    'myApp.project.milestone',
    'myApp.admin',
    'myApp.dashboard',
    'myApp.home',
    'myApp.media',
    'myApp.login',
    'myApp.register',
    'myApp.version',
    'myApp.services',
    'myApp.fileUpload',
    'myApp.media.fileUpload'
])
    .config(config)
    .run(run);

config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeCntrl',
            templateUrl: 'home/home.index.view.html',
            controllerAs: 'vm'
        })

        .when('/login', {
            controller: 'LoginCntrl',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
        })

        .when('/register', {
            controller: 'RegisterCntrl',
            templateUrl: 'register/register.view.html',
            controllerAs: 'vm'
        })

        .otherwise({ redirectTo: '/home' });
}

run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
function run($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/home');
        }
    });
}