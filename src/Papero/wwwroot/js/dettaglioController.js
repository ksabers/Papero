//dettaglioController.js

(function () {
    "use strict";

    angular.module("dettaglio-app")
        .controller("dettaglioController", dettaglioController);

    function dettaglioController($http) {

        var vm = this;

        var datiDettaglio = [];

        vm.MSNG = 12345;

        $http.get("/api/esemplare/400")
             .then(function (response) {
                 datiDettaglio = response.data;
             });

        alert(datiDettaglio);
    }

})();