// anagraficaPreparatoriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaPreparatoriController", anagraficaPreparatoriController);

    function anagraficaPreparatoriController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var preparatoreCliccato = {};
        var vm = this;

        vm.opzioniTabellaPreparatori = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaPreparatori = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.preparatoreGiaPresente = false;
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
            vm.preparatoreGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertPreparatore = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.preparatoreGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditPreparatore = "";                                // ...e cancello il campo
        };

        vm.verificaPreparatore = function verificaPreparatore() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertNomePreparatore) == "" || _.trim(vm.inputInsertCognomePreparatore) == "");
            vm.preparatoreGiaPresente = false;
        };

        vm.verificaEditPreparatore = function verificaEditPreparatore() {  // Controllo che il campo edit sia valido (non vuoto, non spazi)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditNomePreparatore) == "" || _.trim(vm.inputEditCognomePreparatore) == "");
            vm.preparatoreGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciPreparatore = function inserisciPreparatore() {

            // Verifico se il preparatore che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, la salvo in vm.preparatoreDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.preparatoreDoppio = _.find(vm.preparatori, function (preparatore) {
                return
                (funzioni.confrontaStringhe(preparatore.nome, vm.inputInsertNomePreparatore)
                &&
                funzioni.confrontaStringhe(preparatore.cognome, vm.inputInsertCognomePreparatore))
            });
            if (vm.preparatoreDoppio) {  // se esiste un doppione, _.find ritorna un preparatore, quindi la if è true
                vm.preparatoreGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                  // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/preparatori",                                    // il valore si può inserire
                           { "nome": _.trim(vm.inputInsertNomePreparatore),
                             "cognome": _.trim(vm.inputInsertCognomePreparatore)
                           })   // chiamo la API di inserimento
                    .then(function (response) {                                  // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.preparatori.push(response.data);                    // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                 // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                   // riabilito il pulsante nel panel heading
                        vm.inputInsertPreparatore = "";                        // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(preparatore) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditNomePreparatore = preparatore.nome;
            vm.inputEditCognomePreparatore = preparatore.cognome;
            vm.pulsanteEditDisabilitato = true;
            preparatoreCliccato = preparatore;        // memorizzo globalmente il preparatore da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(preparatore) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.preparatorenonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.preparatoreDaCancellare = preparatore.nome + " " + preparatore.cognome;
            vm.pulsanteCancellaVisibile = true;
            preparatoreCliccato = preparatore;  // memorizzo globalmente il preparatore da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.preparatoreDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editPreparatore = function editPreparatore() {

            // Verifico se il preparatore che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.preparatoreDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.preparatoreDoppio = _.find(vm.preparatori, function (preparatore) {
                return (funzioni.confrontaStringhe(preparatore.nome, vm.inputEditNomePreparatore)
                        &&
                        funzioni.confrontaStringhe(preparatore.cognome, vm.inputEditCognomePreparatore))
            });
            if (vm.preparatoreDoppio) {               // se esiste un doppione, _.find ritorna un preparatore, quindi la if è true
                vm.preparatoreGiaPresente = true;     // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/preparatori",                                         // il valore si può modificare
                           { "id": preparatoreCliccato.id,
                             "nome": _.trim(vm.inputEditNomePreparatore),
                             "cognome": _.trim(vm.inputEditCognomePreparatore)})         // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.preparatori[_.findIndex(vm.preparatori, ["id", preparatoreCliccato.id])].nome = _.trim(vm.inputEditNomePreparatore);
                        vm.preparatori[_.findIndex(vm.preparatori, ["id", preparatoreCliccato.id])].cognome = _.trim(vm.inputEditCognomePreparatore);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditPreparatore = "";                                     // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaPreparatore = function cancellaPreparatore() {

            $http.delete("/api/preparatori/" + preparatoreCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.preparatori.splice(_.findIndex(vm.preparatori, ["id", preparatoreCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.preparatorenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {
            })
        };

        $http.get("/api/preparatori")
            .then(function (response) {
                vm.preparatori = response.data;
            });
    }

})();