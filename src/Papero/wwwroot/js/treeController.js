//treeController.js




(function () {
    "use strict";



    var app = angular.module('app-tree', ['angularTreeview']);

    app.controller('treeController', function ($scope, $http) {
        $http.get("/api/famiglie")
        .then(function(response) {
            $scope.roleList = response.data;
        });
    });










    
})();