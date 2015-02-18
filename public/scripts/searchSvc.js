'use strict';

angular.module('docsApp')
.factory('searchSvc', ['$http', function ($http) {
        return {
            getItems: function () {
                
                
                return $http.get("http://localhost:1337/api/secure/",
                                 {}
                ).then(function (result) {
                    return result;
                }
                )
                
                //return $http.get("http://localhost:1337/api/allopen/",
                //                 {}
                //).then(function (result) {
                //    return result;
                //}
                //)

            }
        };
    }]);
