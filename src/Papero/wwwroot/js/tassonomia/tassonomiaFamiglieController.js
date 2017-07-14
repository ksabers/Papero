// tassonomiaFamiglieController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("tassonomiaFamiglieController", tassonomiaFamiglieController);

    function tassonomiaFamiglieController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var famigliaCliccata = {};
        var vm = this;

        vm.opzioniTabellaFamiglie = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaFamiglie = [
            DTColumnDefBuilder.newColumnDef(2).notSortable(),  // Impedisce l'ordinamento della tabella sulle colonne della checkbox e dei pulsanti
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];


        vm.famigliaGiaPresente = false; // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.pulsanteEditDisabilitato = true;
        vm.pulsanteCancellaVisibile = true;

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.famigliaGiaPresente = false;                                 // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditFamiglia = "";                                      // ...e cancello il campo
        };


        vm.verificaEditFamiglia = function verificaEditFamiglia() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditFamiglia) == "" || _.trim(vm.inputEditFamiglia) == "-");
            vm.famigliaGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.apriPannelloEdit = function apriPannelloEdit(famiglia) {
            vm.annullaCancella();
            $("#panelEdit").collapse("show");
            vm.inputEditFamiglia = famiglia.nome;
            vm.passeriforme = famiglia.passeriforme;
            vm.pulsanteEditDisabilitato = true;
            famigliaCliccata = famiglia;        // memorizzo globalmente la famiglia da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(famiglia) {
            vm.annullaEdit();
            vm.famiglianonCancellabile = false;
            $("#panelCancella").collapse("show");
            vm.famigliaDaCancellare = famiglia.famiglia;
            vm.pulsanteCancellaVisibile = true;
            famigliaCliccata = famiglia;  // memorizzo globalmente la famiglia da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.famigliaDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editFamiglia = function editfamiglia() {

            // Verifico se la famiglia che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: la sto modificando ma rendendola uguale ad una già esistente? Non posso farlo)
            // Se esiste, la salvo in vm.famigliaDoppia in modo da poterne mostrare l'ID nel pannello di alert
            vm.famigliaDoppia = _.find(vm.famiglie, function (famiglia) { return funzioni.confrontaStringhe(famiglia.nome, vm.inputEditFamiglia) });
            if (vm.famigliaDoppia) {               // se esiste un doppione, _.find ritorna una famiglia, quindi la if è true
                vm.famigliaGiaPresente = true;     // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                        // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/famiglie",                                                // il valore si può modificare
                           { "id": famigliaCliccata.id,
                             "famiglia": _.trim(vm.inputEditFamiglia) })                 // chiamo la API di modifica
                    .then(function (response) {                                          
                        vm.famiglie[_.findIndex(vm.famiglie, ["id", famigliaCliccata.id])].nome = _.trim(vm.inputEditFamiglia);
                        vm.famiglie[_.findIndex(vm.famiglie, ["id", famigliaCliccata.id])].passeriforme = vm.passeriforme;
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        vm.inputEditFamiglia = "";                                       // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }
        };

        vm.cancellaFamiglia = function cancellaFamiglia() {

            $http.delete("/api/famiglie/" + famigliaCliccata.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.famiglie.splice(_.findIndex(vm.famiglie, ["id", famigliaCliccata.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                }, function () {
                    vm.famiglianonCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/famiglie")
            .then(function (response) {
                vm.famiglie = response.data;
            });
    }

})();