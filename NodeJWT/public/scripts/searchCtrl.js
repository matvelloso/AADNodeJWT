'use strict';
var app = angular.module('docsApp')
.controller('searchCtrl', ['$scope', '$routeParams', '$location', 'searchSvc', 'adalAuthenticationService', function ($scope, $routeParams, $location, searchSvc, adalService) {
    $scope.error = "";
    $scope.loadingMessage = "Loading...";
    $scope.searchList = null;

    $scope.populate = function () {
           


        searchSvc.getItems().then(function (result) {
            $scope.message = result;
            $scope.loadingMessage = "";
        },function (err) {
            $scope.message = err;
            $scope.loadingMessage = "";
        });
    };
}]);

app.filter('bytes', function () {
    return function (bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
});
