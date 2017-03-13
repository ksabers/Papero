//modalePreparazioneController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modalePreparazioneController", modalePreparazioneController);

    function modalePreparazioneController($http, DTOptionsBuilder) {

        var elencoPreparatori = [];

        var vm = this;

        vm.opzioniTabellaElencoPreparatori = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
        // (come da specifiche delle angular datatables)
        // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)


        function aggiornaDropdownPreparatori() {
            var arrayPreparatori = [];   // Array di servizio che serve per tenere l'elenco degli id dei preparatori selezionati nella tabella. Viene usato per filtrare la dropdown
                                         // togliendo i preparatori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaElencoPreparatori.length; i++)           // Riempimento dell'array di servizio
                arrayPreparatori.push(vm.datiTabellaElencoPreparatori[i].id);

            vm.preparatori = _.filter(elencoPreparatori, function (preparatore) { return !arrayPreparatori.includes(preparatore.id) });
            vm.preparatoreSelezionato = vm.preparatori[0];
        }

        vm.aggiornaElencoPreparatori = function aggiornaElencoPreparatori() {
            var serializzazione = "";

            for (var i = 0; i < vm.datiTabellaElencoPreparatori.length; i++) {
                serializzazione = serializzazione + vm.datiTabellaElencoPreparatori[i].id + ",";
            };
            serializzazione = "[" + serializzazione.substring(0, serializzazione.length - 1) + "]";
            $("#tabellaElencoPreparatoriSerializzata").val(serializzazione);
        };

        vm.spostaSu = function spostaSuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaElencoPreparatori[indice];
            var elementoPrecedente = vm.datiTabellaElencoPreparatori[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaElencoPreparatori, vm.datiTabellaElencoPreparatori.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaElencoPreparatori, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaElencoPreparatori = arrayRiordinato;
            vm.aggiornaElencoPreparatori();
        };

        vm.spostaGiu = function spostaGiuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaElencoPreparatori[indice];
            var elementoSuccessivo = vm.datiTabellaElencoPreparatori[indice + 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaElencoPreparatori, vm.datiTabellaElencoPreparatori.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaElencoPreparatori, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaElencoPreparatori = arrayRiordinato;
            vm.aggiornaElencoPreparatori();
        };

        vm.aggiungiPreparatore = function aggiungiPreparatore() {
            var preparatoreDaInserire =
                {
                    "id": vm.preparatoreSelezionato.id,
                    "nome": vm.preparatoreSelezionato.nome,
                    "cognome": vm.preparatoreSelezionato.cognome
                };
            vm.datiTabellaElencoPreparatori.push(preparatoreDaInserire);  // Inserimento della nuova riga in fondo alla tabella
            vm.aggiornaElencoPreparatori();
            aggiornaDropdownPreparatori();
        };

        vm.rimuoviPreparatore = function rimuoviPreparatore(preparatoreSelezionato) {
            vm.datiTabellaElencoPreparatori = _.remove(vm.datiTabellaElencoPreparatori, function (preparatore) { return preparatore != preparatoreSelezionato });
            vm.aggiornaElencoPreparatori();
            aggiornaDropdownPreparatori();
        };

        vm.apriModalePreparazione = function apriModalePreparazione() {
            aggiornaDropdownPreparatori();
            vm.preparatoreSelezionato = vm.preparatori[0];
            var dataPreparazione = funzioni.trasformaData($("#hiddenDataPreparazione").val());
            vm.dataPreparazione = dataPreparazione.data;
            vm.tipoDataPreparazione = dataPreparazione.tipo;
        };

        $http.get("/api/preparatori")
            .then(function (response) {
                elencoPreparatori = response.data;
            });

        $http.get("/api/preparatori/" + esemplarehiddenPreparazione.value)
            .then(function (response) {
                vm.datiTabellaElencoPreparatori = response.data;
            });


    }

})();