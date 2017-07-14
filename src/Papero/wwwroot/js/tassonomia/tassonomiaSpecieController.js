// tassonomiaSpecieController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("tassonomiaSpecieController", tassonomiaSpecieController);

    function tassonomiaSpecieController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoSottofamiglie = {};
        var elencoTribu = {};
        var elencoGeneri = {};
        var elencoSpecie = {};
        var specieCliccata = {};
        var vm = this;

        vm.opzioniTabellaSpecie = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaSpecie = [
            DTColumnDefBuilder.newColumnDef(4).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.specieGiaPresente = false;
        vm.pulsanteInsertDisabilitato = true;
        vm.pulsanteEditDisabilitato = true;
        vm.pulsanteCancellaVisibile = true;
        vm.dropdownDisabilitate = false;

        vm.selezionaFamiglia = function selezionaFamiglia() {
            vm.sottofamiglie = _.filter(elencoSottofamiglie, function (sottofamiglia) { return sottofamiglia.famigliaId == vm.famigliaSelezionata.id });
            vm.sottofamigliaSelezionata = _.find(vm.sottofamiglie, function (sottofamiglia) { return sottofamiglia.nome == "-" });
            vm.selezionaSottofamiglia();
        };

        vm.selezionaSottofamiglia = function selezionaSottofamiglia() {
            vm.tribu = _.filter(elencoTribu, function (tribu) { return tribu.sottofamigliaId == vm.sottofamigliaSelezionata.id });
            vm.tribuSelezionata = _.find(vm.tribu, function (tribu) { return tribu.nome == "-" });
            vm.selezionaTribu();

        };

        vm.selezionaTribu = function selezionaTribu() {
            vm.generi = _.filter(elencoGeneri, function (genere) { return genere.tribuId == vm.tribuSelezionata.id });
            vm.genereSelezionato = vm.generi[0];

        };

        vm.selezionaGenere = function selezionaGenere() {
            vm.specie = _.filter(elencoSpecie, function (specie) { return specie.genereId == vm.genereSelezionato.id });
            vm.pulsanteInserimentoVisibile = (vm.genereSelezionato.nome != "-");  // probabilmente inutile
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
            vm.specieGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertSpecie = "";                              // ...e cancello i campi
            vm.dropdownDisabilitate = false;
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.specieGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditSpecie = "";                                // ...e cancello i campi
            vm.dropdownDisabilitate = false;
        };

        vm.verificaSpecie = function verificaSpecie() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertSpecie) == "" || _.trim(vm.inputInsertSpecie) == "-");
            vm.specieGiaPresente = false;
        };

        vm.verificaEditSpecie = function verificaEditSpecie() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditSpecie) == "" || _.trim(vm.inputEditSpecie) == "-");
            vm.specieGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };


        vm.inserisciSpecie = function inserisciSpecie() {

            // Verifico se la specie che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, la salvo in vm.specieDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.specieDoppia = _.find(vm.specie, function (specie) { return funzioni.confrontaStringhe(specie.nome, vm.inputInsertSpecie) });
            if (vm.specieDoppia) {  // se esiste un doppione, _.find ritorna una località, quindi la if è true
                vm.specieGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/specie",                                          // il valore si può inserire
                           {
                               "nome": _.trim(vm.inputInsertSpecie),
                               "genereId": vm.genereSelezionato.id               // chiamo la API di inserimento
                           })
                    .then(function (response) {                                      // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.specie.push(response.data);                             // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                     // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                       // riabilito il pulsante nel panel heading
                        vm.inputInsertSpecie = "";                                 // e cancello i campi
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");           // Ultima spiaggia se qualcosa va male, ma non si dovrebbe mai vedere
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(specie) {
            vm.annullaInserimento();                       // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditSpecie = specie.nome;
            vm.pulsanteEditDisabilitato = true;
            specieCliccata = specie;                  // memorizzo globalmente la specie da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(specie) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.specienonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.specieDaCancellare = specie.nome;
            vm.pulsanteCancellaVisibile = true;
            specieCliccata = specie;  // memorizzo globalmente la specie da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.dropdownDisabilitate = false;
            vm.specieDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editSpecie = function editSpecie() {

            // Verifico se la specie che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.specieDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.specieDoppia = _.find(vm.specie, function (specie) { return funzioni.confrontaStringhe(specie.nome, vm.inputEditSpecie) });
            if (vm.specieDoppia) {                  // se esiste un doppione, _.find ritorna una specie, quindi la if è true
                vm.specieGiaPresente = true;        // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;   // e disabilito la insert
            }
            else {                                                                 // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/specie",                                         // il valore si può modificare
                           {
                               "id": specieCliccata.id,
                               "genereId": vm.genereSelezionato.id, 
                               "nome": _.trim(vm.inputEditSpecie)          // chiamo la API di modifica
                           })     
                    .then(function (response) {                                          
                        vm.specie[_.findIndex(vm.specie, ["id", specieCliccata.id])].nome = _.trim(vm.inputEditSpecie);  // aggiorno la tabella
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditSpecie = "";                                       // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");  // Ultima spiaggia se qualcosa va male, ma non si dovrebbe mai vedere
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaSpecie = function cancellaSpecie() {

            $http.delete("/api/specie/" + specieCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.specie.splice(_.findIndex(vm.specie, ["id", specieCliccata.id]), 1);  // rimuovo la riga dalla tabella
                    $("#panelCancella").collapse("hide");                                          // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                                         // riabilito il pulsante nel panel heading
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.specienonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/famiglie")
            .then(function (response) {
                vm.famiglie = response.data;
                $http.get("/api/sottofamiglie")
                    .then(function (response) {
                        elencoSottofamiglie = response.data;
                        $http.get("/api/tribu")
                            .then(function (response) {
                                elencoTribu = response.data;
                                $http.get("/api/generi")
                                    .then(function (response) {
                                        elencoGeneri = response.data;
                                        $http.get("/api/specie")
                                            .then(function (response) {
                                                elencoSpecie = response.data;
                                                var idGenereSelezionato = $("#idGenereHidden").val();
                                                if (idGenereSelezionato != 0) {  // se siamo entrati nella pagina passandole un ID di città, dobbiamo riempire le dropdown

                                                    var idTribuSelezionata = _.find(elencoGeneri, function (genere) {
                                                        return genere.id == idGenereSelezionato
                                                    }).tribuId;

                                                    var idSottofamigliaSelezionata = _.find(elencoTribu, function (tribu) {
                                                        return tribu.id == idTribuSelezionata
                                                    }).sottofamigliaId;

                                                    var idFamigliaSelezionata = _.find(elencoSottofamiglie, function (sottofamiglia) {
                                                        return sottofamiglia.id == idSottofamigliaSelezionata
                                                    }).famigliaId;

                                                    vm.famigliaSelezionata = _.find(vm.famiglie, function (famiglia) {
                                                        return famiglia.id == idFamigliaSelezionata
                                                    });

                                                    vm.sottofamiglie = _.filter(elencoSottofamiglie, function (sottofamiglia) {
                                                        return sottofamiglia.famigliaId == vm.famigliaSelezionata.id
                                                    });
                                                    vm.sottofamigliaSelezionata = _.find(vm.sottofamiglie, function (sottofamiglia) {
                                                        return sottofamiglia.id == idSottofamigliaSelezionata
                                                    });

                                                    vm.tribu = _.filter(elencoTribu, function (tribu) {
                                                        return tribu.sottofamigliaId == vm.sottofamigliaSelezionata.id
                                                    });
                                                    vm.tribuSelezionata = _.find(vm.tribu, function (tribu) {
                                                        return tribu.id == idTribuSelezionata
                                                    });

                                                    vm.generi = _.filter(elencoGeneri, function (genere) {
                                                        return genere.tribuId == vm.tribuSelezionata.id
                                                    });
                                                    vm.genereSelezionato = _.find(vm.generi, function (genere) {
                                                        return genere.id == idGenereSelezionato
                                                    });

                                                    vm.specie = _.filter(elencoSpecie, function (specie) {
                                                        return specie.genereId == vm.genereSelezionato.id
                                                    });

                                                    vm.pulsanteInserimentoVisibile = (vm.genereSelezionato.nome != "-");  // verificare, probabilmente inutile (non ci dovrebbero essere generi col trattino)
                                                }
                                                else {  // se siamo entrati nella pagina senza passarle un ID di genere, selezioniamo gli elementi indeterminati
                                                    vm.famigliaSelezionata = vm.famiglie[0];
                                                    vm.selezionaFamiglia();

                                                    vm.sottofamigliaSelezionata = _.find(vm.sottofamiglie, function (sottofamiglia) {
                                                        return sottofamiglia.nome == "-"
                                                    });
                                                    vm.selezionaSottofamiglia();

                                                    vm.tribuSelezionata = _.find(vm.tribu, function (tribu) {
                                                        return tribu.nome == "-"
                                                    });
                                                    vm.selezionaTribu();

                                                    vm.genereSelezionato = vm.generi[0];
                                                    vm.selezionaGenere();
                                                };
                                            });
                                    });
                            });
                    });
            });
    }

})();