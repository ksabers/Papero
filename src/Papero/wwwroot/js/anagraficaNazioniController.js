// anagraficaNazioniController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaNazioniController", anagraficaNazioniController);

    function anagraficaNazioniController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var nazioneCliccata = {};
        var vm = this;

        vm.opzioniTabellaNazioni = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaNazioni = [
            DTColumnDefBuilder.newColumnDef(5).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.nazioneGiaPresente = false;
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
            vm.nazioneGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertNazione = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.nazioneGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditNazione = "";                                // ...e cancello il campo
        };

        vm.verificaNazione = function verificaNazione() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertNazione) == "" || _.trim(vm.inputInsertNazione) == "-");
            vm.nazioneGiaPresente = false;
        };

        vm.verificaiso31661Alpha2 = function verificaiso31661Alpha2() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertiso31661Alpha2) == "");
            vm.nazioneGiaPresente = false;
        };

        vm.verificaiso31661Alpha3 = function verificaiso31661Alpha3() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertiso31661Alpha3) == "");
            vm.nazioneGiaPresente = false;
        };

        vm.verificaiso31661 = function verificaiso31661() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertiso31661) == "");
            vm.nazioneGiaPresente = false;
        };

        vm.verificaEditNazione = function verificaEditNazione() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditNazione) == "" || _.trim(vm.inputEditNazione) == "-");
            vm.nazioneGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.verificaEditiso31661Alpha2 = function verificaEditiso31661Alpha2() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditiso31661Alpha2) == "");
            vm.nazioneGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.verificaEditiso31661Alpha3 = function verificaEditiso31661Alpha3() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditiso31661Alpha3) == "");
            vm.nazioneGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciNazione = function inserisciNazione() {

            // Verifico se la nazione che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, la salvo in vm.nazioneDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.nazioneDoppia = _.find(vm.nazioni, function (nazione) { return funzioni.confrontaStringhe(nazione.nazione, vm.inputInsertNazione) });
            if (vm.nazioneDoppia) {  // se esiste un doppione, _.find ritorna una nazione, quindi la if è true
                vm.nazioneGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                               // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/nazioni",                                    // il valore si può inserire
                           {
                               "nazione": _.trim(vm.inputInsertNazione),
                               "iso31661Alpha2": _.trim(vm.inputInsertiso31661Alpha2),
                               "iso31661Alpha3": _.trim(vm.inputInsertiso31661Alpha3),
                               "iso31661": _.trim(vm.inputInsertiso31661)
                           })                                                    // chiamo la API di inserimento
                    .then(function (response) {                                  // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.nazioni.push(response.data);                          // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                 // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                   // riabilito il pulsante nel panel heading
                        vm.inputInsertNazione = "";                              // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(nazione) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditNazione = nazione.nazione;
            vm.inputEditiso31661Alpha2 = nazione.iso31661Alpha2;
            vm.inputEditiso31661Alpha3 = nazione.iso31661Alpha3;
            vm.inputEditiso31661 = nazione.iso31661;
            vm.pulsanteEditDisabilitato = true;
            nazioneCliccata = nazione;        // memorizzo globalmente la nazione da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(nazione) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.nazionenonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.nazioneDaCancellare = nazione.nazione;
            vm.pulsanteCancellaVisibile = true;
            nazioneCliccata = nazione;  // memorizzo globalmente la nazione da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.nazioneDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editNazione = function editNazione() {

            // Verifico se la nazione che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.nazioneDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.nazioneDoppia = _.find(vm.nazioni, function (nazione) { return funzioni.confrontaStringhe(nazione.nazione, vm.inputEditNazione) });
            if (vm.nazioneDoppia) {               // se esiste un doppione, _.find ritorna una nazione, quindi la if è true
                vm.nazioneGiaPresente = true;     // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/nazioni",                                         // il valore si può modificare
                           {
                               "id": nazioneCliccata.id,
                               "nazione": _.trim(vm.inputEditNazione),
                               "iso31661Alpha2": _.trim(vm.inputEditiso31661Alpha2),
                               "iso31661Alpha3": _.trim(vm.inputEditiso31661Alpha3),
                               "iso31661": _.trim(vm.inputEditiso31661)
                           })                                                       // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.nazioni[_.findIndex(vm.nazioni, ["id", nazioneCliccata.id])].nazione = _.trim(vm.inputEditNazione);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditNazione = "";                                     // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaNazione = function cancellaNazione() {

            $http.delete("/api/nazioni/" + nazioneCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.nazioni.splice(_.findIndex(vm.nazioni, ["id", nazioneCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.nazionenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/nazioni")
            .then(function (response) {
                vm.nazioni = response.data;
            });
    }

})();