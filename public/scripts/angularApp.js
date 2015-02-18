'use strict';
angular.module('docsApp', ['ngRoute','AdalAngular'])
.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {
    $routeProvider.when("/Home", {
        controller: "homeCtrl",
        templateUrl: "/home.html",
    }).when("/search", {
        controller: "searchCtrl",
        templateUrl: "/search.html",
        requireADLogin: true,
    }).otherwise({ redirectTo: "/Home" });

    adalProvider.init(
        {
            tenant: 'samplestartup2.com',
            clientId: 'bfcf534c-a43a-4695-ba80-b47ce45f5b68'
           
        },
        $httpProvider
        );
   
}]);
