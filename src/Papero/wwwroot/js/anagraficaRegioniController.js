// anagraficaRegioniController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaRegioniController", anagraficaRegioniController);

    function anagraficaRegioniController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoRegioni = {};
        var regioneCliccata = {};
        var vm = this;

        vm.opzioniTabellaRegioni = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaRegioni = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.regioneGiaPresente = false;
        vm.pulsanteInsertDisabilitato = true;
        vm.pulsanteEditDisabilitato = true;
        vm.pulsanteCancellaVisibile = true;
        vm.dropdownDisabilitate = false;


        vm.selezionaNazione = function selezionaNazione() {
            vm.regioni = _.filter(elencoRegioni, function (regione) { return regione.nazioneId == vm.nazioneSelezionata.id });
            vm.pulsanteInserimentoVisibile = (vm.nazioneSelezionata.nazione != "-");  // Si può inserire un regione solo in una nazione esistente, non nella nazione indeterminata
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
            vm.regioneGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertRegione = "";                              // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.regioneGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditRegione = "";                                // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.verificaRegione = function verificaRegione() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertRegione) == "" || _.trim(vm.inputInsertRegione) == "-");
            vm.regioneGiaPresente = false;
        };

        vm.verificaEditRegione = function verificaEditRegione() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditRegione) == "" || _.trim(vm.inputEditRegione) == "-");
            vm.regioneGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciRegione = function inserisciRegione() {

            // Verifico se l'regione che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.regioneDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.regioneDoppia = _.find(vm.regioni, function (regione) { return funzioni.confrontaStringhe(regione.regione, vm.inputInsertRegione) });
            if (vm.regioneDoppia) {  // se esiste un doppione, _.find ritorna un regione, quindi la if è true
                vm.regioneGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/regioni",                                        // il valore si può inserire
                           {
                               "regione": _.trim(vm.inputInsertRegione),
                               "nazioneId": vm.nazioneSelezionata.id
                           })   // chiamo la API di inserimento
                    .then(function (response) {                                          // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.regioni.push(response.data);                           // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                         // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputInsertRegione = "";                               // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(regione) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditRegione = regione.regione;
            vm.pulsanteEditDisabilitato = true;
            regioneCliccata = regione;  // memorizzo globalmente l'regione da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(regione) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.regionenonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.regioneDaCancellare = regione.regione;
            vm.pulsanteCancellaVisibile = true;
            regioneCliccata = regione;  // memorizzo globalmente l'regione da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.dropdownDisabilitate = false;
            vm.regioneDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editRegione = function editRegione() {

            // Verifico se l'regione che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.regioneDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.regioneDoppia = _.find(vm.regioni, function (regione) { return funzioni.confrontaStringhe(regione.regione, vm.inputEditRegione) });
            if (vm.regioneDoppia) {  // se esiste un doppione, _.find ritorna un regione, quindi la if è true
                vm.regioneGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/regioni",                                         // il valore si può modificare
                           {
                               "id": regioneCliccata.id,
                               "regione": _.trim(vm.inputEditRegione),      // chiamo la API di modifica
                               "nazioneId": vm.nazioneSelezionata.id
                           })
                    .then(function (response) {                                          
                        vm.regioni[_.findIndex(vm.regioni, ["id", regioneCliccata.id])].regione = _.trim(vm.inputEditRegione);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditRegione = "";                                // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaRegione = function cancellaRegione() {

            $http.delete("/api/regioni/" + regioneCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.regioni.splice(_.findIndex(vm.regioni, ["id", regioneCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.regionenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/nazioni")
           .then(function (response) {
               vm.nazioni = response.data;
               $http.get("/api/regioni")
                   .then(function (response) {
                       elencoRegioni = response.data;
                       if ($("#idNazioneHidden").val() != 0) {
                           vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) { return nazione.id == $("#idNazioneHidden").val() });
                       }
                       else {
                           vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) { return nazione.nazione == "-" });
                       };
                       vm.selezionaNazione();
                   });
           });
    }

})();