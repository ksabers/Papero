// anagraficaCassettiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaCassettiController", anagraficaCassettiController);

    function anagraficaCassettiController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoCassetti = {};
        var elencoArmadi = {};
        var cassettoCliccato = {};
        var vm = this;

        vm.opzioniTabellaCassetti = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaCassetti = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.cassettoGiaPresente = false;
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
            vm.pulsanteInserimentoVisibile = (vm.armadioSelezionato.armadio != "-");  // Si può inserire un cassetto solo in un armadio esistente, non in quello indeterminato
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
            vm.cassettoGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertCassetto = "";                              // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.cassettoGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditCassetto = "";                                // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.verificaCassetto = function verificaCassetto() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertCassetto) == "" || _.trim(vm.inputInsertCassetto) == "-");
            vm.cassettoGiaPresente = false;
        };

        vm.verificaEditCassetto = function verificaEditCassetto() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditCassetto) == "" || _.trim(vm.inputEditCassetto) == "-");
            vm.cassettoGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciCassetto = function inserisciCassetto() {

            // Verifico se l'cassetto che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.cassettoDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.cassettoDoppio = _.find(vm.cassetti, function (cassetto) { return funzioni.confrontaStringhe(cassetto.cassetto, vm.inputInsertCassetto) });
            if (vm.cassettoDoppio) {  // se esiste un doppione, _.find ritorna un cassetto, quindi la if è true
                vm.cassettoGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/cassetti",                                        // il valore si può inserire
                           {
                               "armadioId": vm.armadioSelezionato.id,
                               "cassetto": _.trim(vm.inputInsertCassetto)   // chiamo la API di inserimento
                           })
                    .then(function (response) {                                          // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.cassetti.push(response.data);                           // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                         // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputInsertCassetto = "";                               // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(cassetto) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditCassetto = cassetto.cassetto;
            vm.pulsanteEditDisabilitato = true;
            cassettoCliccato = cassetto;  // memorizzo globalmente l'cassetto da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(cassetto) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.cassettononCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.cassettoDaCancellare = cassetto.cassetto;
            vm.pulsanteCancellaVisibile = true;
            cassettoCliccato = cassetto;  // memorizzo globalmente l'cassetto da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.dropdownDisabilitate = false;
            vm.cassettoDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editCassetto = function editCassetto() {

            // Verifico se l'cassetto che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.cassettoDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.cassettoDoppio = _.find(vm.cassetti, function (cassetto) { return funzioni.confrontaStringhe(cassetto.cassetto, vm.inputEditCassetto) });
            if (vm.cassettoDoppio) {  // se esiste un doppione, _.find ritorna un cassetto, quindi la if è true
                vm.cassettoGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                 // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/cassetti",                                         // il valore si può modificare
                           {
                               "id": cassettoCliccato.id,
                               "armadioId": vm.armadioSelezionato.id,     // chiamo la API di modifica
                               "cassetto": _.trim(vm.inputEditCassetto)
                           })
                    .then(function (response) {                                          
                        vm.cassetti[_.findIndex(vm.cassetti, ["id", cassettoCliccato.id])].cassetto = _.trim(vm.inputEditCassetto);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditCassetto = "";                                // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaCassetto = function cancellaCassetto() {

            $http.delete("/api/cassetti/" + cassettoCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.cassetti.splice(_.findIndex(vm.cassetti, ["id", cassettoCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.cassettononCancellabile = true;
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
                               if ($("#idArmadioHidden").val() != 0) {
                                   vm.salaSelezionata = _.find(vm.sale, function (sala) {
                                       return sala.id == _.find(elencoArmadi, function (armadio) { return armadio.id == $("#idArmadioHidden").val() }).salaId
                                   });
                                   vm.selezionaSala();
                                   vm.armadioSelezionato = _.find(vm.armadi, function (armadio) { return armadio.id == $("#idArmadioHidden").val() });
                               }
                               else {
                                   vm.salaSelezionata = _.find(vm.sale, function (sala) { return sala.sala == "-" });
                                   vm.selezionaSala();
                                   vm.armadioSelezionato = _.find(vm.armadi, function (armadio) { return armadio.armadio == "-" });
                               };
                               vm.selezionaArmadio();
                           });                     
                   });
           });
    }

})();