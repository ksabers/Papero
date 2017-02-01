//modaleModiPreparazioneController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleModiPreparazioneController", modaleModiPreparazioneController);

    function modaleModiPreparazioneController($http, DTOptionsBuilder) {

        var elencoModiPreparazione = [];

        var vm = this;
        vm.opzioniTabellaModiPreparazione = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.modoPreparazioneSelezionato = null;
        vm.dropdownModiPreparazione = [];
        vm.dropdownSale = [];
        vm.salaSelezionata = null;

        function aggiornaDropdownModiPreparazione() {


            var arrayModi = [];   // Array di servizio che serve per tenere l'elenco degli id degli autori selezionati nella tabella. Viene usato per filtrare la dropdown
            // togliendo gli autori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaModiPreparazione.length; i++)           // Riempimento dell'array di servizio
                arrayModi.push(vm.datiTabellaModiPreparazione[i].parteId);

            vm.dropdownModiPreparazione = _.filter(elencoModiPreparazione, function (preparazione) { return !arrayModi.includes(preparazione.id) });          

        };


        vm.apriModaleModiPreparazione = function caricaModiPreparazione() {

            aggiornaDropdownModiPreparazione();
            vm.modoPreparazioneSelezionato = vm.dropdownModiPreparazione[0];
            vm.salaSelezionata = vm.dropdownSale[0];


            
        };

        $http.get("/api/partipreparate")
            .then(function (response) {
                elencoModiPreparazione = response.data;
                //vm.dropdownModiPreparazione = response.data;
            });

        $http.get("/api/preparati/" + inputIdEsemplare.value)
            .then(function (response) {
                vm.datiTabellaModiPreparazione = response.data;
            });

        $http.get("/api/sale")
            .then(function (response) {
                vm.dropdownSale = response.data;
         });

    }

})();