'use strict';

angular.module('myApp.media.fileUpload', ['ngFileUpload', 'ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log('inside upload routeProvider');
        $routeProvider
            .when('/upload', {
                templateUrl: 'media/upload/upload.html',
                controller: 'UploadMediaCtrl'
            });
    }])
    .controller('UploadMediaCtrl', ['Upload', '$window', '$scope', 'ConfigService', 'MediaService',
        function (Upload, $window, $scope, ConfigService, MediaService) {
            var vm = this;
            console.log('Scope:' + $scope.title);
            vm.title = $scope.title;
            vm.media = {active: true, likes: 1, rating: 0, comments: [], creator: $scope.userid};
            vm.submit = function () { //function to call on form submit
                if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                    vm.upload(vm.file); //call upload function
                }
            };
            vm.typeList = ['spec', 'design doc', 'demo', 'code walkthrough', 'test plan', 'test result', 'meeting', 'minutes of meeting', 'notes', 'user manual', 'training document', 'release document'];

            vm.upload = function (file) {
                var api = ConfigService.GetEndpoint();
                Upload.upload({
                    url: api + 'fileupload',
                    data: {avatar: file}
                }).then(function (resp) {
                    console.log("Upload response: " + JSON.stringify(resp.data));
                    if (resp.data.filename !== null) {
                        var artifact = ConfigService.GetArtifactUri(resp.data.filename);
                        //$scope.avatarFilePath = avatar;
                        vm.media.uri = artifact;
                        vm.media.filetype = resp.data.type;
                        MediaService.Create(vm.media).then(function (res) {
                            $scope.confirm(res.data);
                        });
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