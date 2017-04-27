// anagraficaVassoiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaVassoiController", anagraficaVassoiController);

    function anagraficaVassoiController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoArmadi = {};
        var elencoCassetti = {};
        var elencoVassoi = {};
        var vassoioCliccato = {};
        var vm = this;

        vm.opzioniTabellaVassoi = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaVassoi = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.vassoioGiaPresente = false;
        vm.pulsanteInsertDisabilitato = true;
        vm.pulsanteEditDisabilitato = true;
        vm.pulsanteCancellaVisibile = true;
        vm.dropdownDisabilitate = false;

        vm.selezionaSala = function selezionaSala() {
            vm.armadi = _.filter(elencoArmadi, function (armadio) { return armadio.salaId == vm.salaSelezionata.id });
            vm.armadioSelezionato = _.find(vm.armadi, function (armadio) { return armadio.armadio == "-" });
            vm.selezionaArmadio();
        };

        vm.selezionaArmadio = function selezionaArmadio() {
            vm.cassetti = _.filter(elencoCassetti, function (cassetto) { return cassetto.armadioId == vm.armadioSelezionato.id });
            vm.cassettoSelezionato = _.find(vm.cassetti, function (cassetto) { return cassetto.cassetto == "-" });
            vm.selezionaCassetto();
        };

        vm.selezionaCassetto = function selezionaCassetto() {
            vm.vassoi = _.filter(elencoVassoi, function (vassoio) { return vassoio.cassettoId == vm.cassettoSelezionato.id });
            vm.pulsanteInserimentoVisibile = (vm.cassettoSelezionato.cassetto != "-");  // Si può inserire un vassoio solo in un cassetto esistente, non in quello indeterminato
        };

        vm.apriPannelloInserimento = function apriPannelloInserimento() {   // Quando viene aperto il pannello di inserimento...
            vm.annullaEdit();                                               // ...chiudo il pannello di edit (in realtà eseguo solo le azioni di chiusura, il pannello non può
                                                                            // essere aperto perché il pulsante di inserimento a questo punto è già invisibile)
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;                         // ...rendo invisibile il pulsante di inserimento
            $("#panelInserimento").collapse("show");                        // ...e mostro il pannello di inserimento
            vm.dropdownDisabilitate = true;
        };

        vm.annullaInserimento = function annullaInserimento() {             // Quando viene annullato un inserimento...
            $("#panelInserimento").collapse("hide");                        // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ...rendo possibile riaprirlo
            vm.vassoioGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertVassoio = "";                              // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.vassoioGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditVassoio = "";                                // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.verificaVassoio = function verificaVassoio() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertVassoio) == "" || _.trim(vm.inputInsertVassoio) == "-");
            vm.vassoioGiaPresente = false;
        };

        vm.verificaEditVassoio = function verificaEditVassoio() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditVassoio) == "" || _.trim(vm.inputEditVassoio) == "-");
            vm.vassoioGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciVassoio = function inserisciVassoio() {

            // Verifico se il vassoio che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.vassoioDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.vassoioDoppio = _.find(vm.vassoi, function (vassoio) { return funzioni.confrontaStringhe(vassoio.vassoio, vm.inputInsertVassoio) });
            if (vm.vassoioDoppio) {  // se esiste un doppione, _.find ritorna un vassoio, quindi la if è true
                vm.vassoioGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/vassoi",                                        // il valore si può inserire
                           {
                               "cassettoId" : vm.cassettoSelezionato.id,
                               "vassoio": _.trim(vm.inputInsertVassoio)
                           })   // chiamo la API di inserimento
                    .then(function (response) {                                  // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.vassoi.push(response.data);                           // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                 // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                   // riabilito il pulsante nel panel heading
                        vm.inputInsertVassoio = "";                              // cancello il campo
                        vm.dropdownDisabilitate = false;                         // riabilito le dropdown
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(vassoio) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditVassoio = vassoio.vassoio;
            vm.pulsanteEditDisabilitato = true;
            vassoioCliccato = vassoio;  // memorizzo globalmente l'vassoio da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(vassoio) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.vassoiononCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.vassoioDaCancellare = vassoio.vassoio;
            vm.pulsanteCancellaVisibile = true;
            vassoioCliccato = vassoio;  // memorizzo globalmente l'vassoio da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.dropdownDisabilitate = false;
            vm.vassoioDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editVassoio = function editVassoio() {

            // Verifico se l'vassoio che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.vassoioDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.vassoioDoppio = _.find(vm.vassoi, function (vassoio) { return funzioni.confrontaStringhe(vassoio.vassoio, vm.inputEditVassoio) });
            if (vm.vassoioDoppio) {  // se esiste un doppione, _.find ritorna un vassoio, quindi la if è true
                vm.vassoioGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/vassoi",                                         // il valore si può modificare
                           { "id": vassoioCliccato.id,
                             "vassoio": _.trim(vm.inputEditVassoio) })     // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.vassoi[_.findIndex(vm.vassoi, ["id", vassoioCliccato.id])].vassoio = _.trim(vm.inputEditVassoio);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditVassoio = "";                                // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaVassoio = function cancellaVassoio() {

            $http.delete("/api/vassoi/" + vassoioCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.vassoi.splice(_.findIndex(vm.vassoi, ["id", vassoioCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.vassoiononCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/sale")
           .then(function (response) {
               vm.sale = response.data;
               $http.get("/api/armadi")
                   .then(function (response) {
                       elencoArmadi = response.data;
                       $http.get("/api/cassetti")
                           .then(function (response) {
                               elencoCassetti = response.data;
                               $http.get("/api/vassoi")
                                   .then(function (response) {
                                       elencoVassoi = response.data;
                                       if ($("#idCassettoHidden").val() != 0) {
                                           vm.salaSelezionata = _.find(vm.sale, function (sala) {
                                               return sala.id == _.find(elencoArmadi, function (armadio) {
                                                   return armadio.id == _.find(elencoCassetti, function (cassetto) {
                                                       return cassetto.id == $("#idCassettoHidden").val()
                                                   }).armadioId
                                               }).salaId
                                           });
                                           vm.selezionaSala();
                                           vm.armadioSelezionato = _.find(vm.armadi, function (armadio) {
                                               return armadio.id == _.find(elencoCassetti, function (cassetto) {
                                                   return cassetto.id == $("#idCassettoHidden").val()
                                               }).armadioId
                                           });
                                           vm.selezionaArmadio();
                                           vm.cassettoSelezionato = _.find(vm.cassetti, function (cassetto) {
                                               return cassetto.id == $("#idCassettoHidden").val()
                                           });
                                       }
                                       else {
                                           vm.salaSelezionata = _.find(vm.sale, function (sala) {
                                               return sala.sala == "-"
                                           });
                                           vm.selezionaSala();
                                           vm.armadioSelezionato = _.find(vm.armadi, function (armadio) {
                                               return armadio.armadio == "-"
                                           });
                                           vm.selezionaArmadio();
                                           vm.cassettoSelezionato = _.find(vm.cassetti, function (cassetto) {
                                               return cassetto.cassetto == "-"
                                           });
                                       };
                                       vm.selezionaCassetto();
                                   });
                           });
                   });
           });
    }

})();