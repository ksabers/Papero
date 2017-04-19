// anagraficaCollezioniController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaCollezioniController", anagraficaCollezioniController);

    function anagraficaCollezioniController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var collezioneCliccata = {};
        var vm = this;

        vm.opzioniTabellaCollezioni = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaCollezioni = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.collezioneGiaPresente = false;
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
            vm.collezioneGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertCollezione = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.collezioneGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditCollezione = "";                                // ...e cancello il campo
        };

        vm.verificaCollezione = function verificaCollezione() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertCollezione) == "" || _.trim(vm.inputInsertCollezione) == "-");
            vm.collezioneGiaPresente = false;
        };

        vm.verificaEditCollezione = function verificaEditCollezione() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditCollezione) == "" || _.trim(vm.inputEditCollezione) == "-");
            vm.collezioneGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciCollezione = function inserisciCollezione() {

            // Verifico se la collezione che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, la salvo in vm.collezioneDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.collezioneDoppia = _.find(vm.collezioni, function (collezione) { return funzioni.confrontaStringhe(collezione.collezione, vm.inputInsertCollezione) });
            if (vm.collezioneDoppia) {  // se esiste un doppione, _.find ritorna una collezione, quindi la if è true
                vm.collezioneGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                               // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/collezioni",                                    // il valore si può inserire
                           { "collezione": _.trim(vm.inputInsertCollezione) })   // chiamo la API di inserimento
                    .then(function (response) {                                  // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.collezioni.push(response.data);                       // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                 // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                   // riabilito il pulsante nel panel heading
                        vm.inputInsertCollezione = "";                           // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(collezione) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditCollezione = collezione.collezione;
            vm.pulsanteEditDisabilitato = true;
            collezioneCliccata = collezione;        // memorizzo globalmente la collezione da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(collezione) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.collezioneDaCancellare = collezione.collezione;
            vm.pulsanteCancellaVisibile = true;
            collezioneCliccata = collezione;  // memorizzo globalmente la collezione da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.collezioneDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editCollezione = function editCollezione() {

            // Verifico se la collezione che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.collezioneDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.collezioneDoppia = _.find(vm.collezioni, function (collezione) { return funzioni.confrontaStringhe(collezione.collezione, vm.inputEditCollezione) });
            if (vm.collezioneDoppia) {               // se esiste un doppione, _.find ritorna una collezione, quindi la if è true
                vm.collezioneGiaPresente = true;     // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/collezioni",                                         // il valore si può modificare
                           { "id": collezioneCliccata.id,
                             "collezione": _.trim(vm.inputEditCollezione) })         // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.collezioni[_.findIndex(vm.collezioni, ["id", collezioneCliccata.id])].collezione = vm.inputEditCollezione;
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditCollezione = "";                                     // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaCollezione = function cancellaCollezione() {

            $http.delete("/api/collezioni/" + collezioneCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.collezioni.splice(_.findIndex(vm.collezioni, ["id", collezioneCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.collezionenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/collezioni")
            .then(function (response) {
                vm.collezioni = response.data;
            });
    }

})();