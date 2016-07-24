'use strict';

angular
    .module('myApp.services')
    .factory('TemplateService', TemplateService);

ProjectService.$inject = ['$http', 'ConfigService'];
function TemplateService($http, ConfigService) {

    var apiEndpoint = ConfigService.GetEndpoint();

    var service = {};
    service.GetAll = GetAll;
    service.GetById = GetById;
    service.GetByName = GetByName;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;
    return service;

    function GetAll() {
        return $http.get(apiEndpoint + 'templates').then(handleSuccess, handleError('Error getting all project'));
    }

    function GetById(id) {
        return $http.get(apiEndpoint + 'templates/' + id).then(handleSuccess, handleError('Error getting project by id'));
    }

    function GetByName(name) {
        return $http.get(apiEndpoint + 'templates?name=' + name).then(handleSuccess, handleError('Error getting project by name'));
    }

    function Create(project) {
        console.log(project);
        return $http.post(apiEndpoint + 'templates', project).then(handleSuccess, handleError('Error creating project'));
    }

    function Update(project) {
        return $http.put(apiEndpoint + 'templates/' + project._id, project).then(handleSuccess, handleError('Error updating project'));
    }

    function Delete(id) {
        return $http.delete(apiEndpoint + 'templates/' + id).then(handleSuccess, handleError('Error deleting project'));
    }

    // private functions

    function handleSuccess(res) {
        return { success: true, data: res.data };
    }

    function handleError(error) {
        console.log('Failed');
        console.log(error);
        return function () {
            return { success: false, message: error };
        };
    }
}