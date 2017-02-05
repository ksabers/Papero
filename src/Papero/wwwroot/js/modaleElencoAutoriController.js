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
        vm.classificazioneOriginale = inputClassificazioneOriginale.checked;
        vm.invalido = false;
        
        vm.opzioniTabellaElencoAutori = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.aggiornaElencoAutori = function aggiornaElencoAutori() {
            var elenco = "";
            var serializzazione = "";
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
            
            if (vm.annoClassificazione != null)
                elenco = elenco + ", " + vm.annoClassificazione.toString();
            
            if (!vm.classificazioneOriginale) {
                elenco = "(" + elenco + ")";
            }

            if (lunghezza == 0) {
                elenco = "-"
            };

            vm.stringaElencoAutori = elenco;
            serializzazione = "";
            for (var i = 0; i < lunghezza; i++) {
                serializzazione += vm.datiTabellaAutori[i].id + ",";
            };
            serializzazione = "[" + serializzazione.substring(0, serializzazione.length - 1) + "]";

            $("#parametroElencoAutori").val(elenco);
            $("#tabellaElencoAutoriSerializzata").val(serializzazione);
        };

        vm.spostaSu = function spostaSuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaAutori[indice];
            var elementoPrecedente = vm.datiTabellaAutori[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaAutori, vm.datiTabellaAutori.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaAutori, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaAutori = arrayRiordinato;
            vm.aggiornaElencoAutori();
        };

        vm.spostaGiu = function spostaGiuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaAutori[indice];
            var elementoSuccessivo = vm.datiTabellaAutori[indice+1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaAutori, vm.datiTabellaAutori.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaAutori, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaAutori = arrayRiordinato;
            vm.aggiornaElencoAutori();
        };
        

        function aggiornaDropdownAutori() {
            var arrayAutori = [];   // Array di servizio che serve per tenere l'elenco degli id degli autori selezionati nella tabella. Viene usato per filtrare la dropdown
                                    // togliendo gli autori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaAutori.length; i++)           // Riempimento dell'array di servizio
                arrayAutori.push(vm.datiTabellaAutori[i].id);

            vm.datiDropdownAutori = _.filter(elencoAutori, function (autore) { return !arrayAutori.includes(autore.id) });
            vm.invalido = vm.datiTabellaAutori.length == 0;
        };

        vm.apriModaleElencoAutori = function apriModaleElencoAutori(idSottospecie) {
            vm.annoClassificazione = parseInt($("#annoClassificazioneDB").val());
            vm.classificazioneOriginale = ($("#classificazioneOriginaleDB").val() == "true" ? true : false);
            aggiornaDropdownAutori();
            vm.aggiornaElencoAutori();
            vm.autoreSelezionato = vm.datiDropdownAutori[0];
        };

        vm.aggiungiAutore = function aggiungiAutore() {
            vm.datiTabellaAutori.push(vm.autoreSelezionato);
            aggiornaDropdownAutori();
            vm.aggiornaElencoAutori();
            vm.autoreSelezionato = vm.datiDropdownAutori[0];
        };

        vm.rimuoviAutore = function rimuoviAutore(autoreSelezionato) {
            vm.datiTabellaAutori = _.remove(vm.datiTabellaAutori, function (autore) { return autore.id != autoreSelezionato.id });
            aggiornaDropdownAutori();
            vm.aggiornaElencoAutori();
            vm.autoreSelezionato = vm.datiDropdownAutori[0];
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