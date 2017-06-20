// anagraficaCittaController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaCittaController", anagraficaCittaController);

    function anagraficaCittaController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoCitta = {};
        var elencoRegioni = {};
        var elencoProvince = {};
        var cittaCliccata = {};
        var vm = this;

        vm.opzioniTabellaCitta = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaCitta = [
            DTColumnDefBuilder.newColumnDef(4).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.cittaGiaPresente = false;
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
            vm.provinciaSelezionata = _.find(vm.province, function (provincia) { return provincia.provincia == "-" });
            vm.selezionaProvincia();

        };

        vm.selezionaProvincia = function selezionaProvincia() {
            vm.citta = _.filter(elencoCitta, function (citta) { return citta.provinciaId == vm.provinciaSelezionata.id });
            vm.pulsanteInserimentoVisibile = (vm.provinciaSelezionata.regione != "-");  // Si può inserire un citta solo in una provincia esistente, non in quella indeterminata
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
            vm.cittaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertCitta = "";                              // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.cittaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditCitta = "";                                // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.verificaCitta = function verificaCitta() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertCitta) == "" || _.trim(vm.inputInsertCitta) == "-");
            vm.cittaGiaPresente = false;
        };

        vm.verificaEditCitta = function verificaEditCitta() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditCitta) == "" || _.trim(vm.inputEditCitta) == "-");
            vm.cittaGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.verificaCodiceIstat = function verificaCodiceIstat() {
            vm.pulsanteEditDisabilitato = false;
        };

        vm.verificaCodiceCatastale = function verificaCodiceCatastale() {
            vm.pulsanteEditDisabilitato = false;
        };

        vm.inserisciCitta = function inserisciCitta() {

            // Verifico se la citta che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.cittaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.cittaDoppia = _.find(vm.citta, function (citta) { return funzioni.confrontaStringhe(citta.citta, vm.inputInsertCitta) });
            if (vm.cittaDoppia) {  // se esiste un doppione, _.find ritorna un citta, quindi la if è true
                vm.cittaGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/citta",                                        // il valore si può inserire
                           {
                               "provinciaId": vm.provinciaSelezionata.id,
                               "nomeCitta": _.trim(vm.inputInsertCitta),                    // chiamo la API di inserimento
                               "codiceIstat": _.trim(vm.inputInsertCodiceIstat),
                               "codiceCatastale": _.trim(vm.inputInsertCodiceCatastale)
                           })
                    .then(function (response) {                                 // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.citta.push(response.data);                           // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                  // riabilito il pulsante nel panel heading
                        vm.inputInsertCitta = "";                               // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(citta) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditCitta = citta.nomeCitta;
            vm.inputEditCodiceCatastale = citta.codiceCatastale;
            vm.inputEditCodiceIstat = citta.codiceIstat;
            vm.pulsanteEditDisabilitato = true;
            cittaCliccata = citta;  // memorizzo globalmente la citta da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(citta) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.cittanonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.cittaDaCancellare = citta.nomeCitta;
            vm.pulsanteCancellaVisibile = true;
            cittaCliccata = citta;  // memorizzo globalmente la citta da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.dropdownDisabilitate = false;
            vm.cittaDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editCitta = function editCitta() {

            // Verifico se la città che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.cittaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.cittaDoppia = _.find(vm.citta, function (citta) {
                return funzioni.confrontaStringhe(citta.citta, vm.inputEditCitta)
            });
            if (vm.cittaDoppia) {  // se esiste un doppione, _.find ritorna un citta, quindi la if è true
                vm.cittaGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                     // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/citta",                                                // il valore si può modificare
                           {
                               "id": cittaCliccata.id,
                               "provinciaId": vm.provinciaSelezionata.id,
                               "nomeCitta": _.trim(vm.inputEditCitta),                     // chiamo la API di modifica
                               "codiceIstat": _.trim(vm.inputEditCodiceIstat),
                               "codiceCatastale": _.trim(vm.inputEditCodiceCatastale)
                           })
                    .then(function (response) {                                          
                        vm.citta[_.findIndex(vm.citta, ["id", cittaCliccata.id])].nomeCitta = _.trim(vm.inputEditCitta);
                        vm.citta[_.findIndex(vm.citta, ["id", cittaCliccata.id])].codiceIstat = _.trim(vm.inputEditCodiceIstat);
                        vm.citta[_.findIndex(vm.citta, ["id", cittaCliccata.id])].codiceCatastale = _.trim(vm.inputEditCodiceCatastale);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditCitta = "";                                          // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaCitta = function cancellaCitta() {

            $http.delete("/api/citta/" + cittaCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.citta.splice(_.findIndex(vm.citta, ["id", cittaCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.cittanonCancellabile = true;
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
                                $http.get("/api/citta")
                                    .then(function (response) {
                                        elencoCitta = response.data;
                                        var idProvinciaSelezionata = $("#idProvinciaHidden").val();
                                        if (idProvinciaSelezionata != 0) {
                                            var idRegioneSelezionata = _.find(elencoProvince, function (provincia) {
                                                return provincia.id == idProvinciaSelezionata
                                            }).regioneId;

                                            var idNazioneSelezionata = _.find(elencoRegioni, function (regione) {
                                                return regione.id == idRegioneSelezionata
                                            }).nazioneId;

                                            vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) {
                                                return nazione.id == idNazioneSelezionata
                                            });

                                            vm.regioni = _.filter(elencoRegioni, function (regione) { return regione.nazioneId == vm.nazioneSelezionata.id });
                                            vm.regioneSelezionata = _.find(vm.regioni, function (regione) { return regione.id == idRegioneSelezionata });

                                            vm.province = _.filter(elencoProvince, function (provincia) { return provincia.regioneId == vm.regioneSelezionata.id });
                                            vm.provinciaSelezionata = _.find(vm.province, function (provincia) { return provincia.id == idProvinciaSelezionata });

                                            vm.citta = _.filter(elencoCitta, function (citta) { return citta.provinciaId == vm.provinciaSelezionata.id });                                          

                                        }
                                        else {
                                            vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) {
                                                return nazione.nazione == "-"
                                            });
                                            vm.selezionaNazione();
                                            vm.regioneSelezionata = _.find(vm.regioni, function (regione) {
                                                return regione.regione == "-"
                                            });
                                            vm.selezionaRegione();
                                            vm.provinciaSelezionata = _.find(vm.province, function (provincia) {
                                                return provincia.provincia == "-"
                                            });

                                            vm.selezionaProvincia();
                                        };
                                    });
                            });
                    });
            });


    }

})();