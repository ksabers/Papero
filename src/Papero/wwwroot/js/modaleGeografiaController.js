//modaleGeografiaController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleGeografiaController", modaleGeografiaController);

    function modaleGeografiaController($http) {

        var elencoRegioni = [];
        var elencoProvince = [];
        var elencoCitta = [];
        var elencoLocalita = [];

        var vm = this;
            vm.regioni = [];

        vm.selezionaCitta = function selezionaCitta() {
            vm.localita = _.filter(elencoLocalita, function (localita) { return localita.cittaId == vm.cittaSelezionata.id });
            vm.localitaSelezionata = _.find(vm.localita, function (localita) { return localita.nomeLocalita == "-" });
        };

        vm.selezionaProvincia = function selezionaProvincia() {
            vm.citta = _.filter(elencoCitta, function (citta) { return citta.provinciaId == vm.provinciaSelezionata.id });
            vm.cittaSelezionata = _.find(vm.citta, function (citta) { return citta.nomeCitta == "-" });
            vm.selezionaCitta();
        };

        vm.selezionaRegione = function selezionaRegione() {
            vm.province = _.filter(elencoProvince, function (provincia) { return provincia.regioneId == vm.regioneSelezionata.id });
            vm.provinciaSelezionata = _.find(vm.province, function (provincia) { return provincia.provincia == "-" });
            vm.selezionaProvincia();
        };

        vm.selezionaNazione = function selezionaNazione() {
            vm.regioni = _.filter(elencoRegioni, function (regione) { return regione.nazioneId == vm.nazioneSelezionata.id });
            vm.regioneSelezionata = _.find(vm.regioni, function(regione) { return regione.regione == "-"});
            vm.selezionaRegione();
        };

        vm.apriModaleGeografia = function apriModaleGeografia() {
            var cittaIniziale = _.find(elencoLocalita, function (localita) { return localita.id == $("#hiddenIdLocalita").val() }).cittaId;
            var provinciaIniziale = _.find(elencoCitta, function (citta) { return citta.id == cittaIniziale }).provinciaId;
            var regioneIniziale = _.find(elencoProvince, function (provincia) { return provincia.id == provinciaIniziale }).regioneId;
            var nazioneIniziale = _.find(elencoRegioni, function (regione) { return regione.id == regioneIniziale }).nazioneId;
            vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) { return nazione.id == nazioneIniziale })
            vm.selezionaNazione();
            vm.regioneSelezionata = _.find(vm.regioni, function (regione) { return regione.id == regioneIniziale })
            vm.selezionaRegione();
            vm.provinciaSelezionata = _.find(vm.province, function (provincia) { return provincia.id == provinciaIniziale });
            vm.selezionaProvincia();
            vm.cittaSelezionata = _.find(vm.citta, function (citta) { return citta.id == cittaIniziale })
            vm.selezionaCitta();
            vm.localitaSelezionata = _.find(vm.localita, function (localita) { return localita.id == $("#hiddenIdLocalita").val() });

            vm.TipoAcquisizioneSelezionato = _.find(vm.tipiAcquisizione, function (tipoAcquisizione) { return tipoAcquisizione.id == $("#hiddenIdTipoAcquisizione").val() });
            vm.CollezioneSelezionata = _.find(vm.collezioni, function (collezione) { return collezione.id == $("#hiddenIdCollezione").val() });
            vm.SpedizioneSelezionata = _.find(vm.spedizioni, function (spedizione) { return spedizione.id == $("#hiddenIdSpedizione").val() });

            vm.AvutoDaSelezionato = _.find(vm.raccoglitori, function (raccoglitore) { return raccoglitore.id == $("#hiddenIdAvutoDa").val() });
            vm.LegitSelezionato = _.find(vm.raccoglitori, function (raccoglitore) { return raccoglitore.id == $("#hiddenIdLegit").val() });
            vm.CedenteSelezionato = _.find(vm.raccoglitori, function (raccoglitore) { return raccoglitore.id == $("#hiddenIdCedente").val() });
        };

        $http.get("/api/nazioni")
            .then(function (response) {
                vm.nazioni = response.data;
            });

        $http.get("/api/regioni")
            .then(function (response) {
                elencoRegioni = response.data;
            });

        $http.get("/api/province")
            .then(function (response) {
                elencoProvince = response.data;
            });

        $http.get("/api/citta")
            .then(function (response) {
                elencoCitta = response.data;
            });

        $http.get("/api/localita")
            .then(function (response) {
                elencoLocalita = response.data;
            });

        $http.get("/api/tipiacquisizione")
            .then(function (response) {
                vm.tipiAcquisizione = response.data;
            });

        $http.get("/api/collezioni")
            .then(function (response) {
                vm.collezioni = response.data;
            });

        $http.get("/api/spedizioni")
            .then(function (response) {
                vm.spedizioni = response.data;
            });

        $http.get("/api/raccoglitori")
            .then(function (response) {
                vm.raccoglitori = response.data;
            });
    }
})();