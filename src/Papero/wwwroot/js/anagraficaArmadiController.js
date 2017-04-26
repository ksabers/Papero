// anagraficaArmadiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaArmadiController", anagraficaArmadiController);

    function anagraficaArmadiController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoArmadi = {};
        var armadioCliccato = {};
        var vm = this;

        vm.opzioniTabellaArmadi = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaArmadi = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.armadioGiaPresente = false;
        vm.pulsanteInsertDisabilitato = true;
        vm.pulsanteEditDisabilitato = true;
        vm.pulsanteCancellaVisibile = true;

        vm.selezionaSala = function selezionaSala() {
            vm.armadi = _.filter(elencoArmadi, function (armadio) { return armadio.salaId == vm.salaSelezionata.id });
            //alert("ciao");
        };

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
            vm.armadioGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertArmadio = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.armadioGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditArmadio = "";                                // ...e cancello il campo
        };

        vm.verificaArmadio = function verificaArmadio() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertArmadio) == "" || _.trim(vm.inputInsertArmadio) == "-");
            vm.armadioGiaPresente = false;
        };

        vm.verificaEditArmadio = function verificaEditArmadio() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditArmadio) == "" || _.trim(vm.inputEditArmadio) == "-");
            vm.armadioGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciArmadio = function inserisciArmadio() {

            // Verifico se l'armadio che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.armadioDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.armadioDoppio = _.find(vm.armadi, function (armadio) { return funzioni.confrontaStringhe(armadio.armadio, vm.inputInsertArmadio) });
            if (vm.armadioDoppio) {  // se esiste un doppione, _.find ritorna un armadio, quindi la if è true
                vm.armadioGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/armadi",                                        // il valore si può inserire
                           { "armadio": _.trim(vm.inputInsertArmadio) })   // chiamo la API di inserimento
                    .then(function (response) {                                          // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.armadi.push(response.data);                           // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                         // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputInsertArmadio = "";                               // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(armadio) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditArmadio = armadio.armadio;
            vm.pulsanteEditDisabilitato = true;
            armadioCliccato = armadio;  // memorizzo globalmente l'armadio da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(armadio) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.armadiononCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.armadioDaCancellare = armadio.armadio;
            vm.pulsanteCancellaVisibile = true;
            armadioCliccato = armadio;  // memorizzo globalmente l'armadio da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.armadioDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editArmadio = function editArmadio() {

            // Verifico se l'armadio che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.armadioDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.armadioDoppio = _.find(vm.armadi, function (armadio) { return funzioni.confrontaStringhe(armadio.armadio, vm.inputEditArmadio) });
            if (vm.armadioDoppio) {  // se esiste un doppione, _.find ritorna un armadio, quindi la if è true
                vm.armadioGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/armadi",                                         // il valore si può modificare
                           { "id": armadioCliccato.id,
                             "armadio": _.trim(vm.inputEditArmadio) })     // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.armadi[_.findIndex(vm.armadi, ["id", armadioCliccato.id])].armadio = _.trim(vm.inputEditArmadio);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditArmadio = "";                                // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaArmadio = function cancellaArmadio() {

            $http.delete("/api/armadi/" + armadioCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.armadi.splice(_.findIndex(vm.armadi, ["id", armadioCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.armadiononCancellabile = true;
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
                       if ($("#idSalaHidden").val() != 0) {
                           vm.salaSelezionata = _.find(vm.sale, function (sala) { return sala.id == $("#idSalaHidden").val() });
                       }
                       else {
                           vm.salaSelezionata = _.find(vm.sale, function (sala) { return sala.sala == "-" });
                       };
                       vm.selezionaSala();
                   });
           });
    }

})();