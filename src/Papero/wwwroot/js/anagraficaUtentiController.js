﻿// anagraficaUtentiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaUtentiController", anagraficaUtentiController);

    function anagraficaUtentiController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var utenteCliccato = {};
        var vm = this;

        vm.utenti = {};
        vm.ruoli = {};

        vm.opzioniTabellaUtenti = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.colonneTabellaUtenti = [
            DTColumnDefBuilder.newColumnDef(3).notSortable(), // Impedisce l'ordinamento della tabella sulle colonne dei pulsanti e dell'email
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.utenteGiaPresente = false;
        vm.pulsanteInsertDisabilitato = true;
        vm.pulsanteEditDisabilitato = true;
        vm.pulsanteCancellaVisibile = true;

        vm.apriPannelloInserimento = function apriPannelloInserimento() {   // Quando viene aperto il pannello di inserimento...
            vm.annullaEdit();                                               // ...chiudo il pannello di edit (in realtà eseguo solo le azioni di chiusura, il pannello non può
            // essere aperto perché il pulsante di inserimento a questo punto è già invisibile)
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;                         // ...rendo invisibile il pulsante di inserimento
            $("#panelInserimento").collapse("show");                        // ...e mostro il pannello di inserimento
        };

        vm.annullaInserimento = function annullaInserimento() {             // Quando viene annullato un inserimento...
            $("#panelInserimento").collapse("hide");                        // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ...rendo possibile riaprirlo
            vm.utenteGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertUtente = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.utenteGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditUtente = "";                                // ...e cancello il campo
        };

        vm.verificaUtente = function verificaUtente() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertUtente) == "" || _.trim(vm.inputInsertUtente) == "-");
            vm.utenteGiaPresente = false;
        };

        vm.verificaEditUtente = function verificaEditUtente() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditUtente) == "" || _.trim(vm.inputEditUtente) == "-");
            vm.utenteGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciUtente = function inserisciUtente() {

            // Verifico se il utente che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.utenteDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.utenteDoppio = _.find(vm.utenti, function (utente) { return funzioni.confrontaStringhe(utente.utente, vm.inputInsertUtente) });
            if (vm.utenteDoppio) {  // se esiste un doppione, _.find ritorna un utente, quindi la if è true
                vm.utenteGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/utenti",                                        // il valore si può inserire
                           { "utente": _.trim(vm.inputInsertUtente) })   // chiamo la API di inserimento
                    .then(function (response) {                                          // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.utenti.push(response.data);                           // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                         // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputInsertUtente = "";                               // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(utente) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditUtente = utente.utente;
            vm.pulsanteEditDisabilitato = true;
            utenteCliccato = utente;  // memorizzo globalmente il utente da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(utente) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.utentenonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.utenteDaCancellare = utente.utente;
            vm.pulsanteCancellaVisibile = true;
            utenteCliccato = utente;  // memorizzo globalmente il utente da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.utenteDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editUtente = function editUtente() {

            // Verifico se il utente che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.utenteDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.utenteDoppio = _.find(vm.utenti, function (utente) { return funzioni.confrontaStringhe(utente.utente, vm.inputEditUtente) });
            if (vm.utenteDoppio) {  // se esiste un doppione, _.find ritorna un utente, quindi la if è true
                vm.utenteGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/utenti",                                         // il valore si può modificare
                           { "id": utenteCliccato.id,
                             "utente": _.trim(vm.inputEditUtente) })     // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.utenti[_.findIndex(vm.utenti, ["id", utenteCliccato.id])].utente = _.trim(vm.inputEditUtente);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditUtente = "";                                // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaUtente = function cancellaUtente() {

            $http.delete("/api/utenti/" + utenteCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.utenti.splice(_.findIndex(vm.utenti, ["id", utenteCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.utentenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        vm.elencoRuoli = function elencoRuoli(utente) {
            var elenco = "";
            for (var i = 0; i < utente.roles.length; i++) {
                elenco = elenco + vm.ruoli[_.findIndex(vm.ruoli, ["id", utente.roles[i].roleId])].name + ", ";
            }
            elenco = elenco.slice(0, -2);
            return elenco;
        };

        $http.get("/api/ruoli")
            .then(function (response) {
                vm.ruoli = response.data;
                $http.get("/api/utenti")
                    .then(function (response) {
                        vm.utenti = response.data;
                    });
            });
    }

})();