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

        vm.salvaModaleNomi = function salvaNomiEStatiConservazione(idSottospecie) {

            alert("/api/aggiornanomiestato/" + idSottospecie + "/" + nomeItaliano.value + "/" + nomeInglese.value + "/" + vm.statoConservazioneSelezionato);

            $http.put("/api/aggiornanomiestato/" + idSottospecie, nomeItaliano.value)
                .then(function (response) {

                    vm.stops.push(response.data);
                    _showMap(vm.stops);
                    vm.newStop = {};

                },
                      function (err) {

                          vm.errorMessage = "Failed to add new Stop";

                      })
                .finally(function () {

                    vm.isBusy = false;

                })

            //location.reload(true);
        }
    }

})();