//modaleNomiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleNomiController", modaleNomiController);

    function modaleNomiController($http) {

        var vm = this;

        vm.elencoStatiConservazione = [];
        vm.statoConservazioneSelezionato = null;

        vm.apriModaleNomi = function caricaStatiConservazione() {
            $http.get("/api/staticonservazione")
             .then(function (response) {
                 vm.elencoStatiConservazione = response.data;              
                 vm.statoConservazioneSelezionato = parseInt(statoConservazioneDB.value);
            });

        }

        vm.salvaModaleNomi = function salvaNomiEStatiConservazione() {
            alert("salvataggio");
            location.reload(true);
        }
    }

})();