//modaleDatiGeneraliController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleDatiGeneraliController", modaleDatiGeneraliController);

    function modaleDatiGeneraliController($http) {

        var vm = this;

        vm.selezionaSesso = function selezionaSesso() {
            $("#hiddenOutputIdSessoSelezionato").val(vm.sessoSelezionato.id);
        };

        vm.selezionaTipo = function selezionaTipo() {
            $("#hiddenOutputIdTipoSelezionato").val(vm.tipoSelezionato.id);
        };

        vm.selezionaAberrazione = function selezionaAberrazione() {
            $("#hiddenOutputIdAberrazioneSelezionata").val(vm.aberrazioneSelezionata.id);
        };

        vm.apriModaleDatiGenerali = function apriModaleDatiGenerali() {
            vm.sessoSelezionato = _.find(vm.sessi, function (sesso) { return sesso.id == $("#hiddenIdSessoSelezionato").val() });
            vm.tipoSelezionato = _.find(vm.tipi, function (tipo) { return tipo.id == $("#hiddenIdTipoSelezionato").val() });
            vm.aberrazioneSelezionata = _.find(vm.aberrazioni, function (aberrazione) { return aberrazione.id == $("#hiddenIdAberrazioneSelezionata").val() });

            vm.selezionaSesso();
            vm.selezionaTipo();
            vm.selezionaAberrazione();
        };

        $http.get("/api/sessi")
            .then(function (response) {
                vm.sessi = response.data;
         });

        $http.get("/api/tipi")
            .then(function (response) {
                vm.tipi = response.data;
            });

        $http.get("/api/aberrazioni")
            .then(function (response) {
                vm.aberrazioni = response.data;
            });
    }

})();