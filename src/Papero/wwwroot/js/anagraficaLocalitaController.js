// anagraficaLocalitaController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaLocalitaController", anagraficaLocalitaController);

    function anagraficaLocalitaController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoRegioni = {};
        var elencoProvince = {};
        var elencoCitta = {};
        var elencoLocalita = {};
        var localitaCliccata = {};
        var vm = this;

        vm.opzioniTabellaLocalita = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaLocalita = [
            DTColumnDefBuilder.newColumnDef(4).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.localitaGiaPresente = false;
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
            vm.cittaSelezionata = _.find(vm.citta, function (citta) { return citta.nomeCitta == "-" });

        };

        vm.selezionaCitta = function selezionaCitta() {
            vm.localita = _.filter(elencoLocalita, function (localita) { return localita.cittaId == vm.cittaSelezionata.id });
            vm.pulsanteInserimentoVisibile = (vm.cittaSelezionata.nomeCitta != "-");  // Si può inserire una località solo in una città esistente, non in quella indeterminata
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
            vm.localitaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertLocalita = "";                              // ...e cancello i campi
            vm.inputInsertLatitudine = "";
            vm.inputInsertLongitudine = "";
            vm.dropdownDisabilitate = false;
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.localitaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditLocalita = "";                                // ...e cancello i campi
            vm.inputEditLatitudine = "";
            vm.inputEditLongitudine = "";
            vm.dropdownDisabilitate = false;
        };

        vm.verificaLocalita = function verificaLocalita() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertLocalita) == "" || _.trim(vm.inputInsertLocalita) == "-");
            vm.localitaGiaPresente = false;
        };

        vm.verificaEditLocalita = function verificaEditLocalita() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditLocalita) == "" || _.trim(vm.inputEditLocalita) == "-");
            vm.localitaGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.verificaLatitudine = function verificaLatitudine() {
            vm.pulsanteEditDisabilitato = false;
        };

        vm.verificaLongitudine = function verificaLongitudine() {
            vm.pulsanteEditDisabilitato = false;
        };

        vm.inserisciLocalita = function inserisciLocalita() {

            // Verifico se la località che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.localitaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.localitaDoppia = _.find(vm.localita, function (localita) { return funzioni.confrontaStringhe(localita.nomeLocalita, vm.inputInsertLocalita) });
            if (vm.localitaDoppia) {  // se esiste un doppione, _.find ritorna una località, quindi la if è true
                vm.localitaGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/localita",                                          // il valore si può inserire
                           {
                               "nomeLocalita": _.trim(vm.inputInsertLocalita),
                               "cittaId": vm.cittaSelezionata.id,
                               "latitudine": _.trim(vm.inputInsertLatitudine),       // chiamo la API di inserimento
                               "longitudine": _.trim(vm.inputInsertLongitudine)
                           })
                    .then(function (response) {                                      // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.localita.push(response.data);                             // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                     // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                       // riabilito il pulsante nel panel heading
                        vm.inputInsertLocalita = "";                                 // e cancello i campi
                        vm.inputInsertLatitudine = "";
                        vm.inputInsertLongitudine = "";
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");           // Ultima spiaggia se qualcosa va male, ma non si dovrebbe mai vedere
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(localita) {
            vm.annullaInserimento();                       // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditLocalita = localita.nomeLocalita;
            vm.inputEditLatitudine = localita.latitudine;
            vm.inputEditLongitudine = localita.longitudine;
            vm.pulsanteEditDisabilitato = true;
            localitaCliccata = localita;                  // memorizzo globalmente la località da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(localita) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.localitanonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.localitaDaCancellare = localita.nomeLocalita;
            vm.pulsanteCancellaVisibile = true;
            localitaCliccata = localita;  // memorizzo globalmente la località da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.dropdownDisabilitate = false;
            vm.localitaDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editLocalita = function editLocalita() {

            // Verifico se la località che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.localitaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.localitaDoppia = _.find(vm.localita, function (localita) { return funzioni.confrontaStringhe(localita.nome, vm.inputEditLocalita) });
            if (vm.localitaDoppia) {                  // se esiste un doppione, _.find ritorna una località, quindi la if è true
                vm.localitaGiaPresente = true;        // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;   // e disabilito la insert
            }
            else {                                                                 // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/localita",                                         // il valore si può modificare
                           {
                               "id": localitaCliccata.id,
                               "cittaId": vm.cittaSelezionata.id, 
                               "nomeLocalita": _.trim(vm.inputEditLocalita),          // chiamo la API di modifica
                               "latitudine": _.trim(vm.inputEditLatitudine),
                               "longitudine": _.trim(vm.inputEditLongitudine)
                           })     
                    .then(function (response) {                                          
                        vm.localita[_.findIndex(vm.localita, ["id", localitaCliccata.id])].nomeLocalita = _.trim(vm.inputEditLocalita);  // aggiorno la tabella
                        vm.localita[_.findIndex(vm.localita, ["id", localitaCliccata.id])].latitudine = _.trim(vm.inputEditLatitudine);
                        vm.localita[_.findIndex(vm.localita, ["id", localitaCliccata.id])].longitudine = _.trim(vm.inputEditLongitudine);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditLocalita = "";                                       // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");  // Ultima spiaggia se qualcosa va male, ma non si dovrebbe mai vedere
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaLocalita = function cancellaLocalita() {

            $http.delete("/api/localita/" + localitaCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.localita.splice(_.findIndex(vm.localita, ["id", localitaCliccata.id]), 1);  // rimuovo la riga dalla tabella
                    $("#panelCancella").collapse("hide");                                          // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                                         // riabilito il pulsante nel panel heading
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.localitanonCancellabile = true;
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
                                        $http.get("/api/localita")
                                            .then(function (response) {
                                                elencoLocalita = response.data;
                                                var idCittaSelezionata = $("#idCittaHidden").val();
                                                if (idCittaSelezionata != 0) {  // se siamo entrati nella pagina passandole un ID di città, dobbiamo riempire le dropdown

                                                    var idProvinciaSelezionata = _.find(elencoCitta, function (citta) {
                                                        return citta.id == idCittaSelezionata
                                                    }).provinciaId;

                                                    var idRegioneSelezionata = _.find(elencoProvince, function (provincia) {
                                                        return provincia.id == idProvinciaSelezionata
                                                    }).regioneId;

                                                    var idNazioneSelezionata = _.find(elencoRegioni, function (regione) {
                                                        return regione.id == idRegioneSelezionata
                                                    }).nazioneId;

                                                    vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) {
                                                        return nazione.id == idNazioneSelezionata
                                                    });

                                                    vm.regioni = _.filter(elencoRegioni, function (regione) {
                                                        return regione.nazioneId == vm.nazioneSelezionata.id
                                                    });
                                                    vm.regioneSelezionata = _.find(vm.regioni, function (regione) {
                                                        return regione.id == idRegioneSelezionata
                                                    });

                                                    vm.province = _.filter(elencoProvince, function (provincia) {
                                                        return provincia.regioneId == vm.regioneSelezionata.id
                                                    });
                                                    vm.provinciaSelezionata = _.find(vm.province, function (provincia) {
                                                        return provincia.id == idProvinciaSelezionata
                                                    });

                                                    vm.citta = _.filter(elencoCitta, function (citta) {
                                                        return citta.provinciaId == vm.provinciaSelezionata.id
                                                    });
                                                    vm.cittaSelezionata = _.find(vm.citta, function (citta) {
                                                        return citta.id == idCittaSelezionata
                                                    });

                                                    vm.localita = _.filter(elencoLocalita, function (localita) {
                                                        return localita.cittaId == vm.cittaSelezionata.id
                                                    });
                                                }
                                                else {  // se siamo entrati nella pagina senza passarle un ID di città, selezioniamo gli elementi indeterminati
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

                                                    vm.cittaSelezionata = _.find(vm.citta, function (citta) {
                                                        return citta.nomeCitta == "-"
                                                    });
                                                    vm.selezionaCitta();
                                                };
                                            });
                                    });
                            });
                    });
            });
    }

})();