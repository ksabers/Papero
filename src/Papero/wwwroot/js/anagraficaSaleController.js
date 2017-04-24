// anagraficaSaleController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaSaleController", anagraficaSaleController);

    function anagraficaSaleController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var salaCliccata = {};
        var vm = this;

        vm.opzioniTabellaSale = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaSale = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.salaGiaPresente = false;
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
            vm.salaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertSala = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.salaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditSala = "";                                // ...e cancello il campo
        };

        vm.verificaSala = function verificaSala() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertSala) == "" || _.trim(vm.inputInsertSala) == "-");
            vm.salaGiaPresente = false;
        };

        vm.verificaEditSala = function verificaEditSala() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditSala) == "" || _.trim(vm.inputEditSala) == "-");
            vm.salaGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.inserisciSala = function inserisciSala() {

            // Verifico se la sala che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, la salvo in vm.salaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.salaDoppia = _.find(vm.sale, function (sala) { return funzioni.confrontaStringhe(sala.sala, vm.inputInsertSala) });
            if (vm.salaDoppia) {  // se esiste un doppione, _.find ritorna una sala, quindi la if è true
                vm.salaGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                               // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/sale",                                    // il valore si può inserire
                           { "sala": _.trim(vm.inputInsertSala) })   // chiamo la API di inserimento
                    .then(function (response) {                                  // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        vm.sale.push(response.data);                       // Uso il JSON restituito dalla API per inserire il nuovo valore in tabella
                        $("#panelInserimento").collapse("hide");                 // chiudo il pannello di inserimento
                        vm.pulsanteInserimentoVisibile = true;                   // riabilito il pulsante nel panel heading
                        vm.inputInsertSala = "";                           // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(sala) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditSala = sala.sala;
            vm.pulsanteEditDisabilitato = true;
            salaCliccata = sala;        // memorizzo globalmente la sala da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(sala) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.salanonCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.salaDaCancellare = sala.sala;
            vm.pulsanteCancellaVisibile = true;
            salaCliccata = sala;  // memorizzo globalmente la sala da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.salaDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editSala = function editSala() {

            // Verifico se la sala che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.salaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.salaDoppia = _.find(vm.sale, function (sala) { return funzioni.confrontaStringhe(sala.sala, vm.inputEditSala) });
            if (vm.salaDoppia) {               // se esiste un doppione, _.find ritorna una sala, quindi la if è true
                vm.salaGiaPresente = true;     // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                   // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/sale",                                         // il valore si può modificare
                           { "id": salaCliccata.id,
                             "sala": _.trim(vm.inputEditSala) })         // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.sale[_.findIndex(vm.sale, ["id", salaCliccata.id])].sala = _.trim(vm.inputEditSala);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditSala = "";                                     // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaSala = function cancellaSala() {

            $http.delete("/api/sale/" + salaCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.sale.splice(_.findIndex(vm.sale, ["id", salaCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.salanonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/sale")
            .then(function (response) {
                vm.sale = response.data;
            });
    }

})();