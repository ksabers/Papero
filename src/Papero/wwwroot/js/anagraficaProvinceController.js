// anagraficaProvinceController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaProvinceController", anagraficaProvinceController);

    function anagraficaProvinceController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoProvince = {};
        var elencoRegioni = {};
        var provinciaCliccata = {};
        var vm = this;

        vm.opzioniTabellaProvince = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaProvince = [
            DTColumnDefBuilder.newColumnDef(3).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.provinciaGiaPresente = false;
        vm.pulsanteInsertDisabilitato = true;
        vm.pulsanteEditDisabilitato = true;
        vm.pulsanteCancellaVisibile = true;
        vm.dropdownDisabilitate = false;

        vm.selezionaNazione = function selezionaNazione() {
            vm.regioni = _.filter(elencoRegioni, function (regione) { return regione.nazioneId == vm.nazioneSelezionata.id });
            vm.regioneSelezionata = _.find(vm.regioni, function (regione) { return regione.regione == "-" });
            vm.selezionaRegione();
        };

        vm.selezionaRegione = function selezionaRegione() {
            vm.province = _.filter(elencoProvince, function (provincia) { return provincia.regioneId == vm.regioneSelezionata.id });
            vm.pulsanteInserimentoVisibile = (vm.regioneSelezionata.regione != "-");  // Si può inserire un provincia solo in un regione esistente, non in quello indeterminato
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
            vm.provinciaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertProvincia = "";                              // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.provinciaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditProvincia = "";                                // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.verificaProvincia = function verificaProvincia() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertProvincia) == "" || _.trim(vm.inputInsertProvincia) == "-");
            vm.provinciaGiaPresente = false;
        };

        vm.verificaEditProvincia = function verificaEditProvincia() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditProvincia) == "" || _.trim(vm.inputEditProvincia) == "-");
            vm.provinciaGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciProvincia = function inserisciProvincia() {

            // Verifico se la provincia che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.provinciaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.provinciaDoppia = _.find(vm.province, function (provincia) { return funzioni.confrontaStringhe(provincia.provincia, vm.inputInsertProvincia) });
            if (vm.provinciaDoppia) {  // se esiste un doppione, _.find ritorna un provincia, quindi la if è true
                vm.provinciaGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/province",                                        // il valore si può inserire
                           {
                               "provincia": _.trim(vm.inputInsertProvincia),
                               "regioneId": vm.regioneSelezionata.id,
                               "siglaProvincia": _.trim(vm.inputInsertSiglaProvincia)
                           })   // chiamo la API di inserimento
                    .then(function (response) {                                          // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.province.push(response.data);                           // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                         // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputInsertProvincia = "";                               // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(provincia) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditProvincia = provincia.provincia;
            vm.pulsanteEditDisabilitato = true;
            provinciaCliccata = provincia;  // memorizzo globalmente la provincia da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(provincia) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.provincianonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.provinciaDaCancellare = provincia.provincia;
            vm.pulsanteCancellaVisibile = true;
            provinciaCliccata = provincia;  // memorizzo globalmente la provincia da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.dropdownDisabilitate = false;
            vm.provinciaDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editProvincia = function editProvincia() {

            // Verifico se la provincia che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.provinciaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.provinciaDoppia = _.find(vm.province, function (provincia) { return funzioni.confrontaStringhe(provincia.provincia, vm.inputEditProvincia) });
            if (vm.provinciaDoppia) {  // se esiste un doppione, _.find ritorna un provincia, quindi la if è true
                vm.provinciaGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/province",                                         // il valore si può modificare
                           {
                               "id": provinciaCliccata.id,
                               "provincia": _.trim(vm.inputEditProvincia),
                               "regioneId": vm.regioneSelezionata.id,
                               "siglaProvincia": _.trim(vm.inputEditSiglaProvincia)
                           })     // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.province[_.findIndex(vm.province, ["id", provinciaCliccata.id])].provincia = _.trim(vm.inputEditProvincia);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditProvincia = "";                                // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaProvincia = function cancellaProvincia() {

            $http.delete("/api/province/" + provinciaCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.province.splice(_.findIndex(vm.province, ["id", provinciaCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.provincianonCancellabile = true;
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
                       $http.get("/api/province")
                           .then(function (response) {
                               elencoProvince = response.data;
                               if ($("#idRegioneHidden").val() != 0) {
                                   vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) {
                                       return nazione.id == _.find(elencoRegioni, function (regione) { return regione.id == $("#idRegioneHidden").val() }).nazioneId
                                   });
                                   vm.selezionaNazione();
                                   vm.regioneSelezionata = _.find(vm.regioni, function (regione) { return regione.id == $("#idRegioneHidden").val() });
                               }
                               else {
                                   vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) { return nazione.nazione == "-" });
                                   vm.selezionaNazione();
                                   vm.regioneSelezionata = _.find(vm.regioni, function (regione) { return regione.regione == "-" });
                               };
                               vm.selezionaRegione();
                           });                     
                   });
           });
    }

})();