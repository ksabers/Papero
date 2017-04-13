// anagraficaClassificatoriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaClassificatoriController", anagraficaClassificatoriController);

    function anagraficaClassificatoriController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;

        vm.opzioniTabellaClassificatori = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaClassificatori = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.pulsanteInserimentoVisibile = true;
        vm.classificatoreGiaPresente = false;
        vm.pulsanteInsertDisabilitato = true;

        vm.apriPannelloInserimento = function apriPannelloInserimento() {
            vm.pulsanteInserimentoVisibile = false;
            $("#panelInserimento").collapse("show");
        };

        vm.annullaInserimento = function annullaInserimento() {
            $("#panelInserimento").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.classificatoreGiaPresente = false;
            vm.pulsanteInsertDisabilitato = false;
            vm.inputInsertClassificatore = "";
        };

        vm.verificaClassificatore = function verificaClassificatore() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertClassificatore) == "" || _.trim(vm.inputInsertClassificatore) == "-");
            vm.classificatoreGiaPresente = false;
        };

        vm.inserisciClassificatore = function inserisciClassificatore() {

            vm.classificatoreDoppio = _.find(vm.classificatori, function (classificatore) { return funzioni.confrontaStringhe(classificatore.classificatore, vm.inputInsertClassificatore) });
            if (vm.classificatoreDoppio) {
                vm.classificatoreGiaPresente = true;
                vm.pulsanteInsertDisabilitato = true;
            }
            else {
                $http.post("/api/classificatori", { "classificatore": vm.inputInsertClassificatore })
                    .then(function (response) {
                        vm.classificatori.push(response.data);
                        $("#panelInserimento").collapse("hide");
                        vm.pulsanteInserimentoVisibile = true;
                        vm.inputInsertClassificatore = "";
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(classificatore) {
            vm.annullaInserimento();  // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            $("#inputEditClassificatore").val(classificatore.classificatore);
        };

        vm.annullaEdit = function annullaEdit() {
            $("#panelEdit").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            $("#inputEditClassificatore").val("");
        };

        vm.editClassificatore = function editClassificatore() {

        };

        vm.cancellaClassificatore = function cancellaClassificatore() {

        };

        $http.get("/api/classificatori")
            .then(function (response) {
                vm.classificatori = response.data;
            });


    }

})();