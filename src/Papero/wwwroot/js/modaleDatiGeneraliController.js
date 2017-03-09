//modaleDatiGeneraliController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleDatiGeneraliController", modaleDatiGeneraliController);

    function modaleDatiGeneraliController($http) {

        var vm = this;

        $http.get("/api/sessi")
            .then(function (response) {
                vm.sessi = response.data;
         });

        $http.get("/api/tipi")
            .then(function (response) {
                vm.tipi = response.data;
            });

        $http.get("/api/aberrazioni")
            .then(function (response) {
                vm.aberrazioni = response.data;
            });
    }

})();