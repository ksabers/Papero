//modaleVecchieDeterminazioniController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleVecchieDeterminazioniController", modaleVecchieDeterminazioniController);

    function modaleVecchieDeterminazioniController($http, DTOptionsBuilder) {

        var elencoVecchiDeterminatori = [];
        var elencoDeterminatori = [];
        var idMassimo = 0;                  // massimo id del vecchio determinatore presente nella tabella delle vecchie determinazioni. Viene usato quando si inserisce una
                                            // riga nuova nella tabella di sinistra. NON è l'id che verrà poi usato in fase di insert nel database, perché questo è filtrato
                                            // per esemplare.

        var vm = this;

        vm.duranteInserimento = 0;


        vm.opzioniTabellaVecchieDeterminazioni = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione delle angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.opzioniTabellaVecchiDeterminatori = DTOptionsBuilder.newOptions()     
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);


        function aggiornaTabellaVecchiDeterminatori(idVecchiaDeterminazione) {
            vm.datiTabellaVecchiDeterminatori = _.filter(elencoVecchiDeterminatori, function (vecchioDeterminatore) { return vecchioDeterminatore.vecchiaDeterminazioneId == idVecchiaDeterminazione });
            aggiornaDropdownVecchiDeterminatori();
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
            vm.invalido = (vm.datiTabellaVecchiDeterminatori.length == 0);
        }

        vm.selezionaRiga = function selezionaRiga(riga) {
            //$("#tabellaVecchieDeterminazioni").DataTable().draw();
            //rerender();
            for (var i = 0; i < vm.datiTabellaVecchieDeterminazioni.length; i++) {
                if (vm.datiTabellaVecchieDeterminazioni[i].id == riga.id) {
                    $($("#tabellaVecchieDeterminazioni tbody tr")[i]).addClass("active")
                }
                else {
                    $($("#tabellaVecchieDeterminazioni tbody tr")[i]).removeClass("active");
                }
            };
            vm.idVecchioDeterminatoreSelezionato = riga.id;
            vm.vecchiaDeterminazioneSelezionata = riga.vecchiaDeterminazione;
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato);
        }

        vm.spostaSu = function spostaSuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaVecchieDeterminazioni[indice];
            var elementoPrecedente = vm.datiTabellaVecchieDeterminazioni[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaVecchieDeterminazioni, vm.datiTabellaVecchieDeterminazioni.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaVecchieDeterminazioni, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaVecchieDeterminazioni = arrayRiordinato;

        };

        vm.spostaGiu = function spostaGiuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaVecchieDeterminazioni[indice];
            var elementoSuccessivo = vm.datiTabellaVecchieDeterminazioni[indice + 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaVecchieDeterminazioni, vm.datiTabellaVecchieDeterminazioni.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaVecchieDeterminazioni, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaVecchieDeterminazioni = arrayRiordinato;

        };

        vm.spostaSuDet = function spostaSuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaVecchiDeterminatori[indice];
            var elementoPrecedente = vm.datiTabellaVecchiDeterminatori[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaVecchiDeterminatori, vm.datiTabellaVecchiDeterminatori.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaVecchiDeterminatori, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaVecchiDeterminatori = arrayRiordinato;
        };

        vm.spostaGiuDet = function spostaGiuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaVecchiDeterminatori[indice];
            var elementoSuccessivo = vm.datiTabellaVecchiDeterminatori[indice + 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaVecchiDeterminatori, vm.datiTabellaVecchiDeterminatori.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaVecchiDeterminatori, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaVecchiDeterminatori = arrayRiordinato;
        };

        function aggiornaDropdownVecchiDeterminatori() {
            var arrayVecchiDeterminatori = [];   // Array di servizio che serve per tenere l'elenco degli id dei determinatori selezionati nella tabella. Viene usato per filtrare la dropdown
                                                 // togliendo i determinatori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaVecchiDeterminatori.length; i++)                        // Riempimento dell'array di servizio
                arrayVecchiDeterminatori.push(vm.datiTabellaVecchiDeterminatori[i].determinatoreId);

            vm.dropdownVecchiDeterminatori = _.filter(elencoDeterminatori, function (determinatore) { return !arrayVecchiDeterminatori.includes(determinatore.id) });
        };

        vm.aggiungiVecchiaDeterminazione = function aggiungiVecchiaDeterminazione() {
            var trovato = false;
            var rigaDaInserire = {};

            for (var i = 0; i < vm.datiTabellaVecchieDeterminazioni.length; i++) {
                if (_.trim(vm.inputVecchiaDeterminazione) == "") {
                    vm.inputVecchiaDeterminazione = "";
                    return;
                }
                if (_.lowerCase(_.trim(vm.datiTabellaVecchieDeterminazioni[i].vecchiaDeterminazione)) == _.lowerCase(_.trim(vm.inputVecchiaDeterminazione))) {
                    trovato = true;
                    break;
                }               
            };

            if (!trovato) {
                idMassimo = idMassimo + 1;
                rigaDaInserire = { id: idMassimo, vecchiaDeterminazione: vm.inputVecchiaDeterminazione };
                vm.datiTabellaVecchieDeterminazioni.push(rigaDaInserire); // si inserisce un elemento formato dal testo
                aggiornaDropdownVecchiDeterminatori();                                                                               // della input e da un nuovo id sicuramente non presente
                vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
                vm.inputVecchiaDeterminazione = "";
                vm.duranteInserimento = idMassimo;   // flag che dice che siamo in modalità di inserimento di un nuovo determinatore
                vm.selezionaRiga(rigaDaInserire);
            }

        };

        vm.aggiungiVecchioDeterminatore = function aggiungiVecchioDeterminatore() {
            var vecchioDeterminatoreDaInserire = { vecchiaDeterminazioneId: vm.idVecchioDeterminatoreSelezionato,
                                                   determinatoreId: vm.vecchioDeterminatoreSelezionato.id,
                                                   determinatore: { nome: vm.vecchioDeterminatoreSelezionato.nome,
                                                                    cognome: vm.vecchioDeterminatoreSelezionato.cognome
                                                                  }
                                                 };
            elencoVecchiDeterminatori.push(vecchioDeterminatoreDaInserire);
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato);
            aggiornaDropdownVecchiDeterminatori();
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
            vm.duranteInserimento = 0;
        };

        vm.rimuoviVecchiaDeterminazione = function rimuoviVecchiaDeterminazione(vecchiaDeterminazioneSelezionata) {
            vm.datiTabellaVecchieDeterminazioni = _.remove(vm.datiTabellaVecchieDeterminazioni, function (determinazione) { return determinazione.id != vecchiaDeterminazioneSelezionata.id });
            aggiornaDropdownVecchiDeterminatori();
            vm.selezionaRiga(vm.datiTabellaVecchieDeterminazioni[0]);
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
            vm.duranteInserimento = 0;
        };

        vm.apriModaleVecchieDeterminazioni = function apriModaleVecchieDeterminazioni() {
            vm.idVecchioDeterminatoreSelezionato = vm.datiTabellaVecchieDeterminazioni[0].id;
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato);
            vm.selezionaRiga(vm.datiTabellaVecchieDeterminazioni[0]);
            aggiornaDropdownVecchiDeterminatori();
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
        }

        $http.get("/api/vecchiedeterminazioni/" + inputIdEsemplare.value)
            .then(function (response) {
                vm.datiTabellaVecchieDeterminazioni = response.data;
                idMassimo = _.maxBy(vm.datiTabellaVecchieDeterminazioni, function (o) { return o.id }).id;  // calcolo del massimo id presente in tabella
            });

        $http.get("/api/vecchideterminatori")
            .then(function (response) {
                elencoVecchiDeterminatori = response.data;
            });

        $http.get("/api/determinatori")
            .then(function (response) {
                elencoDeterminatori = response.data;
            });
    }
})();