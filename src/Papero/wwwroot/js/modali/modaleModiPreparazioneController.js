//  modaleModiPreparazioneController.js

//  Controller Angular che gestisce la finestra modale di edit dei modi di preparazione e posizioni

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleModiPreparazioneController", modaleModiPreparazioneController);

    function modaleModiPreparazioneController($http, DTOptionsBuilder) {

        var elencoModiPreparazione = [];
        var elencoArmadi = [];
        var elencoVassoi = [];
        var elencoCassetti = [];
        
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
        vm.dropdownArmadi = [];
        vm.dropdownVassoi = [];
        vm.salaSelezionata = null;
        vm.armadioSelezionato = null;
        vm.vassoioSelezionato = null;

        function aggiornaSerializzazione() {           //  Crea una stringa che rappresenta le coppie "id parte preparata, id vassoio" in forma di array serializzato
            var serializzazione = "";

            for (var i = 0; i < vm.datiTabellaModiPreparazione.length; i++) {
                serializzazione = serializzazione + "[" + vm.datiTabellaModiPreparazione[i].parte.id + "," + vm.datiTabellaModiPreparazione[i].vassoio.id + "],";
            };
            serializzazione = "[" + serializzazione.substring(0, serializzazione.length - 1) + "]";
            $("#tabellaElencoPreparatiSerializzata").val(serializzazione);
        };

        function aggiornaDropdownModiPreparazione() {   // Riempie la dropdown dei modi di preprazione togliendo i modi già presenti nella tabella

            var arrayModi = [];   // Array di servizio che serve per tenere l'elenco degli id dei modi di preparazione selezionati nella tabella. Viene usato per filtrare la dropdown
                                  // togliendo i modi già presenti nella tabella


            for (var i = 0; i < vm.datiTabellaModiPreparazione.length; i++)           // Riempimento dell'array di servizio
                arrayModi.push(vm.datiTabellaModiPreparazione[i].parteId);

            vm.dropdownModiPreparazione = _.filter(elencoModiPreparazione, function (preparazione) { return !arrayModi.includes(preparazione.id) });
            vm.modoPreparazioneSelezionato = vm.dropdownModiPreparazione[0];
            aggiornaSerializzazione();
        };

        vm.aggiornaDropdownArmadi = function aggiornaDropdownArmadi() {
            vm.dropdownArmadi = _.filter(elencoArmadi, function (armadio) { return armadio.salaId == vm.salaSelezionata.id });
            vm.armadioSelezionato = vm.dropdownArmadi[0];
            vm.aggiornaDropdownCassetti();
        };

        vm.aggiornaDropdownCassetti = function aggiornaDropdownCassetti() {
            vm.dropdownCassetti = _.filter(elencoCassetti, function (cassetto) { return cassetto.armadioId == vm.armadioSelezionato.id });
            vm.cassettoSelezionato = vm.dropdownCassetti[0];
            vm.aggiornaDropdownVassoi();
        };

        vm.aggiornaDropdownVassoi = function aggiornaDropdownVassoi() {
            vm.dropdownVassoi = _.filter(elencoVassoi, function (vassoio) { return vassoio.cassettoId == vm.cassettoSelezionato.id });
            vm.vassoioSelezionato = vm.dropdownVassoi[0];
        };

        vm.apriModaleModiPreparazione = function caricaModiPreparazione() {
            aggiornaDropdownModiPreparazione();
            vm.modoPreparazioneSelezionato = vm.dropdownModiPreparazione[0];
            vm.salaSelezionata = vm.dropdownSale[0];
            vm.aggiornaDropdownArmadi();    
        };

        vm.spostaSu = function spostaSuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaModiPreparazione[indice];
            var elementoPrecedente = vm.datiTabellaModiPreparazione[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaModiPreparazione, vm.datiTabellaModiPreparazione.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaModiPreparazione, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaModiPreparazione = arrayRiordinato;
            aggiornaSerializzazione();
        };

        vm.spostaGiu = function spostaGiuArray(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaModiPreparazione[indice];
            var elementoSuccessivo = vm.datiTabellaModiPreparazione[indice + 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaModiPreparazione, vm.datiTabellaModiPreparazione.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaModiPreparazione, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaModiPreparazione = arrayRiordinato;
            aggiornaSerializzazione();
        };

        vm.aggiungiPreparazione = function aggiungiPreparazione() {

            var preparazioneDaInserire =         //  Collection che rappresenta una singola riga da inserire nella tabella
                {
                    "esemplareId": inputIdEsemplare.value,
                    "parteId": vm.modoPreparazioneSelezionato.id,
                    "vassoioId": vm.vassoioSelezionato.id,
                    "vassoio": {
                        "id": vm.vassoioSelezionato.id,
                        "vassoio": vm.vassoioSelezionato.vassoio,
                        "cassetto": {
                            "id": vm.cassettoSelezionato.id,
                            "cassetto": vm.cassettoSelezionato.cassetto,
                            "armadio": {
                                "id": vm.armadioSelezionato.id,
                                "armadio": vm.armadioSelezionato.armadio,
                                "sala": {
                                    "id": vm.salaSelezionata.id,
                                    "sala": vm.salaSelezionata.sala
                                }
                            }
                        }
                    },
                    "parte": {
                        "id": vm.modoPreparazioneSelezionato.id,
                        "parte": vm.modoPreparazioneSelezionato.parte
                    }
                };

            vm.datiTabellaModiPreparazione.push(preparazioneDaInserire);  // Inserimento della nuova riga in fondo alla tabella
            aggiornaDropdownModiPreparazione();
        };

        vm.rimuoviPreparazione = function rimuoviPreparazione(preparazioneSelezionata) {
            vm.datiTabellaModiPreparazione = _.remove(vm.datiTabellaModiPreparazione, function (preparazione) { return preparazione != preparazioneSelezionata });
            aggiornaDropdownModiPreparazione();
        };

        $http.get("/api/partipreparate")
            .then(function (response) {
                elencoModiPreparazione = response.data;
            });

        $http.get("/api/preparati/" + inputIdEsemplare.value)
            .then(function (response) {
                vm.datiTabellaModiPreparazione = response.data;
            });

        $http.get("/api/sale")
            .then(function (response) {
                vm.dropdownSale = response.data;
            });

        $http.get("/api/armadi")
            .then(function (response) {
                elencoArmadi = response.data;
            });

        $http.get("/api/cassetti")
            .then(function (response) {
                elencoCassetti = response.data;
            });

        $http.get("/api/vassoi")
            .then(function (response) {
                elencoVassoi = response.data;
            });
    }

})();