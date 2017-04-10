// anagraficaClassificatoriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaClassificatoriController", anagraficaClassificatoriController);

    function anagraficaClassificatoriController($http) {

        var vm = this;

        $http.get("/api/classificatori")
            .then(function (response) {
                vm.classificatori = response.data;
            });
    }

})();