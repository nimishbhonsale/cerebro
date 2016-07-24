'use strict';

angular.module('myApp.fileUpload', ['ngFileUpload', 'ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log('inside upload routeProvider');
        $routeProvider
            .when('/upload', {
                templateUrl: 'upload/upload.html',
                controller: 'UploadCtrl'
            });
    }])
    .controller('UploadCtrl', ['Upload', '$window', '$scope', 'ConfigService', function (Upload, $window, $scope, ConfigService) {
        var vm = this;
        console.log('Scope:' + $scope.title);
        vm.title = $scope.title;
        vm.submit = function() { //function to call on form submit
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        }

        vm.upload = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/fileupload', //webAPI exposed to upload the file
                data:{avatar:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                console.log("Upload response: " + JSON.stringify(resp.data));
                if(resp.data.filename !== null){ //validate success
                    var avatar = ConfigService.GetArtifactUri(resp.data.filename);
                    $scope.avatarFilePath = avatar;
                    $scope.confirm(avatar);
                    //$window.alert('File uploaded successfully');
                } else {
                    //$window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ');
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    }]);