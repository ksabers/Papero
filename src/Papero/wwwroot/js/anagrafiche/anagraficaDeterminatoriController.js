// anagraficaDeterminatoriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaDeterminatoriController", anagraficaDeterminatoriController);

    function anagraficaDeterminatoriController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var determinatoreCliccato = {};
        var vm = this;

        vm.opzioniTabellaDeterminatori = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaDeterminatori = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.determinatoreGiaPresente = false;
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
            vm.determinatoreGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertDeterminatore = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.determinatoreGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditDeterminatore = "";                                // ...e cancello il campo
        };

        vm.verificaDeterminatore = function verificaDeterminatore() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertNomeDeterminatore) == "" || _.trim(vm.inputInsertCognomeDeterminatore) == "");
            vm.determinatoreGiaPresente = false;
        };

        vm.verificaEditDeterminatore = function verificaEditDeterminatore() {  // Controllo che il campo edit sia valido (non vuoto, non spazi)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditNomeDeterminatore) == "" || _.trim(vm.inputEditCognomeDeterminatore) == "");
            vm.determinatoreGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciDeterminatore = function inserisciDeterminatore() {

            // Verifico se il determinatore che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, la salvo in vm.determinatoreDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.determinatoreDoppio = _.find(vm.determinatori, function (determinatore) {
                return
                (funzioni.confrontaStringhe(determinatore.nome, vm.inputInsertNomeDeterminatore)
                &&
                funzioni.confrontaStringhe(determinatore.cognome, vm.inputInsertCognomeDeterminatore))
            });
            if (vm.determinatoreDoppio) {  // se esiste un doppione, _.find ritorna un determinatore, quindi la if è true
                vm.determinatoreGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                  // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/determinatori",                                    // il valore si può inserire
                           { "nome": _.trim(vm.inputInsertNomeDeterminatore),
                             "cognome": _.trim(vm.inputInsertCognomeDeterminatore)
                           })   // chiamo la API di inserimento
                    .then(function (response) {                                  // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.determinatori.push(response.data);                    // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                 // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                   // riabilito il pulsante nel panel heading
                        vm.inputInsertDeterminatore = "";                        // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(determinatore) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditNomeDeterminatore = determinatore.nome;
            vm.inputEditCognomeDeterminatore = determinatore.cognome;
            vm.pulsanteEditDisabilitato = true;
            determinatoreCliccato = determinatore;        // memorizzo globalmente il determinatore da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(determinatore) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.determinatorenonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.determinatoreDaCancellare = determinatore.nome + " " + determinatore.cognome;
            vm.pulsanteCancellaVisibile = true;
            determinatoreCliccato = determinatore;  // memorizzo globalmente il determinatore da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.determinatoreDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editDeterminatore = function editDeterminatore() {

            // Verifico se il determinatore che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.determinatoreDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.determinatoreDoppio = _.find(vm.determinatori, function (determinatore) {
                return (funzioni.confrontaStringhe(determinatore.nome, vm.inputEditNomeDeterminatore)
                        &&
                        funzioni.confrontaStringhe(determinatore.cognome, vm.inputEditCognomeDeterminatore))
            });
            if (vm.determinatoreDoppio) {               // se esiste un doppione, _.find ritorna un determinatore, quindi la if è true
                vm.determinatoreGiaPresente = true;     // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/determinatori",                                         // il valore si può modificare
                           { "id": determinatoreCliccato.id,
                             "nome": _.trim(vm.inputEditNomeDeterminatore),
                             "cognome": _.trim(vm.inputEditCognomeDeterminatore)})         // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.determinatori[_.findIndex(vm.determinatori, ["id", determinatoreCliccato.id])].nome = _.trim(vm.inputEditNomeDeterminatore);
                        vm.determinatori[_.findIndex(vm.determinatori, ["id", determinatoreCliccato.id])].cognome = _.trim(vm.inputEditCognomeDeterminatore);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditDeterminatore = "";                                     // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaDeterminatore = function cancellaDeterminatore() {

            $http.delete("/api/determinatori/" + determinatoreCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.determinatori.splice(_.findIndex(vm.determinatori, ["id", determinatoreCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.determinatorenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {
            })
        };

        $http.get("/api/determinatori")
            .then(function (response) {
                vm.determinatori = response.data;
            });
    }

})();