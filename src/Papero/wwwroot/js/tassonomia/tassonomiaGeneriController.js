// tassonomiaGeneriController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("tassonomiaGeneriController", tassonomiaGeneriController);

    function tassonomiaGeneriController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoSottofamiglie = {};
        var elencoTribu = {};
        var elencoGeneri = {};
        var genereCliccato = {};
        var vm = this;

        vm.opzioniTabellaGeneri = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
        vm.colonneTabellaGeneri = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.genereGiaPresente = false;   // Impostazione iniziale dei pulsanti e dei pannelli di alert
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
            vm.tribuSelezionata = _.find(vm.tribu, function (tribu) { return tribu.nome == "-" });
            vm.selezionaTribu();
        };

        vm.selezionaTribu = function selezionaTribu() {
            vm.generi = _.filter(elencoGeneri, function (genere) { return genere.tribuId == vm.tribuSelezionata.id });
        };


        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.genereGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditGenere = "";                                // ...e cancello il campo
            vm.dropdownDisabilitate = false;
        };


        vm.verificaEditGenere = function verificaEditGenere() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditGenere) == "" || _.trim(vm.inputEditGenere) == "-");
            vm.genereGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };


        vm.apriPannelloEdit = function apriPannelloEdit(genere) {
            vm.annullaCancella();
            vm.dropdownDisabilitate = true;
            $("#panelEdit").collapse("show");
            vm.inputEditGenere = genere.nome;
            vm.pulsanteEditDisabilitato = true;
            genereCliccato = genere;  // memorizzo globalmente il genere da modificare perché servirà quando verrà cliccato il tasto di edit
        };

        vm.apriPannelloCancella = function apriPannelloCancella(genere) {
            vm.annullaEdit();
            vm.generenonCancellabile = false;
            vm.dropdownDisabilitate = true;
            $("#panelCancella").collapse("show");
            vm.genereDaCancellare = genere.nome;
            vm.pulsanteCancellaVisibile = true;
            genereCliccato = genere;  // memorizzo globalmente il genere da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.dropdownDisabilitate = false;
            vm.genereDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editGenere = function editGenere() {

            // Verifico se il genere che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.genereDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.genereDoppio = _.find(vm.generi, function (genere) { return funzioni.confrontaStringhe(genere.nome, vm.inputEditGenere) });
            if (vm.genereDoppio) {  // se esiste un doppione, _.find ritorna un genere, quindi la if è true
                vm.genereGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {                                                          // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.put("/api/generi",                                    // il valore si può modificare
                           {
                               "id": genereCliccato.id,
                               "tribuId": vm.tribuSelezionata.id,     // chiamo la API di modifica
                               "nome": _.trim(vm.inputEditGenere)
                           })
                    .then(function (response) {                                          
                        vm.generi[_.findIndex(vm.generi, ["id", genereCliccato.id])].nome = _.trim(vm.inputEditGenere);
                        $("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        vm.inputEditGenere = "";                                // e cancello il campo
                        vm.dropdownDisabilitate = false;
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaGenere = function cancellaGenere() {

            $http.delete("/api/generi/" + genereCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.generi.splice(_.findIndex(vm.generi, ["id", genereCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.dropdownDisabilitate = false;
                }, function () {
                    vm.generenonCancellabile = true;
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
                               $http.get("/api/generi")
                                   .then(function (response) {
                                       elencoGeneri = response.data;
                                       if ($("#idTribuHidden").val() != 0) {
                                           vm.famigliaSelezionata = _.find(vm.famiglie, function (famiglia) {
                                               return famiglia.id == _.find(elencoSottofamiglie, function (sottofamiglia) {
                                                   return sottofamiglia.id == _.find(elencoTribu, function (tribu) {
                                                       return tribu.id == $("#idTribuHidden").val()
                                                   }).sottofamigliaId
                                               }).famigliaId
                                           });
                                           vm.selezionaFamiglia();
                                           vm.sottofamigliaSelezionata = _.find(vm.sottofamiglie, function (sottofamiglia) {
                                               return sottofamiglia.id == _.find(elencoTribu, function (tribu) {
                                                   return tribu.id == $("#idTribuHidden").val()
                                               }).sottofamigliaId
                                           });
                                           vm.selezionaSottofamiglia();
                                           vm.tribuSelezionata = _.find(vm.tribu, function (tribu) {
                                               return tribu.id == $("#idTribuHidden").val()
                                           });
                                       }
                                       else {
                                           vm.famigliaSelezionata = vm.famiglie[0];
                                           vm.selezionaFamiglia();
                                           vm.sottofamigliaSelezionata = vm.sottofamiglie[0];
                                           vm.selezionaSottofamiglia();
                                           vm.tribuSelezionata = vm.tribu[0];
                                       };
                                       vm.selezionaTribu();
                                   });
                           });
                   });
           });
    }

})();