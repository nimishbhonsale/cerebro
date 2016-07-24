'use strict';

angular
    .module('myApp.services')
    .factory('ConfigService', ConfigService);

function ConfigService() {
    function GetEndpoint() {
        return 'http://localhost:3000/';
    }

    function GetArtifactsBucket() {
        return 'http://localhost:3000/artifacts';
    }

    function GetArtifactUri(id) {
        return 'http://localhost:3000/artifacts/' + id;
    }
    var service = {};
    service.GetEndpoint = GetEndpoint;
    service.ArtifactBucket = GetArtifactsBucket;
    service.GetArtifactUri = GetArtifactUri;
    return service;
}