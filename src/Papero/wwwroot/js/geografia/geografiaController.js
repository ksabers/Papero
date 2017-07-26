// geografiaController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("geografiaController", geografiaController);

    function geografiaController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var alberoGeografia = [];                // Array delle entità contenute nell'albero
        var re = new RegExp("([1-9][0-9]*)");
        var numeroEsemplari = 0;

        var vm = this;

//#region Funzioni Albero

        vm.datiAlbero = [];            // Albero geografico

        vm.opzioniAlbero = {          // Opzioni di visualizzazione dell'angular treeview
            multiSelection: false,
            dirSelectable: true,
            nodeChildren: "figli",    // nome dell'elemento ricorsivo che comprende i figli di ciascun elemento dell'albero all'interno del JSON
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };

        vm.nodoSelezionato = function nodoSelezionato(nodo, percorso, selezionato) {  // Funzione che viene richiamata alla selezione di un elemento dell'albero

            if (selezionato) {
                vm.percorso = percorso;
                vm.livello = percorso.length;

                vm.pulsanteEditNazioneDisabilitato = true;
                vm.pulsanteEditRegioneDisabilitato = true;
                vm.pulsanteEditProvinciaDisabilitato = true;
                vm.pulsanteEditCittaDisabilitato = true;
                vm.pulsanteEditLocalitaDisabilitato = true;

                switch (vm.livello) {
                    case 1: // Clic su una Nazione

                        $http.get("/api/elencoesemplaridanazione/" + nodo.idNazione)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoNazione = nodo;
                                vm.percorsoRegione = null;
                                vm.percorsoProvincia = null;
                                vm.percorsoCitta = null;
                                vm.percorsoLocalita = null;

                                vm.testo = vm.percorsoNazione.nome;

                                vm.panelCancellaNazioneVisibile = false;
                                vm.panelInserimentoNazioneVisibile = false;
                                vm.panelEditNazioneVisibile = true;
                                vm.pulsanteInserimentoNazioneVisibile = true;
                                if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneNazioneVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneNazioneVisibile = true;
                                };

                                vm.inputEditNazione = nodo.nome;
                                vm.inputEditiso31661Alpha2 = nodo.iso31661Alpha2;
                                vm.inputEditiso31661Alpha3 = nodo.iso31661Alpha3;
                                vm.inputEditiso31661 = nodo.iso31661;
                            });
                        break;

                    case 2: // Clic su una Regione

                        $http.get("/api/elencoesemplaridaregione/" + nodo.idRegione)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoNazione = percorso[1];
                                vm.percorsoRegione = percorso[0];
                                vm.percorsoProvincia = null;
                                vm.percorsoCitta = null;
                                vm.percorsoLocalita = null;

                                vm.testo = vm.percorsoRegione.nome + " (" +
                                    vm.percorsoNazione.nome + "/" +
                                    vm.percorsoRegione.nome + ")";

                                vm.panelCancellaRegioneVisibile = false;
                                vm.panelInserimentoRegioneVisibile = false;
                                vm.panelEditRegioneVisibile = true;
                                vm.pulsanteInserimentoRegioneVisibile = true;
                                if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneRegioneVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneRegioneVisibile = true;
                                };

                                vm.inputEditRegione = nodo.nome;
                            });
                        break;

                    case 3: // Clic su una Provincia

                        $http.get("/api/elencoesemplaridaprovincia/" + nodo.idProvincia)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoNazione = percorso[2];
                                vm.percorsoRegione = percorso[1];
                                vm.percorsoProvincia = percorso[0];
                                vm.percorsoCitta = null;
                                vm.percorsoLocalita = null;

                                vm.testo = vm.percorsoProvincia.nome + " (" +
                                    vm.percorsoNazione.nome + "/" +
                                    vm.percorsoRegione.nome + "/" +
                                    vm.percorsoProvincia.nome + ")";

                                vm.panelCancellaProvinciaVisibile = false;
                                vm.panelInserimentoProvinciaVisibile = false;
                                vm.panelEditProvinciaVisibile = true;
                                vm.pulsanteInserimentoProvinciaVisibile = true;
                                if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneProvinciaVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneProvinciaVisibile = true;
                                };

                                vm.inputEditProvincia = nodo.nome;
                                vm.inputEditSiglaProvincia = nodo.siglaProvincia;
                            });
                        break;

                    case 4: // Clic su una Città

                        $http.get("/api/elencoesemplaridacitta/" + nodo.idCitta)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoNazione = percorso[3];
                                vm.percorsoRegione = percorso[2];
                                vm.percorsoProvincia = percorso[1];
                                vm.percorsoCitta = percorso[0];

                                vm.testo = vm.percorsoCitta.nome + " (" +
                                    vm.percorsoNazione.nome + "/" +
                                    vm.percorsoRegione.nome + "/" +
                                    vm.percorsoProvincia.nome + "/" +
                                    vm.percorsoCitta.nome + ")";

                                vm.panelCancellaCittaVisibile = false;
                                vm.panelInserimentoCittaVisibile = false;
                                vm.panelEditCittaVisibile = true;
                                vm.pulsanteInserimentoCittaVisibile = true;
                                if (vm.selectedNode.nome == '-' || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneCittaVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneCittaVisibile = true;
                                };

                                vm.inputEditCitta = nodo.nome;
                                vm.inputEditCodiceIstat = nodo.codiceIstat;
                                vm.inputEditCodiceCatastale = nodo.codiceCatastale;
                            });
                        break;

                    case 5: // Clic su una Località

                        $http.get("/api/elencoesemplaridalocalita/" + nodo.idLocalita)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoNazione = percorso[4];
                                vm.percorsoRegione = percorso[3];
                                vm.percorsoProvincia = percorso[2];
                                vm.percorsoCitta = percorso[1];
                                vm.percorsoLocalita = percorso[0];

                                vm.testo = vm.percorsoLocalita.nome + " (" +
                                    vm.percorsoNazione.nome + "/" +
                                    vm.percorsoRegione.nome + "/" +
                                    vm.percorsoProvincia.nome + "/" +
                                    vm.percorsoCitta.nome + ")";

                                vm.panelCancellaLocalitaVisibile = false;
                                vm.panelInserimentoLocalitaVisibile = false;
                                vm.panelEditLocalitaVisibile = true;
                                vm.pulsanteInserimentoLocalitaVisibile = true;
                                if (vm.selectedNode.nome == '-' || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneLocalitaVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneLocalitaVisibile = true;
                                };

                                vm.inputEditLocalita = nodo.nome;
                                vm.inputEditLatitudine = nodo.latitudine;
                                vm.inputEditLongitudine = nodo.longitudine;
                            });
                        break;
                    default:
                }
            }
            else {
                vm.livello = 0;
                vm.percorsoNazione = null;
                vm.percorsoRegione = null;
                vm.percorsoProvincia = null;
                vm.percorsoCitta = null;
                vm.percorsoLocalita = null;
            }
        };

// #endregion

//#region Variabili Nazioni

        vm.panelEditNazioneVisibile = false;
        vm.panelInserimentoNazioneVisibile = false;
        vm.panelCancellaNazioneVisibile = false;
        vm.pulsanteInserimentoNazioneVisibile = true;
        vm.pulsanteEditNazioneDisabilitato = true;
        vm.pulsanteInsertNazioneDisabilitato = true;

// #endregion

// #region Variabili Regioni

        vm.panelEditRegioneVisibile = false;
        vm.panelInserimentoRegioneVisibile = false;
        vm.panelCancellaRegioneVisibile = false;
        vm.pulsanteInserimentoRegioneVisibile = true;
        vm.pulsanteEditRegioneDisabilitato = true;
        vm.pulsanteInsertRegioneDisabilitato = true;

// #endregion

// #region Variabili Province

        vm.panelEditProvinciaVisibile = false;
        vm.panelInserimentoProvinciaVisibile = false;
        vm.panelCancellaProvinciaVisibile = false;
        vm.pulsanteInserimentoProvinciaVisibile = true;
        vm.pulsanteEditProvinciaDisabilitato = true;
        vm.pulsanteInsertProvinciaDisabilitato = true;

        // #endregion

// #region Variabili Città

        vm.panelEditCittaVisibile = false;
        vm.panelInserimentoCittaVisibile = false;
        vm.panelCancellaCittaVisibile = false;
        vm.pulsanteInserimentoCittaVisibile = true;
        vm.pulsanteEditCittaDisabilitato = true;
        vm.pulsanteInsertCittaDisabilitato = true;

// #endregion

// #region Variabili Località

        vm.panelEditLocalitaVisibile = false;
        vm.panelInserimentoLocalitaVisibile = false;
        vm.panelCancellaLocalitaVisibile = false;
        vm.pulsanteInserimentoLocalitaVisibile = true;
        vm.pulsanteEditLocalitaDisabilitato = true;
        vm.pulsanteInsertLocalitaDisabilitato = true;

// #endregion

// #region Funzioni Nazioni

        vm.annullaInserimentoNazione = function annullaInserimentoNazione() {
            vm.panelCancellaNazioneVisibile = false;
            vm.panelInserimentoNazioneVisibile = false;
            vm.panelEditNazioneVisibile = true;
            vm.pulsanteInserimentoNazioneVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneNazioneVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneNazioneVisibile = true;
            };
        };

        vm.annullaCancellaNazione = function annullaCancellaNazione() {
            vm.panelCancellaNazioneVisibile = false;
            vm.panelInserimentoNazioneVisibile = false;
            vm.panelEditNazioneVisibile = true;
            vm.pulsanteInserimentoNazioneVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneNazioneVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneNazioneVisibile = true;
            };
        };

        vm.apriPannelloInserimentoNazione = function apriPannelloInserimentoNazione() {
            vm.panelCancellaNazioneVisibile = false;
            vm.panelEditNazioneVisibile = false;
            vm.panelInserimentoNazioneVisibile = true;
            vm.pulsanteInserimentoNazioneVisibile = false;
            vm.pulsanteCancellazioneNazioneVisibile = false;

            vm.inputInsertNazione = "";
            vm.inputInsertiso31661Alpha2 = "";
            vm.inputInsertiso31661Alpha3 = "";
            vm.inputInsertiso31661 = "";
        };

        vm.apriPannelloCancellaNazione = function apriPannelloCancellaNazione() {
            vm.panelCancellaNazioneVisibile = true;
            vm.panelEditNazioneVisibile = false;
            vm.panelInserimentoNazioneVisibile = false;
            vm.pulsanteInserimentoNazioneVisibile = false;
            vm.pulsanteCancellazioneNazioneVisibile = false;
            vm.nazioneDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditNazione = function verificaEditNazione() {

            var esisteNazioneDoppia = false;
            var esisteIso31661Alpha2Doppia = false;
            var esisteIso31661Alpha3Doppia = false;
            var esisteIso31661Doppia = false;

            // Queste quattro variabili verificano se sono presenti elementi doppi nell'albero
            // Nel caso delle iso però è ammesso che siano vuote quindi vengono messe in AND con "diverso da vuoto"

            var nazioneDoppia = _.find(vm.datiAlbero, function (nazione) { return funzioni.confrontaStringhe(nazione.nome, vm.inputEditNazione) });
            if (nazioneDoppia == undefined) {
                esisteNazioneDoppia = false
            }
            else {
                esisteNazioneDoppia = true;
            };

            var iso31661Alpha2Doppia = _.find(vm.datiAlbero, function (nazione) { return funzioni.confrontaStringhe(nazione.iso31661Alpha2, vm.inputEditiso31661Alpha2) });
            if ((iso31661Alpha2Doppia == undefined)|| (_.trim(vm.inputEditiso31661Alpha2) == "")){
                esisteIso31661Alpha2Doppia = false
            }
            else {
                esisteIso31661Alpha2Doppia = true;
            };

            var iso31661Alpha3Doppia = _.find(vm.datiAlbero, function (nazione) { return funzioni.confrontaStringhe(nazione.iso31661Alpha3, vm.inputEditiso31661Alpha3) });
            if ((iso31661Alpha3Doppia == undefined) || (_.trim(vm.inputEditiso31661Alpha3) == "")) {
                esisteIso31661Alpha3Doppia = false
            }
            else {
                esisteIso31661Alpha3Doppia = true;
            };

            var iso31661Doppia = _.find(vm.datiAlbero, function (nazione) { return funzioni.confrontaStringhe(nazione.iso31661, vm.inputEditiso31661) });
            if ((iso31661Doppia == undefined) || (_.trim(vm.inputEditiso31661) == "")) {
                esisteIso31661Doppia = false
            }
            else {
                esisteIso31661Doppia = true;
            };

            // Questa linea testa tutte le condizioni per abilitare o disabilitare il pulsante
            vm.pulsanteEditNazioneDisabilitato = (_.trim(vm.inputEditNazione) == "" ||
                                                  _.trim(vm.inputEditNazione) == "-" ||  // le condizioni sono: 1) la nazione non deve essere vuota o trattino
                                                  (esisteNazioneDoppia &&                // 2) non deve esserci una nazione uguale ad un'altra
                                                  esisteIso31661Alpha2Doppia &&          // 3) almeno una delle iso deve essere cambiata, ma
                                                  esisteIso31661Alpha3Doppia &&          //    non può essere uguale ad una già esistente (però può essere vuota)
                                                  esisteIso31661Doppia));                // NOTARE CHE E' UNA CONDIZIONE DIVERSA DALL'INSERT

            if (_.trim(vm.inputEditNazione) == "-") {
                vm.inputEditNazione = "";
            }
        };

        vm.verificaInsertNazione = function verificaInsertNazione() {

            var esisteNazioneDoppia = false;
            var esisteIso31661Alpha2Doppia = false;
            var esisteIso31661Alpha3Doppia = false;
            var esisteIso31661Doppia = false;

            // Queste quattro variabili verificano se sono presenti elementi doppi nell'albero
            // Nel caso delle iso però è ammesso che siano vuote quindi vengono messe in AND con "diverso da vuoto"

            var nazioneDoppia = _.find(vm.datiAlbero, function (nazione) { return funzioni.confrontaStringhe(nazione.nome, vm.inputInsertNazione) });
            if (nazioneDoppia == undefined) {
                esisteNazioneDoppia = false
            }
            else {
                esisteNazioneDoppia = true;
            };

            var iso31661Alpha2Doppia = _.find(vm.datiAlbero, function (nazione) { return funzioni.confrontaStringhe(nazione.iso31661Alpha2, vm.inputInsertiso31661Alpha2) });
            if ((iso31661Alpha2Doppia == undefined) || (_.trim(vm.inputInsertiso31661Alpha2) == "")) {
                esisteIso31661Alpha2Doppia = false
            }
            else {
                esisteIso31661Alpha2Doppia = true;
            };

            var iso31661Alpha3Doppia = _.find(vm.datiAlbero, function (nazione) { return funzioni.confrontaStringhe(nazione.iso31661Alpha3, vm.inputInsertiso31661Alpha3) });
            if ((iso31661Alpha3Doppia == undefined) || (_.trim(vm.inputInsertiso31661Alpha3) == "")) {
                esisteIso31661Alpha3Doppia = false
            }
            else {
                esisteIso31661Alpha3Doppia = true;
            };

            var iso31661Doppia = _.find(vm.datiAlbero, function (nazione) { return funzioni.confrontaStringhe(nazione.iso31661, vm.inputInsertiso31661) });
            if ((iso31661Doppia == undefined) || (_.trim(vm.inputInsertiso31661) == "")) {
                esisteIso31661Doppia = false
            }
            else {
                esisteIso31661Doppia = true;
            };

            // Questa linea testa tutte le condizioni per abilitare o disabilitare il pulsante
            vm.pulsanteInsertNazioneDisabilitato = (_.trim(vm.inputInsertNazione) == "" ||
                                                  _.trim(vm.inputInsertNazione) == "-" ||  // le condizioni sono: 1) la nazione non deve essere vuota o trattino
                                                  esisteNazioneDoppia ||                   // 2) la nazione non può essere uguale ad una esistente
                                                  esisteIso31661Alpha2Doppia ||            // 3) nessuna delle iso può essere uguale ad una già esistente
                                                  esisteIso31661Alpha3Doppia ||            //    (però possono essere vuote)
                                                  esisteIso31661Doppia);                   //  NOTARE CHE E' UNA CONDIZIONE DIVERSA DALL'EDIT
        };

        vm.editNazione = function editNazione() {

            $http.put("/api/nazioni",
                {
                    "id": vm.selectedNode.idNazione,
                    "nazione": _.trim(vm.inputEditNazione),
                    "iso31661Alpha2": _.trim(vm.inputEditiso31661Alpha2),
                    "iso31661Alpha3": _.trim(vm.inputEditiso31661Alpha3),
                    "iso31661": _.trim(vm.inputEditiso31661)
                })
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "idNazione": vm.percorsoNazione.idNazione,
                                "nome": _.trim(vm.inputEditNazione),
                                "iso31661Alpha2": _.trim(vm.inputEditiso31661Alpha2),
                                "iso31661Alpha3": _.trim(vm.inputEditiso31661Alpha3),
                                "iso31661": _.trim(vm.inputEditiso31661)
                            };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = null;
                            vm.percorsoProvincia = null;
                            vm.percorsoCitta = null;
                            vm.percorsoLocalita = null;

                            vm.testo = _.trim(vm.inputEditNazione);
                            vm.pulsanteEditNazioneDisabilitato = true;
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.inserisciNazione = function inserisciNazione() {

            $http.post("/api/nazioni",
                {
                    "nazione": _.trim(vm.inputInsertNazione),
                    "iso31661Alpha2": _.trim(vm.inputInsertiso31661Alpha2),
                    "iso31661Alpha3": _.trim(vm.inputInsertiso31661Alpha3),
                    "iso31661": _.trim(vm.inputInsertiso31661)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idNazione": nodoInserito.id, "nome": _.trim(vm.inputInsertNazione) };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = null;
                            vm.percorsoProvincia = null;
                            vm.percorsoCitta = null;
                            vm.percorsoLocalita = null;

                            vm.testo = _.trim(vm.inputInsertNazione);

                            vm.panelCancellaNazioneVisibile = false;
                            vm.panelInserimentoNazioneVisibile = false;
                            vm.panelEditNazioneVisibile = true;
                            vm.pulsanteInserimentoNazioneVisibile = true;
                            vm.pulsanteCancellazioneNazioneVisibile = true;

                            vm.inputEditNazione = _.trim(vm.inputInsertNazione);
                        });
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaNazione = function cancellaNazione() {

            $http.delete("/api/nazioni/" + vm.selectedNode.idNazione)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridanazione/" + vm.selectedNode.idNazione)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;
                                    vm.selectedNode = vm.datiAlbero[0];

                                    vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                                    vm.percorsoRegione = null;
                                    vm.percorsoProvincia = null;
                                    vm.percorsoCitta = null;
                                    vm.percorsoLocalita = null;

                                    vm.testo = vm.selectedNode.nome;

                                    vm.panelCancellaNazioneVisibile = false;
                                    vm.panelInserimentoNazioneVisibile = false;
                                    vm.panelEditNazioneVisibile = true;
                                    vm.pulsanteInserimentoNazioneVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneNazioneVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneNazioneVisibile = true;
                                    };

                                    vm.inputEditNazione = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

// #region Funzioni Regioni

        vm.annullaInserimentoRegione = function annullaInserimentoRegione() {
            vm.panelCancellaRegioneVisibile = false;
            vm.panelInserimentoRegioneVisibile = false;
            vm.panelEditRegioneVisibile = true;
            vm.pulsanteInserimentoRegioneVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneRegioneVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneRegioneVisibile = true;
            };
        };

        vm.annullaCancellaRegione = function annullaCancellaRegione() {
            vm.panelCancellaRegioneVisibile = false;
            vm.panelInserimentoRegioneVisibile = false;
            vm.panelEditRegioneVisibile = true;
            vm.pulsanteInserimentoRegioneVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneRegioneVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneRegioneVisibile = true;
            };
        };

        vm.apriPannelloInserimentoRegione = function apriPannelloInserimentoRegione() {
            vm.panelCancellaRegioneVisibile = false;
            vm.panelEditRegioneVisibile = false;
            vm.panelInserimentoRegioneVisibile = true;
            vm.pulsanteInserimentoRegioneVisibile = false;
            vm.pulsanteCancellazioneRegioneVisibile = false;
            vm.inputInsertRegione = "";
        };

        vm.apriPannelloCancellaRegione = function apriPannelloCancellaRegione() {
            vm.panelCancellaRegioneVisibile = true;
            vm.panelEditRegioneVisibile = false;
            vm.panelInserimentoRegioneVisibile = false;
            vm.pulsanteInserimentoRegioneVisibile = false;
            vm.pulsanteCancellazioneRegioneVisibile = false;
            vm.regioneDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditRegione = function verificaEditRegione() {
            var regioneDoppia = _.find(vm.percorsoNazione.figli, function (regione) { return funzioni.confrontaStringhe(regione.nome, vm.inputEditRegione) });
            vm.pulsanteEditRegioneDisabilitato = (_.trim(vm.inputEditRegione) == "" || _.trim(vm.inputEditRegione) == "-" || regioneDoppia);
            if (_.trim(vm.inputEditRegione) == "-") {
                vm.inputEditRegione = "";
            }
        };

        vm.verificaInsertRegione = function verificaInsertRegione() {
            var regioneDoppia = _.find(vm.percorsoNazione.figli, function (regione) { return funzioni.confrontaStringhe(regione.nome, vm.inputInsertRegione) });
            vm.pulsanteInsertRegioneDisabilitato = (_.trim(vm.inputInsertRegione) == "" || _.trim(vm.inputInsertRegione) == "-" || regioneDoppia);
            if (_.trim(vm.inputInsertRegione) == "-") {
                vm.inputInsertRegione = "";
            }
        };

        vm.editRegione = function editRegione() {

            $http.put("/api/regioni",
                {
                    "id": vm.percorsoRegione.idRegione,
                    "nazioneId": vm.percorsoNazione.idNazione,
                    "regione": _.trim(vm.inputEditRegione)
                })
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "idRegione": vm.percorsoRegione.idRegione,
                                "nazioneId": vm.percorsoNazione.idNazione,
                                "nome": _.trim(vm.inputEditRegione)
                            };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                            vm.percorsoProvincia = null;
                            vm.percorsoCitta = null;
                            vm.percorsoLocalita = null;

                            vm.testo = _.trim(vm.inputEditRegione) +
                                " (" + vm.percorsoNazione.nome + "/" +
                                _.trim(vm.inputEditRegione) + ")";
                            vm.pulsanteEditRegioneDisabilitato = true;
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.inserisciRegione = function inserisciRegione() {

            $http.post("/api/regioni",
                {
                    "nazioneId": vm.percorsoNazione.idNazione,
                    "regione": _.trim(vm.inputInsertRegione)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idRegione": nodoInserito.id, "nome": _.trim(vm.inputInsertRegione) };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                            vm.percorsoProvincia = null;
                            vm.percorsoCitta = null;
                            vm.percorsoLocalita = null;

                            vm.testo = _.trim(vm.inputInsertRegione) + " (" +
                                vm.percorsoNazione.nome + "/" +
                                _.trim(vm.inputInsertRegione) + ")";

                            vm.panelCancellaRegioneVisibile = false;
                            vm.panelInserimentoRegioneVisibile = false;
                            vm.panelEditRegioneVisibile = true;
                            vm.pulsanteInserimentoRegioneVisibile = true;
                            vm.pulsanteCancellazioneRegioneVisibile = true;

                            vm.inputEditRegione = _.trim(vm.inputInsertRegione);
                        });
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaRegione = function cancellaRegione() {

            $http.delete("/api/regioni/" + vm.selectedNode.idRegione)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridaregione/" + vm.selectedNode.idRegione)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;

                                    vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                                    vm.selectedNode = vm.percorsoNazione;
                                    vm.testo = vm.selectedNode.nome;

                                    vm.livello = 1;

                                    vm.panelCancellaNazioneVisibile = false;
                                    vm.panelInserimentoNazioneVisibile = false;
                                    vm.panelEditNazioneVisibile = true;
                                    vm.pulsanteInserimentoNazioneVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneNazioneVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneNazioneVisibile = true;
                                    };

                                    vm.inputEditNazione = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

// #region Funzioni Province

        vm.annullaInserimentoProvincia = function annullaInserimentoProvincia() {
            vm.panelCancellaProvinciaVisibile = false;
            vm.panelInserimentoProvinciaVisibile = false;
            vm.panelEditProvinciaVisibile = true;
            vm.pulsanteInserimentoProvinciaVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneProvinciaVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneProvinciaVisibile = true;
            };
        };

        vm.annullaCancellaProvincia = function annullaCancellaProvincia() {
            vm.panelCancellaProvinciaVisibile = false;
            vm.panelInserimentoProvinciaVisibile = false;
            vm.panelEditProvinciaVisibile = true;
            vm.pulsanteInserimentoProvinciaVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneProvinciaVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneProvinciaVisibile = true;
            };
        };

        vm.apriPannelloInserimentoProvincia = function apriPannelloInserimentoProvincia() {
            vm.panelCancellaProvinciaVisibile = false;
            vm.panelEditProvinciaVisibile = false;
            vm.panelInserimentoProvinciaVisibile = true;
            vm.pulsanteInserimentoProvinciaVisibile = false;
            vm.pulsanteCancellazioneProvinciaVisibile = false;

            vm.inputInsertProvincia = "";
            vm.inputInsertSiglaProvincia = "";
        };

        vm.apriPannelloCancellaProvincia = function apriPannelloCancellaProvincia() {
            vm.panelCancellaProvinciaVisibile = true;
            vm.panelEditProvinciaVisibile = false;
            vm.panelInserimentoProvinciaVisibile = false;
            vm.pulsanteInserimentoProvinciaVisibile = false;
            vm.pulsanteCancellazioneProvinciaVisibile = false;
            vm.provinciaDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditProvincia = function verificaEditProvincia() {

            var esisteProvinciaDoppia = false;
            var esisteSiglaProvinciaDoppia = false;

            // Queste due variabili verificano se sono presenti elementi doppi nell'albero
            // Nel caso della sigla provincia però è ammesso che sia vuota quindi viene messa in AND con "diverso da vuoto"
            var provinciaDoppia = _.find(vm.percorsoRegione.figli, function (provincia) { return funzioni.confrontaStringhe(provincia.nome, vm.inputEditProvincia) });
            if (provinciaDoppia == undefined) {
                esisteProvinciaDoppia = false
            }
            else {
                    esisteProvinciaDoppia = true;
            };

            var siglaProvinciaDoppia = _.find(vm.percorsoRegione.figli, function (provincia) { return funzioni.confrontaStringhe(provincia.siglaProvincia, vm.inputEditSiglaProvincia) });
            if (siglaProvinciaDoppia == undefined) {
                esisteSiglaProvinciaDoppia = false
            }
            else {
                if ((siglaProvinciaDoppia.siglaProvincia == vm.percorsoProvincia.siglaProvincia) || _.trim(vm.inputEditSiglaProvincia) == "") {
                    esisteSiglaProvinciaDoppia = false
                }
                else {
                    esisteSiglaProvinciaDoppia = true;
                }
            };


            vm.pulsanteEditProvinciaDisabilitato = (_.trim(vm.inputEditProvincia) == "" ||
                                                    _.trim(vm.inputEditProvincia) == "-" ||
                                                    (esisteProvinciaDoppia &&
                                                    esisteSiglaProvinciaDoppia));
            if (_.trim(vm.inputEditProvincia) == "-") {
                vm.inputEditProvincia = "";
            }
        };

        vm.verificaInsertProvincia = function verificaInsertProvincia() {

            var esisteProvinciaDoppia = false;
            var esisteSiglaProvinciaDoppia = false;

            // Queste due variabili verificano se sono presenti elementi doppi nell'albero
            // Nel caso della sigla provincia però è ammesso che sia vuota quindi viene messa in AND con "diverso da vuoto"
            var provinciaDoppia = _.find(vm.percorsoRegione.figli, function (provincia) { return funzioni.confrontaStringhe(provincia.nome, vm.inputInsertProvincia) });
            if (provinciaDoppia == undefined) {
                esisteProvinciaDoppia = false
            }
            else {
                esisteProvinciaDoppia = true;
            };

            var siglaProvinciaDoppia = _.find(vm.percorsoRegione.figli, function (provincia) { return funzioni.confrontaStringhe(provincia.siglaProvincia, vm.inputInsertSiglaProvincia) });
            if ((siglaProvinciaDoppia == undefined) || (_.trim(vm.inputInsertSiglaProvincia) == "")) {
                esisteSiglaProvinciaDoppia = false
            }
            else {
                esisteSiglaProvinciaDoppia = true;
            };


            vm.pulsanteInsertProvinciaDisabilitato = (_.trim(vm.inputInsertProvincia) == "" ||
                                                    _.trim(vm.inputInsertProvincia) == "-" ||
                                                    esisteProvinciaDoppia ||
                                                    esisteSiglaProvinciaDoppia);
            if (_.trim(vm.inputInsertProvincia) == "-") {
                vm.inputInsertProvincia = "";
            }
        };

        vm.editProvincia = function editProvincia() {

            $http.put("/api/province",
                {
                    "id": vm.percorsoProvincia.idProvincia,
                    "regioneId": vm.percorsoRegione.idRegione,
                    "provincia": _.trim(vm.inputEditProvincia),
                    "siglaProvincia": _.trim(vm.inputEditSiglaProvincia)
                })
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "idProvincia": vm.percorsoProvincia.idProvincia,
                                "nome": _.trim(vm.inputEditProvincia),
                                "regioneId": vm.percorsoRegione.idRegione,
                                "provincia": _.trim(vm.inputEditProvincia),
                                "siglaProvincia": _.trim(vm.inputEditSiglaProvincia)
                            };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                            vm.percorsoProvincia = _.find(vm.percorsoRegione.figli, ["idProvincia", vm.percorsoProvincia.idProvincia]);
                            vm.percorsoCitta = null;
                            vm.percorsoLocalita = null;

                            vm.testo = _.trim(vm.inputEditProvincia) +
                                " (" + vm.percorsoNazione.nome + "/" +
                                vm.percorsoRegione.nome + "/" +
                                _.trim(vm.inputEditProvincia) + ")";
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.inserisciProvincia = function inserisciProvincia() {

            $http.post("/api/province",
                {
                    "regioneId": vm.percorsoRegione.idRegione,
                    "provincia": _.trim(vm.inputInsertProvincia),
                    "siglaProvincia": _.trim(vm.inputInsertSiglaProvincia)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idProvincia": nodoInserito.id, "nome": _.trim(vm.inputInsertProvincia) };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                            vm.percorsoProvincia = _.find(vm.percorsoRegione.figli, ["idProvincia", vm.percorsoProvincia.idProvincia]);
                            vm.percorsoCitta = null;
                            vm.percorsoLocalita = null;

                            vm.testo = _.trim(vm.inputInsertProvincia) + " (" +
                                vm.percorsoNazione.nome + "/" +
                                vm.percorsoRegione.nome + "/" +
                               _.trim(vm.inputInsertProvincia) + ")";

                            vm.panelCancellaProvinciaVisibile = false;
                            vm.panelInserimentoProvinciaVisibile = false;
                            vm.panelEditProvinciaVisibile = true;
                            vm.pulsanteInserimentoProvinciaVisibile = true;
                            vm.pulsanteCancellazioneProvinciaVisibile = true;

                            vm.inputEditProvincia = _.trim(vm.inputInsertProvincia);
                        });
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaProvincia = function cancellaProvincia() {

            $http.delete("/api/province/" + vm.selectedNode.idProvincia)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridaprovincia/" + vm.selectedNode.idProvincia)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;

                                    vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                                    vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                                    vm.selectedNode = vm.percorsoRegione;
                                    vm.testo = vm.selectedNode.nome;

                                    vm.livello = 2;

                                    vm.panelCancellaRegioneVisibile = false;
                                    vm.panelInserimentoRegioneVisibile = false;
                                    vm.panelEditRegioneVisibile = true;
                                    vm.pulsanteInserimentoRegioneVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneRegioneVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneRegioneVisibile = true;
                                    };

                                    vm.inputEditRegione = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

// #region Funzioni Città

        vm.annullaInserimentoCitta = function annullaInserimentoCitta() {
            vm.panelCancellaCittaVisibile = false;
            vm.panelInserimentoCittaVisibile = false;
            vm.panelEditCittaVisibile = true;
            vm.pulsanteInserimentoCittaVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneCittaVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneCittaVisibile = true;
            };
        };

        vm.annullaCancellaCitta = function annullaCancellaCitta() {
            vm.panelCancellaCittaVisibile = false;
            vm.panelInserimentoCittaVisibile = false;
            vm.panelEditCittaVisibile = true;
            vm.pulsanteInserimentoCittaVisibile = true;
            if (vm.selectedNode.nome == '-') {
                vm.pulsanteCancellazioneCittaVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneCittaVisibile = true;
            };
        };

        vm.apriPannelloInserimentoCitta = function apriPannelloInserimentoCitta() {
            vm.panelCancellaCittaVisibile = false;
            vm.panelEditCittaVisibile = false;
            vm.panelInserimentoCittaVisibile = true;
            vm.pulsanteInserimentoCittaVisibile = false;
            vm.pulsanteCancellazioneCittaVisibile = false;

            vm.inputInsertCitta = "";
            vm.inputInsertCodiceIstat = "";
            vm.inputInsertCodiceCatastale = "";
        };

        vm.apriPannelloCancellaCitta = function apriPannelloCancellaCitta() {
            vm.panelCancellaCittaVisibile = true;
            vm.panelEditCittaVisibile = false;
            vm.panelInserimentoCittaVisibile = false;
            vm.pulsanteInserimentoCittaVisibile = false;
            vm.pulsanteCancellazioneCittaVisibile = false;
            vm.cittaDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditCitta = function verificaEditCitta() {

            // Queste tre variabili verificano se sono presenti elementi doppi nell'albero
            // Nel caso dei codici Istat e catastali però è ammesso che siano vuoti quindi vengono messi in AND con "diverso da vuoto"
            var cittaDoppia = _.find(vm.percorsoProvincia.figli, function (citta) { return funzioni.confrontaStringhe(citta.nome, vm.inputEditCitta) });

            var codiceCatastaleDoppio = false;

            if ((_.trim(vm.inputEditCodiceCatastale) == "") || (_.trim(vm.inputEditCodiceCatastale) != vm.percorsoCitta.codiceCatastale)) {
                codiceCatastaleDoppio = false;
            }
            else {
                codiceCatastaleDoppio = true;
            };

            var codiceIstatdoppio = false;

            if ((_.trim(vm.inputEditCodiceIstat) == "") || (_.trim(vm.inputEditCodiceIstat) != vm.percorsoCitta.codiceIstat)) {
                codiceIstatdoppio = false;
            }
            else {
                codiceIstatdoppio = true;
            };

            // Questa linea testa tutte le condizioni per abilitare o disabilitare il pulsante
            vm.pulsanteEditCittaDisabilitato = (_.trim(vm.inputEditCitta) == "" ||
                                                _.trim(vm.inputEditCitta) == "-" ||
                                                (cittaDoppia &&
                                                codiceCatastaleDoppio &&
                                                codiceIstatdoppio));

            if (_.trim(vm.inputEditCitta) == "-") {
                vm.inputEditCitta = "";
            }
        };

        vm.verificaInsertCitta = function verificaInsertCitta() {

            // Queste tre variabili verificano se sono presenti elementi doppi nell'albero
            // Nel caso dei codici Istat e catastali però è ammesso che siano vuoti quindi vengono messi in AND con "diverso da vuoto"
            var cittaDoppia = _.find(vm.percorsoProvincia.figli, function (citta) { return funzioni.confrontaStringhe(citta.nome, vm.inputInsertCitta) });

            var codiceCatastaleDoppio = false;

            if ((_.trim(vm.inputInsertCodiceCatastale) == "") || (_.trim(vm.inputInsertCodiceCatastale) != vm.percorsoCitta.codiceCatastale)) {
                codiceCatastaleDoppio = false;
            }
            else {
                codiceCatastaleDoppio = true;
            };

            var codiceIstatdoppio = false;

            if ((_.trim(vm.inputInsertCodiceIstat) == "") || (_.trim(vm.inputInsertCodiceIstat) != vm.percorsoCitta.codiceIstat)) {
                codiceIstatdoppio = false;
            }
            else {
                codiceIstatdoppio = true;
            };

            // Questa linea testa tutte le condizioni per abilitare o disabilitare il pulsante
            vm.pulsanteInsertCittaDisabilitato = (_.trim(vm.inputInsertCitta) == "" ||
                                                  _.trim(vm.inputInsertCitta) == "-" ||
                                                  cittaDoppia ||
                                                  codiceCatastaleDoppio ||
                                                  codiceIstatdoppio);

            if (_.trim(vm.inputInsertCitta) == "-") {
                vm.inputInsertCitta = "";
            }
        };

        vm.editCitta = function editCitta() {

            $http.put("/api/citta",
                {
                    "id": vm.percorsoVassoio.idVassoio,
                    "provinciaId": vm.percorsoProvincia.idProvincia,
                    "nomeCitta": _.trim(vm.inputEditCitta),                     // chiamo la API di modifica
                    "codiceIstat": _.trim(vm.inputEditCodiceIstat),
                    "codiceCatastale": _.trim(vm.inputEditCodiceCatastale)
                })
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idCitta": vm.percorsoCitta.idCitta, "nome": _.trim(vm.inputEditCitta) };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                            vm.percorsoProvincia = _.find(vm.percorsoRegione.figli, ["idProvincia", vm.percorsoProvincia.idProvincia]);
                            vm.percorsoCitta = _.find(vm.percorsoProvincia.figli, ["idCitta", vm.percorsoCitta.idCitta]);
                            vm.percorsoLocalita = null;

                            vm.testo = _.trim(vm.inputEditCitta) + " (" +
                               vm.percorsoNazione.nome + "/" +
                               vm.percorsoRegione.nome + "/" +
                               vm.percorsoProvincia.nome + "/" +
                               _.trim(vm.inputEditCitta) + ")";
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.inserisciCitta = function inserisciCitta() {

            $http.post("/api/citta",
                {
                    "provinciaId": vm.percorsoProvincia.idProvincia,
                    "nomeCitta": _.trim(vm.inputInsertCitta),                    // chiamo la API di inserimento
                    "codiceIstat": _.trim(vm.inputInsertCodiceIstat),
                    "codiceCatastale": _.trim(vm.inputInsertCodiceCatastale)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idCitta": nodoInserito.id, "nome": _.trim(vm.inputInsertCitta) };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                            vm.percorsoProvincia = _.find(vm.percorsoRegione.figli, ["idProvincia", vm.percorsoProvincia.idProvincia]);
                            vm.percorsoCitta = _.find(vm.percorsoProvincia.figli, ["idCitta", vm.percorsoCitta.idCitta]);
                            vm.percorsoLocalita = null;

                            vm.testo = _.trim(vm.inputInsertCitta) + " (" +
                                vm.percorsoNazione.nome + "/" +
                                vm.percorsoRegione.nome + "/" +
                                vm.percorsoProvincia.nome + "/" +
                               _.trim(vm.inputInsertCitta) + ")";

                            vm.panelCancellaCittaVisibile = false;
                            vm.panelInserimentoCittaVisibile = false;
                            vm.panelEditCittaVisibile = true;
                            vm.pulsanteInserimentoCittaVisibile = true;
                            vm.pulsanteCancellazioneCittaVisibile = true;

                            vm.inputEditCitta = _.trim(vm.inputInsertCitta);
                        });
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaCitta = function cancellaCitta() {

            $http.delete("/api/citta/" + vm.selectedNode.idCitta)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridacitta/" + vm.selectedNode.idCitta)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;

                                    vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                                    vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                                    vm.percorsoProvincia = _.find(vm.percorsoRegione.figli, ["idProvincia", vm.percorsoProvincia.idProvincia]);

                                    vm.selectedNode = vm.percorsoProvincia;
                                    vm.testo = vm.selectedNode.nome;

                                    vm.livello = 3;

                                    vm.panelCancellaProvinciaVisibile = false;
                                    vm.panelInserimentoProvinciaVisibile = false;
                                    vm.panelEditProvinciaVisibile = true;
                                    vm.pulsanteInserimentoProvinciaVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneProvinciaVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneProvinciaVisibile = true;
                                    };

                                    vm.inputEditProvincia = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

// #region Funzioni Località

        vm.annullaInserimentoLocalita = function annullaInserimentoLocalita() {
            vm.panelCancellaLocalitaVisibile = false;
            vm.panelInserimentoLocalitaVisibile = false;
            vm.panelEditLocalitaVisibile = true;
            vm.pulsanteInserimentoLocalitaVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneLocalitaVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneLocalitaVisibile = true;
            };
        };

        vm.annullaCancellaLocalita = function annullaCancellaLocalita() {
            vm.panelCancellaLocalitaVisibile = false;
            vm.panelInserimentoLocalitaVisibile = false;
            vm.panelEditLocalitaVisibile = true;
            vm.pulsanteInserimentoLocalitaVisibile = true;
            if (vm.selectedNode.nome == '-') {
                vm.pulsanteCancellazioneLocalitaVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneLocalitaVisibile = true;
            };
        };

        vm.apriPannelloInserimentoLocalita = function apriPannelloInserimentoLocalita() {
            vm.panelCancellaLocalitaVisibile = false;
            vm.panelEditLocalitaVisibile = false;
            vm.panelInserimentoLocalitaVisibile = true;
            vm.pulsanteInserimentoLocalitaVisibile = false;
            vm.pulsanteCancellazioneLocalitaVisibile = false;

            vm.inputInsertLocalita = "";
            vm.inputInsertLatitudine = "";
            vm.inputInsertLongitudine = "";
        };

        vm.apriPannelloCancellaLocalita = function apriPannelloCancellLocalita() {
            vm.panelCancellaLocalitaVisibile = true;
            vm.panelEditLocalitaVisibile = false;
            vm.panelInserimentoLocalitaVisibile = false;
            vm.pulsanteInserimentoLocalitaVisibile = false;
            vm.pulsanteCancellazioneLocalitaVisibile = false;
            vm.localitaDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditLocalita = function verificaEditLocalita() {
            var localitaDoppia = _.find(vm.percorsoCitta.figli, function (localita) { return funzioni.confrontaStringhe(localita.nome, vm.inputEditLocalita) });

            var latitudineDoppia = false;

            if ((_.trim(vm.inputEditLatitudine) == "") || (_.trim(vm.inputEditLatitudine) != vm.percorsoLocalita.latitudine)) {
                latitudineDoppia = false;
            }
            else {
                latitudineDoppia = true;
            };

            var longitudineDoppia = false;

            if ((_.trim(vm.inputEditLongitudine) == "") || (_.trim(vm.inputEditLongitudine) != vm.percorsoLocalita.longitudine)) {
                longitudineDoppia = false;
            }
            else {
                longitudineDoppia = true;
            };

            vm.pulsanteEditLocalitaDisabilitato = (_.trim(vm.inputEditLocalita) == "" || _.trim(vm.inputEditLocalita) == "-" || (localitaDoppia && latitudineDoppia && longitudineDoppia));
            if (_.trim(vm.inputEditLocalita) == "-") {
                vm.inputEditLocalita = "";
            }
        };

        vm.verificaInsertLocalita = function verificaInsertLocalita() {
            var localitaDoppia = _.find(vm.percorsoCitta.figli, function (localita) { return funzioni.confrontaStringhe(localita.nome, vm.inputInsertLocalita) });

            var latitudineDoppia = false;

            if ((_.trim(vm.inputEditLatitudine) == "") || (_.trim(vm.inputEditLatitudine) != vm.percorsoLocalita.latitudine)) {
                latitudineDoppia = false;
            }
            else {
                latitudineDoppia = true;
            };

            var longitudineDoppia = false;

            if ((_.trim(vm.inputEditLongitudine) == "") || (_.trim(vm.inputEditLongitudine) != vm.percorsoLocalita.longitudine)) {
                longitudineDoppia = false;
            }
            else {
                longitudineDoppia = true;
            };

            vm.pulsanteInsertLocalitaDisabilitato = (_.trim(vm.inputInsertLocalita) == "" ||
                                                     _.trim(vm.inputInsertLocalita) == "-" ||
                                                     localitaDoppia ||
                                                     latitudineDoppia ||
                                                     longitudineDoppia);

            if (_.trim(vm.inputInsertLocalita) == "-") {
                vm.inputInsertLocalita = "";
            }
        };

        vm.editLocalita = function editLocalita() {

            $http.put("/api/localita",
                {
                    "id": vm.percorsoLocalita.idLocalita,
                    "cittaId": vm.percorsoCitta.idCitta,
                    "nomeLocalita": _.trim(vm.inputEditLocalita),                     // chiamo la API di modifica
                    "latitudine": _.trim(vm.inputEditLatitudine),
                    "longitudine": _.trim(vm.inputEditLongitudine)
                })
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idLocalita": vm.percorsoCitta.idCitta, "nome": _.trim(vm.inputEditLocalita) };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                            vm.percorsoProvincia = _.find(vm.percorsoRegione.figli, ["idProvincia", vm.percorsoProvincia.idProvincia]);
                            vm.percorsoCitta = _.find(vm.percorsoProvincia.figli, ["idCitta", vm.percorsoCitta.idCitta]);
                            vm.percorsoLocalita = _.find(vm.percorsoCitta.figli, ["idLocalita", vm.percorsoLocalita.idLocalita]);

                            vm.testo = _.trim(vm.inputEditLocalita) + " (" +
                               vm.percorsoNazione.nome + "/" +
                               vm.percorsoRegione.nome + "/" +
                               vm.percorsoProvincia.nome + "/" +
                               vm.percorsoCitta.nome + "/" +
                               _.trim(vm.inputEditLocalita) + ")";
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.inserisciLocalita = function inserisciLocalita() {

            $http.post("/api/localita",
                {
                    "cittaId": vm.percorsoCitta.idCitta,
                    "nomeLocalita": _.trim(vm.inputInsertLocalita),
                    "latitudine": _.trim(vm.inputInsertLatitudine),
                    "longitudine": _.trim(vm.inputInsertLongitudine)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idLocalita": nodoInserito.id, "nome": _.trim(vm.inputInsertLocalita) };

                            vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                            vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                            vm.percorsoProvincia = _.find(vm.percorsoRegione.figli, ["idProvincia", vm.percorsoProvincia.idProvincia]);
                            vm.percorsoCitta = _.find(vm.percorsoProvincia.figli, ["idCitta", vm.percorsoCitta.idCitta]);
                            vm.percorsoLocalita = _.find(vm.percorsoCitta.figli, ["idLocalita", vm.percorsoLocalita.idLocalita]);

                            vm.testo = _.trim(vm.inputInsertLocalita) + " (" +
                                vm.percorsoNazione.nome + "/" +
                                vm.percorsoRegione.nome + "/" +
                                vm.percorsoProvincia.nome + "/" +
                                vm.percorsoCitta.nome + "/" +
                               _.trim(vm.inputInsertLocalita) + ")";

                            vm.panelCancellaLocalitaVisibile = false;
                            vm.panelInserimentoLocalitaVisibile = false;
                            vm.panelEditLocalitaVisibile = true;
                            vm.pulsanteInserimentoLocalitaVisibile = true;
                            vm.pulsanteCancellazioneLocalitaVisibile = true;

                            vm.inputEditLocalita = _.trim(vm.inputInsertLocalita);
                        });
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaLocalita = function cancellaLocalita() {

            $http.delete("/api/localita/" + vm.selectedNode.idLocalita)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/geografia")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridalocalita/" + vm.selectedNode.idLocalita)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;

                                    vm.percorsoNazione = _.find(vm.datiAlbero, ["idNazione", vm.percorsoNazione.idNazione]);
                                    vm.percorsoRegione = _.find(vm.percorsoNazione.figli, ["idRegione", vm.percorsoRegione.idRegione]);
                                    vm.percorsoProvincia = _.find(vm.percorsoRegione.figli, ["idProvincia", vm.percorsoProvincia.idProvincia]);
                                    vm.percorsoCitta = _.find(vm.percorsoProvincia.figli, ["idCitta", vm.percorsoCitta.idCitta]);

                                    vm.selectedNode = vm.percorsoCitta;
                                    vm.testo = vm.selectedNode.nome;

                                    vm.livello = 4;

                                    vm.panelCancellaCittaVisibile = false;
                                    vm.panelInserimentoCittaVisibile = false;
                                    vm.panelEditCittaVisibile = true;
                                    vm.pulsanteInserimentoCittaVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneCittaVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneCittaVisibile = true;
                                    };

                                    vm.inputEditCitta = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

        $http.get("/api/geografia")
            .then(function (response) {
                vm.datiAlbero = response.data;
            });
    }
})();