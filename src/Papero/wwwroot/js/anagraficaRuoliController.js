// anagraficaRuoliController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("anagraficaRuoliController", anagraficaRuoliController);

    function anagraficaRuoliController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var ruoloCliccato = {};
        var elencoPolicies = [];

        var vm = this;
        
        vm.insertPolicies = [];
        vm.editPolicies = [];

        vm.ruoli = {};

        vm.opzioniTabellaRuoli = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [1, 'asc'])
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                              // (come da specifiche delle angular datatables)
                                                                              // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.colonneTabellaRuoli = [
            DTColumnDefBuilder.newColumnDef(1).notSortable() // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.opzioniTabellaEditPolicies = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [0, 'asc'])
            .withOption("pageLength", 5)
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
        // (come da specifiche delle angular datatables)
        // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.colonneTabellaEditPolicies = [
            DTColumnDefBuilder.newColumnDef(1).notSortable() // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

        vm.opzioniTabellaInsertPolicies = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("bLengthChange", false)
            .withOption("order", [0, 'asc'])
            .withOption("pageLength", 5)
            .withLanguageSource(stringaLinguaggioDatatables);                 // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
        // (come da specifiche delle angular datatables)
        // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.colonneTabellaInsertPolicies = [
            DTColumnDefBuilder.newColumnDef(1).notSortable() // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];


        vm.pulsanteInserimentoVisibile = true;  // Impostazione iniziale dei pulsanti e dei pannelli di alert
        vm.ruoloGiaPresente = false;
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
            vm.ruoloGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteInsertDisabilitato = true;                           // ...disabilito il pulsante di insert
            vm.inputInsertRuolo = "";                              // ...e cancello il campo
        };

        vm.annullaEdit = function annullaEdit() {                           // Quando viene annullato un edit...
            $("#panelEdit").collapse("hide");                               // ...chiudo il pannello
            vm.pulsanteInserimentoVisibile = true;                          // ..riabilito il pulsante di inserimento nel panel heading
            vm.ruoloGiaPresente = false;                           // ...nascondo il riquadro di alert
            vm.pulsanteEditDisabilitato = true;                             // ...disabilito il pulsante di edit
            vm.inputEditRuolo = "";                                // ...e cancello il campo
            vm.editPolicies = [];
        };

        vm.verificaRuolo = function verificaRuolo() {
            vm.pulsanteInsertDisabilitato = (_.trim(vm.inputInsertRuolo) == "");
            vm.ruoloGiaPresente = false;
        };

        vm.verificaEditRuolo = function verificaEditRuolo() {  // Controllo che il campo edit sia valido (non vuoto, non spazi, non trattino)
            vm.pulsanteEditDisabilitato = (_.trim(vm.inputEditRuolo) == "" || _.trim(vm.inputEditRuolo) == "-");
            vm.ruoloGiaPresente = false;  // Se modifico il campo, faccio sparire l'alert
        };

        vm.verificaEditPolicies = function verificaEditpolicies() {  // Riabilito il pulsante di edit al cambiamento di una checkbox, ma solo se il riquadro di alert è chiuso
            if (vm.ruoloGiaPresente == false) {
                vm.pulsanteEditDisabilitato = false;
            }
        };

        vm.inserisciRuolo = function inserisciRuolo() {

            // Verifico se il ruolo che sto cercando di inserire esiste già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // Se esiste, lo salvo in vm.ruoloDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.ruoloDoppio = _.find(vm.ruoli, function (ruolo) { return funzioni.confrontaStringhe(ruolo.name, vm.inputInsertRuolo) });
            if (vm.ruoloDoppio) {  // se esiste un doppione, _.find ritorna un ruolo, quindi la if è true
                vm.ruoloGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteInsertDisabilitato = true;  // e disabilito la insert
            }
            else {                                                                       // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque
                $http.post("/api/ruoli",                                        // il valore si può inserire
                           {
                               "ruolo": _.trim(vm.inputInsertRuolo),
                               "policies": _.filter(vm.insertPolicies, ["autorizzazione", true])
                           })   // chiamo la API di inserimento
                    .then(function (response) {                // la chiamata alla API mi restituisce il JSON del valore appena inserito (soprattutto mi dice il nuovo ID)
                        location.reload(true);
                        //vm.ruoli.push({ "id": response.data.id, "name": _.trim(vm.inputInsertRuolo) });
                        //$("#panelInserimento").collapse("hide");                         // chiudo il pannello di inserimento
                        //vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        //vm.inputInsertRuolo = "";                               // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'inserimento");
                    })
                .finally(function () {

                })
            }
        };

        vm.apriPannelloEdit = function apriPannelloEdit(ruolo) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia un edit
            vm.annullaCancella();
            vm.pulsanteInserimentoVisibile = false;
            $("#panelEdit").collapse("show");
            vm.inputEditRuolo = ruolo.name;
            vm.pulsanteEditDisabilitato = true;
            ruoloCliccato = ruolo;  // memorizzo globalmente il ruolo da modificare perché servirà quando verrà cliccato il tasto di edit
            vm.editPolicies = [];   // mi assicuro che la tabella sia vuota prima di riempirla
            for (var i = 0; i < elencoPolicies.length; i++) {  // riempio la tabella settando la checkbox sulle policies possedute
                vm.editPolicies.push({                         // dal ruolo corrente
                    "policy": elencoPolicies[i].policy,
                    "autorizzazione": _.find(ruolo.claims, ["claimType", elencoPolicies[i].policy]) == undefined ? false : true
                });
            }
        };

        vm.apriPannelloCancella = function apriPannelloCancella(ruolo) {
            vm.annullaInserimento();                   // Chiude il pannello di inserimento se è aperto quando si inizia una cancellazione
            vm.annullaEdit();
            vm.ruolononCancellabile = false;
            vm.pulsanteInserimentoVisibile = false;
            $("#panelCancella").collapse("show");
            vm.ruoloDaCancellare = ruolo.ruolo;
            vm.pulsanteCancellaVisibile = true;
            ruoloCliccato = ruolo;  // memorizzo globalmente il ruolo da cancellare perché servirà quando verrà cliccato il tasto di cancellazione
        };

        vm.annullaCancella = function annullaCancella() {
            $("#panelCancella").collapse("hide");
            vm.pulsanteInserimentoVisibile = true;
            vm.ruoloDaCancellare = "";
            vm.pulsanteCancellaVisibile = true;
        };

        vm.editRuolo = function editRuolo() {

            // Verifico se il ruolo che sto editando, dopo l'editazione, esisteva già nella tabella (ignorando maiuscole, minuscole, spazi prima, dopo e in mezzo)
            // (ovvero: lo sto modificando ma rendendolo uguale ad uno già esistente? Non posso farlo)
            // Se esiste, lo salvo in vm.ruoloDoppio in modo da poterne mostrare l'ID nel pannello di alert
            vm.ruoloDoppio = _.find(vm.ruoli, function (ruolo) { return funzioni.confrontaStringhe(ruolo.name, vm.inputEditRuolo) });
            if (vm.ruoloDoppio && vm.ruoloDoppio.name != vm.inputEditRuolo) {  // se esiste un doppione, _.find ritorna un ruolo, quindi la if è true
                vm.ruoloGiaPresente = true;   // mostro il pannello di alert
                vm.pulsanteEditDisabilitato = true;  // e disabilito la insert
            }
            else {  // se il valore non è un doppione, la _.find ritorna undefined, quindi la if è false e dunque il valore si può modificare
                $http.put("/api/ruoli",    // chiamo la API di modifica
                           {
                               "id": ruoloCliccato.id,
                               "ruolo": _.trim(vm.inputEditRuolo),
                               "policies": _.filter(vm.editPolicies, ["autorizzazione", true])
                           })     
                    .then(function (response) {
                        location.reload(true);
                        //vm.ruoli[_.findIndex(vm.ruoli, ["id", ruoloCliccato.id])].name = _.trim(vm.inputEditRuolo);
                        //$("#panelEdit").collapse("hide");                                // chiudo il pannello di edit
                        //vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                        //vm.inputEditRuolo = "";                                // e cancello il campo
                    }, function () {
                        alert("Errore non gestito durante l'editazione");
                    })
                .finally(function () {

                })
            }

        };

        vm.cancellaRuolo = function cancellaRuolo() {

            $http.delete("/api/ruoli/" + ruoloCliccato.id)     // chiamo la API di cancellazione
                .then(function (response) {
                    vm.ruoli.splice(_.findIndex(vm.ruoli, ["id", ruoloCliccato.id]), 1);
                    $("#panelCancella").collapse("hide");                            // chiudo il pannello di cancellazione
                    vm.pulsanteInserimentoVisibile = true;                           // riabilito il pulsante nel panel heading
                }, function () {
                    vm.ruolononCancellabile = true;
                    vm.pulsanteCancellaVisibile = false;
                })
            .finally(function () {

            })
        };

        $http.get("/api/ruoli")
            .then(function (response) {
                vm.ruoli = response.data;
                $http.get("/api/policies")
                    .then(function (response) {
                        elencoPolicies = response.data;
                        for (var i = 0; i < elencoPolicies.length; i++) {
                            vm.insertPolicies.push({
                                "policy": elencoPolicies[i].policy,
                                "autorizzazione": false
                            });
                        }
                    });
            });
    }

})();