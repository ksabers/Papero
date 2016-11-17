﻿//treeController.js

(function () {
    "use strict";

    var app = angular.module('app-tree', ['treeControl', 'datatables']);

    app.controller('treeController', function ($scope, $http) {

        $http.get("/api/esemplari")
            .then(function (response) {
                $scope.esemplari = response.data;


                //$scope.esemplari = [
                //      { "id": 1, "sottospecieId": 1791, "msng": 58364 }
                //];




            });

        $http.get("/api/famiglie")
        .then(function (response) {

            $scope.treeOptions = {
                nodeChildren: "figli",
                dirSelectable: true,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                }
            };
            
             $scope.dataForTheTree = response.data;

        });
    });
})();