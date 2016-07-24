'use strict';

angular.module('myApp.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.view.html',
            controller: 'LoginCntrl'
        });
    }])

    .controller('LoginCntrl', ['$location', 'AuthenticationService', 'UserService', 'Flash',
        function($location, AuthenticationService, UserService, Flash) {
            var vm = this;
            vm.login = login;
            init();

            function init() {
                // reset login status
                AuthenticationService.Logout();
            }

            function login() {
                vm.dataLoading = true;
                AuthenticationService.Login(vm.username, vm.password, function (response) {

                    console.log("Login result:" + JSON.stringify(response));
                    if (response.success) {
                        console.log('UserService.GetByUsername');
                        UserService.GetByUsername(vm.username)
                            .then(function (result) {
                                console.log('Avatar is: ' + result.data[0].avatar);
                                AuthenticationService
                                    .SetCredentials(result.data[0].avatar, result.data[0]._id, result.data[0].name, vm.username, vm.password);
                                $location.path('/projects');
                            });
                    }
                    else {
                        //Flash.create('error', response.message);
                        vm.dataLoading = false;
                    }
                });
            };
    }]);