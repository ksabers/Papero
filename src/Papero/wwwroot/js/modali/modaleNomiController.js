//modaleNomiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleNomiController", modaleNomiController);

    function modaleNomiController($http) {

        var vm = this;

        vm.elencoStatiConservazione = [];
        vm.statoConservazioneSelezionato = null;
        vm.nomeItaliano = "";
        vm.nomeInglese = "";


        vm.apriModaleNomi = function caricaStatiConservazione() {

            vm.nomeItaliano = $("#nomeItalianoDD").text();
            vm.nomeInglese = $("#nomeIngleseDD").text();

            $http.get("/api/staticonservazione")
             .then(function (response) {
                 vm.elencoStatiConservazione = response.data;              
             });

            vm.statoConservazioneSelezionato = $("#statoConservazioneDB").val();
        }
    }

})();