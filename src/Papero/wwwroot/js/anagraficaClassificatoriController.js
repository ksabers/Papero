// anagraficaClassificatoriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaClassificatoriController", anagraficaClassificatoriController);

    function anagraficaClassificatoriController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var classificatoreCliccato = {};
        var vm = this;

        vm.opzioniTabellaClassificatori = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaClassificatori = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.classificatoreGiaPresente = false;
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
            vm.classificatoreGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertClassificatore = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.classificatoreGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditClassificatore = "";                                // ...e cancello il campo
        };

        vm.verificaClassificatore = function verificaClassificatore() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertClassificatore) == "" || _.trim(vm.inputInsertClassificatore) == "-");
            vm.classificatoreGiaPresente = false;
        };

        vm.verificaEditClassificatore = function verificaEditClassificatore() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditClassificatore) == "" || _.trim(vm.inputEditClassificatore) == "-");
            vm.classificatoreGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciClassificatore = function inserisciClassificatore() {

            // Verifico se il classificatore che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.classificatoreDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.classificatoreDoppio = _.find(vm.classificatori, function (classificatore) { return funzioni.confrontaStringhe(classificatore.classificatore, vm.inputInsertClassificatore) });
            if (vm.classificatoreDoppio) {  // se esiste un doppione, _.find ritorna un classificatore, quindi la if è true
                vm.classificatoreGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/classificatori",                                        // il valore si può inserire
                           { "classificatore": _.trim(vm.inputInsertClassificatore) })   // chiamo la API di inserimento
                    .then(function (response) {                                          // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.classificatori.push(response.data);                           // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                         // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputInsertClassificatore = "";                               // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(classificatore) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditClassificatore = classificatore.classificatore;
            vm.pulsanteEditDisabilitato = true;
            classificatoreCliccato = classificatore;  // memorizzo globalmente il classificatore da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(classificatore) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.classificatoreDaCancellare = classificatore.classificatore;
            vm.pulsanteCancellaVisibile = true;
            classificatoreCliccato = classificatore;  // memorizzo globalmente il classificatore da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.classificatoreDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editClassificatore = function editClassificatore() {

            // Verifico se il classificatore che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.classificatoreDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.classificatoreDoppio = _.find(vm.classificatori, function (classificatore) { return funzioni.confrontaStringhe(classificatore.classificatore, vm.inputEditClassificatore) });
            if (vm.classificatoreDoppio) {  // se esiste un doppione, _.find ritorna un classificatore, quindi la if è true
                vm.classificatoreGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/classificatori",                                         // il valore si può modificare
                           { "id": classificatoreCliccato.id,
                             "classificatore": _.trim(vm.inputEditClassificatore) })     // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.classificatori[_.findIndex(vm.classificatori, ["id", classificatoreCliccato.id])].classificatore = vm.inputEditClassificatore;
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditClassificatore = "";                                // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaClassificatore = function cancellaClassificatore() {

            $http.delete("/api/classificatori/" + classificatoreCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.classificatori.splice(_.findIndex(vm.classificatori, ["id", classificatoreCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.classificatorenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/classificatori")
            .then(function (response) {
                vm.classificatori = response.data;
            });


    }

})();