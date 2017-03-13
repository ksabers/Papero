//modaleDeterminazioniController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleDeterminazioniController", modaleDeterminazioniController);

    function modaleDeterminazioniController($http, DTOptionsBuilder) {

        var elencoDeterminatori = [];

        var vm = this;

        vm.opzioniTabellaElencoDeterminatori = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                // (come da specifiche delle angular datatables)
                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)


        function aggiornaDropdownDeterminatori() {
            var arrayDeterminatori = [];   // Array di servizio che serve per tenere l'elenco degli id dei determinatori selezionati nella tabella. Viene usato per filtrare la dropdown
                                           // togliendo i determinatori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaElencoDeterminatori.length; i++)           // Riempimento dell'array di servizio
                arrayDeterminatori.push(vm.datiTabellaElencoDeterminatori[i].id);

            vm.determinatori = _.filter(elencoDeterminatori, function (determinatore) { return !arrayDeterminatori.includes(determinatore.id) });
            vm.determinatoreSelezionato = vm.determinatori[0];
        }

        vm.aggiornaElencoDeterminatori = function aggiornaElencoDeterminatori() {
            var serializzazione = "";

            for (var i = 0; i < vm.datiTabellaElencoDeterminatori.length; i++) {
                serializzazione = serializzazione + vm.datiTabellaElencoDeterminatori[i].id + ",";
            };
            serializzazione = "[" + serializzazione.substring(0, serializzazione.length - 1) + "]";
            $("#tabellaElencoDeterminatoriSerializzata").val(serializzazione);
        };

        vm.spostaSu = function spostaSuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaElencoDeterminatori[indice];
            var elementoPrecedente = vm.datiTabellaElencoDeterminatori[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaElencoDeterminatori, vm.datiTabellaElencoDeterminatori.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaElencoDeterminatori, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaElencoDeterminatori = arrayRiordinato;
            vm.aggiornaElencoDeterminatori();
        };

        vm.spostaGiu = function spostaGiuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaElencoDeterminatori[indice];
            var elementoSuccessivo = vm.datiTabellaElencoDeterminatori[indice + 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaElencoDeterminatori, vm.datiTabellaElencoDeterminatori.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaElencoDeterminatori, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaElencoDeterminatori = arrayRiordinato;
            vm.aggiornaElencoDeterminatori();
        };

        vm.aggiungiDeterminatore = function aggiungiDeterminatore() {
            var determinatoreDaInserire =
                {
                    "id": vm.determinatoreSelezionato.id,
                    "nome": vm.determinatoreSelezionato.nome,
                    "cognome": vm.determinatoreSelezionato.cognome
                };
            vm.datiTabellaElencoDeterminatori.push(determinatoreDaInserire);  // Inserimento della nuova riga in fondo alla tabella
            vm.aggiornaElencoDeterminatori();
            aggiornaDropdownDeterminatori();
        };

        vm.rimuoviDeterminatore = function rimuoviDeterminatore(determinatoreSelezionato) {
            vm.datiTabellaElencoDeterminatori = _.remove(vm.datiTabellaElencoDeterminatori, function (determinatore) { return determinatore != determinatoreSelezionato });
            vm.aggiornaElencoDeterminatori();
            aggiornaDropdownDeterminatori();
        };

        vm.apriModaleDeterminazioni = function apriModaleDeterminazioni() {
            aggiornaDropdownDeterminatori();
            vm.determinatoreSelezionato = vm.determinatori[0];
            var dataDeterminazione = funzioni.trasformaData($("#hiddenDataDiDeterminazione").val());
            vm.dataDeterminazione = dataDeterminazione.data;
            vm.tipoDataDeterminazione = dataDeterminazione.tipo;
        };

        $http.get("/api/determinatori")
            .then(function (response) {
                elencoDeterminatori = response.data;
            });

        $http.get("/api/determinatori/" + esemplarehiddenDeterminazioni.value)
            .then(function (response) {
                vm.datiTabellaElencoDeterminatori = response.data;
            });
    }

})();