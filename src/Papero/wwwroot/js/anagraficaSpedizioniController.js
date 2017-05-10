// anagraficaSpedizioniController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaSpedizioniController", anagraficaSpedizioniController);

    function anagraficaSpedizioniController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var spedizioneCliccata = {};
        var vm = this;

        vm.opzioniTabellaSpedizioni = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaSpedizioni = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.spedizioneGiaPresente = false;
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
            vm.spedizioneGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertSpedizione = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.spedizioneGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditSpedizione = "";                                // ...e cancello il campo
        };

        vm.verificaSpedizione = function verificaSpedizione() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertSpedizione) == "" || _.trim(vm.inputInsertSpedizione) == "-");
            vm.spedizioneGiaPresente = false;
        };

        vm.verificaEditSpedizione = function verificaEditSpedizione() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditSpedizione) == "" || _.trim(vm.inputEditSpedizione) == "-");
            vm.spedizioneGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciSpedizione = function inserisciSpedizione() {

            // Verifico se la spedizione che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, la salvo in vm.spedizioneDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.spedizioneDoppia = _.find(vm.spedizioni, function (spedizione) { return funzioni.confrontaStringhe(spedizione.spedizione, vm.inputInsertSpedizione) });
            if (vm.spedizioneDoppia) {  // se esiste un doppione, _.find ritorna una spedizione, quindi la if è true
                vm.spedizioneGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                               // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/spedizioni",                                    // il valore si può inserire
                           { "spedizione": _.trim(vm.inputInsertSpedizione) })   // chiamo la API di inserimento
                    .then(function (response) {                                  // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.spedizioni.push(response.data);                       // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                 // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                   // riabilito il pulsante nel panel heading
                        vm.inputInsertSpedizione = "";                           // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(spedizione) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditSpedizione = spedizione.spedizione;
            vm.pulsanteEditDisabilitato = true;
            spedizioneCliccata = spedizione;        // memorizzo globalmente la spedizione da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(spedizione) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.spedizionenonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.spedizioneDaCancellare = spedizione.spedizione;
            vm.pulsanteCancellaVisibile = true;
            spedizioneCliccata = spedizione;  // memorizzo globalmente la spedizione da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.spedizioneDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editSpedizione = function editSpedizione() {

            // Verifico se la spedizione che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.spedizioneDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.spedizioneDoppia = _.find(vm.spedizioni, function (spedizione) { return funzioni.confrontaStringhe(spedizione.spedizione, vm.inputEditSpedizione) });
            if (vm.spedizioneDoppia) {               // se esiste un doppione, _.find ritorna una spedizione, quindi la if è true
                vm.spedizioneGiaPresente = true;     // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/spedizioni",                                         // il valore si può modificare
                           { "id": spedizioneCliccata.id,
                             "spedizione": _.trim(vm.inputEditSpedizione) })         // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.spedizioni[_.findIndex(vm.spedizioni, ["id", spedizioneCliccata.id])].spedizione = _.trim(vm.inputEditSpedizione);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditSpedizione = "";                                     // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaSpedizione = function cancellaSpedizione() {

            $http.delete("/api/spedizioni/" + spedizioneCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.spedizioni.splice(_.findIndex(vm.spedizioni, ["id", spedizioneCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.spedizionenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/spedizioni")
            .then(function (response) {
                vm.spedizioni = response.data;
            });
    }

})();