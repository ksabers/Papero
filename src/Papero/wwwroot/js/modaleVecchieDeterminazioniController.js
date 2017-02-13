//modaleVecchieDeterminazioniController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleVecchieDeterminazioniController", modaleVecchieDeterminazioniController);

    function modaleVecchieDeterminazioniController($http, DTOptionsBuilder) {

        var elencoVecchiDeterminatori = [];
        var elencoDeterminatori = [];

        var vm = this;

        vm.opzioniTabellaVecchieDeterminazioni = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.opzioniTabellaVecchiDeterminatori = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.datiTabellaVecchiDeterminatori = [];

        $http.get("/api/vecchiedeterminazioni/" + inputIdEsemplare.value)
            .then(function (response) {
                vm.datiTabellaVecchieDeterminazioni = response.data;
            });

        $http.get("/api/vecchideterminatori/" + inputIdEsemplare.value)
            .then(function (response) {
                vm.datiTabellaVecchiDeterminatori = response.data;
            });

        $http.get("/api/determinatori")
            .then(function (response) {
                elencoDeterminatori = response.data;
            });

    }
})();