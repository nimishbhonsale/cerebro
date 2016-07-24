'use strict';

angular.module('myApp.register', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        console.log('inside home routeProvider');
        $routeProvider.when('/register', {
            templateUrl: 'register/register.view.html',
            controller: 'RegisterCntrl'
        });
    }])

.controller('RegisterCntrl', ['UserService', '$location', '$rootScope', 'Flash',
        function(UserService, $location, $rootScope, Flash) {
            var vm = this;
            vm.register = register;

            function register() {
                vm.dataLoading = true;
                    UserService.Create(vm.user)
                        .then(function (response) {
                            if (response.success) {
                                //Flash.create('success', 'Sign up successful', {class: 'has-success', id: '1'}, true);
                                console.log('redirecting to login ...');
                                $location.path('/login');
                            } else {
                                Flash.create('danger', response.message, {class: 'has-error', id: '2'}, true);
                                vm.dataLoading = false;
                            }
                        });
            };
        }]);