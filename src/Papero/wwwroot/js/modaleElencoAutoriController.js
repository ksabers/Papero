//modaleElencoAutoriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleElencoAutoriController", modaleElencoAutoriController);

    function modaleElencoAutoriController($http, DTOptionsBuilder) {

        var elencoAutori = [];


        var vm = this;
        vm.datiTabellaAutori = [];
        vm.datiDropdownAutori = [];
        vm.autoreSelezionato = null;
        vm.stringaElencoAutori = "";       
        vm.annoClassificazione = inputAnnoClassificazione.value;

        vm.opzioniTabellaElencoAutori = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
          
        
        function aggiornaElencoAutori() {
            var elenco = "";
            var lunghezza = vm.datiTabellaAutori.length;
            var sequenza = 1;

            for (var i = 0; i < lunghezza; i++) {
                if (sequenza < lunghezza - 1) {
                    elenco = elenco + vm.datiTabellaAutori[i].classificatore + ", ";
                    sequenza += 1;
                    continue;
                };
                if (sequenza == lunghezza - 1) {
                    elenco = elenco + vm.datiTabellaAutori[i].classificatore + " & ";
                    sequenza += 1;
                    continue;
                };
                if (sequenza == lunghezza) {
                    elenco = elenco + vm.datiTabellaAutori[i].classificatore;
                    sequenza += 1;
                    break;
                };
            }
            vm.stringaElencoAutori = elenco;
        }

        function aggiornaDropdownAutori() {
            var arrayAutori = [];   // Array di servizio che serve per tenere l'elenco degli id degli autori selezionati nella tabella. Viene usato per filtrare la dropdown
            // togliendo gli autori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaAutori.length; i++)           // Riempimento dell'array di servizio
                arrayAutori.push(vm.datiTabellaAutori[i].id);

            vm.datiDropdownAutori = _.filter(elencoAutori, function (autore) { return !arrayAutori.includes(autore.id) });

        };

        vm.apriModaleElencoAutori = function apriModaleElencoAutori(idSottospecie) {
            
            
            //$http.get("/api/classificazioni/" + inputIdSottospecie.value)
            //    .then(function (response) {
            //        vm.datiTabellaAutori = response.data;
 
            //});

            
            aggiornaDropdownAutori();
            aggiornaElencoAutori();
            vm.autoreSelezionato = vm.datiDropdownAutori[0];

        };

        vm.aggiungiAutore = function aggiungiAutore() {
            vm.datiTabellaAutori.push(vm.autoreSelezionato);
            aggiornaDropdownAutori();
            aggiornaElencoAutori();
            vm.autoreSelezionato = vm.datiDropdownAutori[0];
        };

        vm.rimuoviAutore = function rimuoviAutore(autoreSelezionato) {
            vm.datiTabellaAutori = _.remove(vm.datiTabellaAutori, function (autore) { return autore.id != autoreSelezionato.id });
            aggiornaDropdownAutori();
            aggiornaElencoAutori();
            vm.autoreSelezionato = vm.datiDropdownAutori[0];
        };


        $http.get("/api/classificatori")
            .then(function (response) {
                elencoAutori = response.data;
                
                //vm.autoreSelezionato = elencoAutori[0];
        });

        $http.get("/api/classificazioni/" + inputIdSottospecie.value)
            .then(function (response) {
                vm.datiTabellaAutori = response.data;
        });

    }

})();