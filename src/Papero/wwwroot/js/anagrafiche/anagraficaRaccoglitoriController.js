// anagraficaRaccoglitoriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaRaccoglitoriController", anagraficaRaccoglitoriController);

    function anagraficaRaccoglitoriController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var raccoglitoreCliccato = {};
        var vm = this;

        vm.opzioniTabellaRaccoglitori = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaRaccoglitori = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.raccoglitoreGiaPresente = false;
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
            vm.raccoglitoreGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertRaccoglitore = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.raccoglitoreGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditRaccoglitore = "";                                // ...e cancello il campo
        };

        vm.verificaRaccoglitore = function verificaRaccoglitore() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertRaccoglitore) == "" || _.trim(vm.inputInsertRaccoglitore) == "-");
            vm.raccoglitoreGiaPresente = false;
        };

        vm.verificaEditRaccoglitore = function verificaEditRaccoglitore() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditRaccoglitore) == "" || _.trim(vm.inputEditRaccoglitore) == "-");
            vm.raccoglitoreGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciRaccoglitore = function inserisciRaccoglitore() {

            // Verifico se il raccoglitore che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, la salvo in vm.raccoglitoreDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.raccoglitoreDoppio = _.find(vm.raccoglitori, function (raccoglitore) { return funzioni.confrontaStringhe(raccoglitore.raccoglitore, vm.inputInsertRaccoglitore) });
            if (vm.raccoglitoreDoppio) {  // se esiste un doppione, _.find ritorna un raccoglitore, quindi la if è true
                vm.raccoglitoreGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                               // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/raccoglitori",                                    // il valore si può inserire
                           { "raccoglitore": _.trim(vm.inputInsertRaccoglitore) })   // chiamo la API di inserimento
                    .then(function (response) {                                  // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.raccoglitori.push(response.data);                       // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                 // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                   // riabilito il pulsante nel panel heading
                        vm.inputInsertRaccoglitore = "";                           // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(raccoglitore) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditRaccoglitore = raccoglitore.raccoglitore;
            vm.pulsanteEditDisabilitato = true;
            raccoglitoreCliccato = raccoglitore;        // memorizzo globalmente il raccoglitore da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(raccoglitore) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.raccoglitorenonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.raccoglitoreDaCancellare = raccoglitore.raccoglitore;
            vm.pulsanteCancellaVisibile = true;
            raccoglitoreeCliccato = raccoglitore;  // memorizzo globalmente la raccoglitore da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.raccoglitoreDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editRaccoglitore = function editRaccoglitore() {

            // Verifico se il raccoglitore che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.raccoglitoreDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.raccoglitoreDoppio = _.find(vm.raccoglitori, function (raccoglitore) { return funzioni.confrontaStringhe(raccoglitore.raccoglitore, vm.inputEditRaccoglitore) });
            if (vm.raccoglitoreDoppio) {               // se esiste un doppione, _.find ritorna un raccoglitore, quindi la if è true
                vm.raccoglitoreGiaPresente = true;     // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/raccoglitori",                                         // il valore si può modificare
                           { "id": raccoglitoreCliccato.id,
                             "raccoglitore": _.trim(vm.inputEditRaccoglitore) })         // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.raccoglitori[_.findIndex(vm.raccoglitori, ["id", raccoglitoreCliccato.id])].raccoglitore = _.trim(vm.inputEditRaccoglitore);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditRaccoglitore = "";                                     // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaRaccoglitore = function cancellaRaccoglitore() {

            $http.delete("/api/raccoglitori/" + raccoglitoreCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.raccoglitori.splice(_.findIndex(vm.raccoglitori, ["id", raccoglitoreCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.raccoglitorenonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/raccoglitori")
            .then(function (response) {
                vm.raccoglitori = response.data;
            });
    }

})();