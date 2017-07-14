// tassonomiaTribuController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("tassonomiaTribuController", tassonomiaTribuController);

    function tassonomiaTribuController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoTribu = {};
        var elencoSottofamiglie = {};
        var tribuCliccata = {};
        var vm = this;

        vm.opzioniTabellaTribu = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaTribu = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.cassettoGiaPresente = false;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
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
        };


        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.tribuGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditTribu = "";                                // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };


        vm.verificaEditTribu = function verificaEditTribu() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditTribu) == "" || _.trim(vm.inputEditTribu) == "-");
            vm.tribuGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };


        vm.apriPannelloEdit = function apriPannelloEdit(tribu) {
            vm.annullaCancella();
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditTribu = tribu.nome;
            vm.pulsanteEditDisabilitato = true;
            tribuCliccata = tribu;  // memorizzo globalmente la tribù da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(cassetto) {
            vm.annullaEdit();
            vm.tribunonCancellabile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.tribuDaCancellare = tribu.nome;
            vm.pulsanteCancellaVisibile = true;
            tribuCliccata = tribu;  // memorizzo globalmente la tribù da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.dropdownDisabilitate = false;
            vm.tribuDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editTribu = function editTribu() {

            // Verifico se la tribù che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.tribuDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.tribuDoppia = _.find(vm.tribu, function (tribu) { return funzioni.confrontaStringhe(tribu.nome, vm.inputEditTribu) });
            if (vm.tribuDoppia) {  // se esiste un doppione, _.find ritorna una tribù, quindi la if è true
                vm.tribuGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                 // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/tribu",                                         // il valore si può modificare
                           {
                               "id": cassettoCliccato.id,
                               "sottofamigliaId": vm.sottofamigliaSelezionata.id,     // chiamo la API di modifica
                               "tribu": _.trim(vm.inputEditTribu)
                           })
                    .then(function (response) {                                          
                        vm.tribu[_.findIndex(vm.tribu, ["id", tribuCliccata.id])].nome = _.trim(vm.inputEditTribu);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.inputEditTribu = "";                                // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaTribu = function cancellaTribu() {

            $http.delete("/api/cassetti/" + tribuCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.tribu.splice(_.findIndex(vm.tribu, ["id", tribuCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.tribunonCancellabile = true;
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
                               if ($("#idSottofamigliaHidden").val() != 0) {
                                   vm.famigliaSelezionata = _.find(vm.famiglie, function (famiglia) {
                                       return famiglia.id == _.find(elencoSottofamiglie, function (sottofamiglia) { return sottofamiglia.id == $("#idSottofamigliaHidden").val() }).famigliaId
                                   });
                                   vm.selezionaFamiglia();
                                   vm.sottofamigliaSelezionata = _.find(vm.sottofamiglie, function (sottofamiglia) { return sottofamiglia.id == $("#idSottofamigliaHidden").val() });
                               }
                               else {
                                   vm.famigliaSelezionata = vm.famiglie[0];
                                   vm.selezionaFamiglia();
                                   vm.sottofamigliaSelezionata = vm.sottofamiglie[0];
                               };
                               vm.selezionaSottofamiglia();
                           });                     
                   });
           });
    }

})();