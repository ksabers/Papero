//modaleElencoAutoriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleElencoAutoriController", modaleElencoAutoriController);

    function modaleElencoAutoriController($http, DTOptionsBuilder) {

        var elencoAutori = [];
        var arrayAutori = [];   // Array di servizio che serve per tenere l'elenco degli id degli autori selezionati nella tabella. Viene usato per filtrare la dropdown
                                // togliendo gli autori già presenti nella tabella.

        var vm = this;
        vm.datiTabellaAutori = [];
        vm.datiDropdownAutori = [];
        vm.autoreSelezionato = null;
        vm.stringaElencoAutori = "pippo";
        vm.annoClassificazione = inputAnnoClassificazione.value;
        

        vm.opzioniTabellaElencoAutori = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withOption('rowReorder', true)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
                                                                           

        vm.apriModaleElencoAutori = function apriModaleElencoAutori(idSottospecie) {



            for (var i = 0; i < vm.datiTabellaAutori.length; i++)           // Riempimento dell'array di servizio
                arrayAutori.push(vm.datiTabellaAutori[i].id);

            alert("arrayAutori 1: " + arrayAutori);

            vm.datiDropdownAutori = _.filter(elencoAutori, function (autore) { return !arrayAutori.includes(autore.id) });
        };

        vm.aggiungiAutore = function aggiungiAutore() {

            alert("AggiungiAutore:" + vm.autoreSelezionato.id);
            vm.datiTabellaAutori.push(vm.autoreSelezionato);

        };

        vm.rimuoviAutore = function rimuoviAutore(idAutore) {

        };

        $http.get("/api/classificatori")
            .then(function (response) {
                elencoAutori = response.data;
        });

        $http.get("/api/classificazioni/" + inputIdSottospecie.value)
            .then(function (response) {
                vm.datiTabellaAutori = response.data;
        });

    }

})();