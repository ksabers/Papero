//modaleNomiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleNomiController", modaleNomiController);

    function modaleNomiController($http) {

        var vm = this;

        vm.elencoStatiConservazione = [];

        vm.apriModale = function caricaStatiConservazione() {
            $http.get("/api/staticonservazione")
             .then(function (response) {
                vm.elencoStatiConservazione = response.data;
            });

        }
    }

})();