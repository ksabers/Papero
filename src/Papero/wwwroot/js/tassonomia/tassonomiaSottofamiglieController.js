// //tassonomiaSottofamiglieController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("tassonomiaSottofamiglieController", tassonomiaSottofamiglieController);

    function tassonomiaSottofamiglieController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoSottofamiglie = {};
        var sottofamigliaCliccata = {};
        var vm = this;

        vm.opzioniTabellaSottofamiglie = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaSottofamiglie = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.sottofamigliaGiaPresente = false;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.pulsanteEditDisabilitato = true;
        vm.pulsanteCancellaVisibile = true;
        vm.dropdownDisabilitate = false;


        vm.selezionaFamiglia = function selezionaFamiglia() {
            vm.sottofamiglie = _.filter(elencoSottofamiglie, function (sottofamiglia) { return sottofamiglia.famigliaId == vm.famigliaSelezionata.id });
        };


        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.sottofamigliaGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditSottofamiglia = "";                                // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };

        vm.verificaEditSottofamiglia = function verificaEditSottofamiglia() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditSottofamiglia) == "" || _.trim(vm.inputEditSottofamiglia) == "-");
            vm.sottofamigliaGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.apriPannelloEdit = function apriPannelloEdit(sottofamiglia) {
            vm.annullaCancella();
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditSottofamiglia = sottofamiglia.nome;
            vm.pulsanteEditDisabilitato = true;
            sottofamigliaCliccata = sottofamiglia;  // memorizzo globalmente la sottofamiglia da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(armadio) {
            vm.annullaEdit();
            vm.sottofamiglianonCancellabile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.sottofamigliaDaCancellare = sottofamiglia.nome;
            vm.pulsanteCancellaVisibile = true;
            sottofamigliaCliccata = sottofamiglia;  // memorizzo globalmente la sottofamiglia da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.dropdownDisabilitate = false;
            vm.sottofamigliaDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editSottofamiglia = function editSottofamiglia() {

            // Verifico se la sottofamiglia che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.sottofamigliaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.sottofamigliaDoppia = _.find(vm.sottofamiglie, function (sottofamiglia) { return funzioni.confrontaStringhe(sottofamiglia.nome, vm.inputEditSottofamiglia) });
            if (vm.sottofamigliaDoppia) {  // se esiste un doppione, _.find ritorna una sottofamiglia, quindi la if è true
                vm.sottofamigliaGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/sottofamiglie",                                         // il valore si può modificare
                           {
                               "id": sottofamigliaCliccata.id,
                               "famigliaId": vm.famigliaSelezionata.id,        // chiamo la API di modifica
                               "nome": _.trim(vm.inputEditSottofamiglia)
                           })
                    .then(function (response) {                                          
                        vm.sottofamiglie[_.findIndex(vm.sottofamiglie, ["id", sottofamigliaCliccata.id])].nome = _.trim(vm.inputEditSottofamiglia);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.inputEditSottofamiglia = "";                                // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaSottofamiglia = function cancellaSottofamiglia() {

            $http.delete("/api/sottofamiglie/" + sottofamigliaCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.sottofamiglie.splice(_.findIndex(vm.sottofamiglie, ["id", sottofamigliaCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.sottofamiglianonCancellabile = true;
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
                       if ($("#idFamigliaHidden").val() != 0) {
                           vm.famigliaSelezionata = _.find(vm.famiglie, function (famiglia) { return famiglia.id == $("#idFamigliaHidden").val() });
                       }
                       else {
                           vm.famigliaSelezionata = vm.famiglie[0];
                       };
                       vm.selezionaFamiglia();
                   });
           });
    }

})();