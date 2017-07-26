// collocazioneController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("collocazioneController", collocazioneController);

    function collocazioneController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var alberoCollocazione = [];                // Array delle entità contenute nell'albero
        var re = new RegExp("([1-9][0-9]*)");
        var numeroEsemplari = 0;

        var vm = this;

// #region Funzioni Albero

        vm.datiAlbero = [];            // Albero tassonomico

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
            //vm.nodoCliccato = nodo;
            

            if (selezionato) {
                vm.percorso = percorso;
                vm.livello = percorso.length;

                vm.pulsanteEditSalaDisabilitato = true;
                vm.pulsanteEditArmadioDisabilitato = true;
                vm.pulsanteEditCassettoDisabilitato = true;
                vm.pulsanteEditVassoioDisabilitato = true;

                switch (vm.livello) {
                    case 1: // Clic su una Sala

                        $http.get("/api/elencoesemplaridasala/" + nodo.idSala)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoSala = nodo;
                                vm.percorsoArmadio = null;
                                vm.percorsoCassetto = null;
                                vm.percorsoVassoio = null;

                                vm.testo = vm.percorsoSala.nome;

                                vm.panelCancellaSalaVisibile = false;
                                vm.panelInserimentoSalaVisibile = false;
                                vm.panelEditSalaVisibile = true;
                                vm.pulsanteInserimentoSalaVisibile = true;
                                if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneSalaVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneSalaVisibile = true;
                                };

                                vm.inputEditSala = nodo.nome;                               
                            });
                        break;

                    case 2: // Clic su un Armadio

                        $http.get("/api/elencoesemplaridaarmadio/" + nodo.idArmadio)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoSala = percorso[1];
                                vm.percorsoArmadio = percorso[0];
                                vm.percorsoCassetto = null;
                                vm.percorsoVassoio = null;

                                vm.testo = vm.percorsoArmadio.nome + " (" +
                                    vm.percorsoSala.nome + "/" +
                                    vm.percorsoArmadio.nome + ")";

                                vm.panelCancellaArmadioVisibile = false;
                                vm.panelInserimentoArmadioVisibile = false;
                                vm.panelEditArmadioVisibile = true;
                                vm.pulsanteInserimentoArmadioVisibile = true;
                                if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneArmadioVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneArmadioVisibile = true;
                                };

                                vm.inputEditArmadio = nodo.nome;                          
                            });
                        break;

                    case 3: // Clic su un Cassetto

                        $http.get("/api/elencoesemplaridacassetto/" + nodo.idCassetto)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoSala = percorso[2];
                                vm.percorsoArmadio = percorso[1];
                                vm.percorsoCassetto = percorso[0];
                                vm.percorsoVassoio = null;

                                vm.testo = vm.percorsoCassetto.nome + " (" +
                                    vm.percorsoSala.nome + "/" +
                                    vm.percorsoArmadio.nome + "/" +
                                    vm.percorsoCassetto.nome + ")";

                                vm.panelCancellaCassettoVisibile = false;
                                vm.panelInserimentoCassettoVisibile = false;
                                vm.panelEditCassettoVisibile = true;
                                vm.pulsanteInserimentoCassettoVisibile = true;
                                if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneCassettoVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneCassettoVisibile = true;
                                };

                                vm.inputEditCassetto = nodo.nome;
                            });
                        break;

                    case 4: // Clic su un Vassoio

                        $http.get("/api/elencoesemplaridavassoio/" + nodo.idVassoio)
                            .then(function (response) {

                                numeroEsemplari = response.data.length;

                                vm.percorsoSala = percorso[3];
                                vm.percorsoArmadio = percorso[2];
                                vm.percorsoCassetto = percorso[1];
                                vm.percorsoVassoio = percorso[0];

                                vm.testo = vm.percorsoVassoio.nome + " (" +
                                    vm.percorsoSala.nome + "/" +
                                    vm.percorsoArmadio.nome + "/" +
                                    vm.percorsoCassetto.nome + "/" +
                                    vm.percorsoVassoio.nome + ")";

                                vm.panelCancellaVassoioVisibile = false;
                                vm.panelInserimentoVassoioVisibile = false;
                                vm.panelEditVassoioVisibile = true;
                                vm.pulsanteInserimentoVassoioVisibile = true;
                                if (vm.selectedNode.nome == '-' || (numeroEsemplari > 0)) {
                                    vm.pulsanteCancellazioneVassoioVisibile = false;
                                }
                                else {
                                    vm.pulsanteCancellazioneVassoioVisibile = true;
                                };

                                vm.inputEditVassoio = nodo.nome;
                            });
                        break;


                    default:
                }
            }
            else {
                vm.livello = 0;
                vm.percorsoSala = null;
                vm.percorsoArmadio = null;
                vm.percorsoCassetto = null;
                vm.percorsoVassoio = null;

                //vm.testo = vm.percorsoSala.nome;
            }

            
        };

// #endregion

// #region Variabili Sale

        vm.panelEditSalaVisibile = false;
        vm.panelInserimentoSalaVisibile = false;
        vm.panelCancellaSalaVisibile = false;
        vm.pulsanteInserimentoSalaVisibile = true;
        vm.pulsanteEditSalaDisabilitato = true;
        vm.pulsanteInsertSalaDisabilitato = true;

// #endregion

// #region Variabili Armadi

        vm.panelEditArmadioVisibile = false;
        vm.panelInserimentoArmadioVisibile = false;
        vm.panelCancellaArmadioVisibile = false;
        vm.pulsanteInserimentoArmadioVisibile = true;
        vm.pulsanteEditArmadioDisabilitato = true;
        vm.pulsanteInsertArmadioDisabilitato = true;

// #endregion

// #region Variabili Cassetti

        vm.panelEditCassettoVisibile = false;
        vm.panelInserimentoCassettoVisibile = false;
        vm.panelCancellaCassettoVisibile = false;
        vm.pulsanteInserimentoCassettoVisibile = true;
        vm.pulsanteEditCassettoDisabilitato = true;
        vm.pulsanteInsertCassettoDisabilitato = true;

// #endregion

// #region Variabili Vassoi

        vm.panelEditVassoioVisibile = false;
        vm.panelInserimentoVassoioVisibile = false;
        vm.panelCancellaVassoioVisibile = false;
        vm.pulsanteInserimentoVassoioVisibile = true;
        vm.pulsanteEditVassoioDisabilitato = true;
        vm.pulsanteInsertVassoioDisabilitato = true;

// #endregion

// #region Funzioni Sale

        vm.annullaInserimentoSala = function annullaInserimentoSala() {
            vm.panelCancellaSalaVisibile = false;
            vm.panelInserimentoSalaVisibile = false;
            vm.panelEditSalaVisibile = true;            
            vm.pulsanteInserimentoSalaVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneSalaVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneSalaVisibile = true;
            };
        };

        vm.annullaCancellaSala = function annullaCancellaSala() {
            vm.panelCancellaSalaVisibile = false;
            vm.panelInserimentoSalaVisibile = false;
            vm.panelEditSalaVisibile = true;
            vm.pulsanteInserimentoSalaVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneSalaVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneSalaVisibile = true;
            };
        };

        vm.apriPannelloInserimentoSala = function apriPannelloInserimentoSala() {
            vm.panelCancellaSalaVisibile = false;
            vm.panelEditSalaVisibile = false;
            vm.panelInserimentoSalaVisibile = true;
            vm.pulsanteInserimentoSalaVisibile = false;
            vm.pulsanteCancellazioneSalaVisibile = false;
            vm.inputInsertSala = "";
        };

        vm.apriPannelloCancellaSala = function apriPannelloCancellaSala() {
            vm.panelCancellaSalaVisibile = true;
            vm.panelEditSalaVisibile = false;
            vm.panelInserimentoSalaVisibile = false;
            vm.pulsanteInserimentoSalaVisibile = false;
            vm.pulsanteCancellazioneSalaVisibile = false;
            vm.salaDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditSala = function verificaEditSala() {
            var salaDoppia = _.find(vm.datiAlbero, function (sala) { return funzioni.confrontaStringhe(sala.nome, vm.inputEditSala) });
            vm.pulsanteEditSalaDisabilitato = (_.trim(vm.inputEditSala) == "" || _.trim(vm.inputEditSala) == "-" || salaDoppia);
            if (_.trim(vm.inputEditSala) == '-') {
                vm.inputEditSala = "";
            }
        };

        vm.verificaInsertSala = function verificaInsertSala() {
            var salaDoppia = _.find(vm.datiAlbero, function (sala) { return funzioni.confrontaStringhe(sala.nome, vm.inputInsertSala) });
            vm.pulsanteInsertSalaDisabilitato = (_.trim(vm.inputInsertSala) == "" || _.trim(vm.inputInsertSala) == "-" || salaDoppia);
            if (_.trim(vm.inputInsertSala) == '-') {
                vm.inputInsertSala = "";
            }
        };

        vm.editSala = function editSala() {

            $http.put("/api/sale",
                {
                    "id": vm.selectedNode.idSala,
                    "sala": _.trim(vm.inputEditSala)
                })
                .then(function (response) {
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idSala": vm.percorsoSala.idSala, "nome": _.trim(vm.inputEditSala) };

                            vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                            vm.percorsoArmadio = null;
                            vm.percorsoCassetto = null;
                            vm.percorsoVassoio = null;

                            vm.testo = _.trim(vm.inputEditSala);
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })  
        };

        vm.inserisciSala = function inserisciSala() {

            $http.post("/api/sale",
                {
                    "sala": _.trim(vm.inputInsertSala)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idSala": nodoInserito.id, "nome": _.trim(vm.inputInsertSala) };

                            vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                            vm.percorsoArmadio = null;
                            vm.percorsoCassetto = null;
                            vm.percorsoVassoio = null;

                            vm.testo = _.trim(vm.inputInsertSala);

                            vm.panelCancellaSalaVisibile = false;
                            vm.panelInserimentoSalaVisibile = false;
                            vm.panelEditSalaVisibile = true;
                            vm.pulsanteInserimentoSalaVisibile = true;
                            vm.pulsanteCancellazioneSalaVisibile = true;

                            vm.inputEditSala = _.trim(vm.inputInsertSala);
                        });   
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaSala = function cancellaSala() {

            $http.delete("/api/sale/" + vm.selectedNode.idSala)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridasala/" + vm.selectedNode.idSala)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;
                                    vm.selectedNode = vm.datiAlbero[0];
                                    vm.testo = vm.selectedNode.nome;

                                    vm.panelCancellaSalaVisibile = false;
                                    vm.panelInserimentoSalaVisibile = false;
                                    vm.panelEditSalaVisibile = true;
                                    vm.pulsanteInserimentoSalaVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneSalaVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneSalaVisibile = true;
                                    };

                                    vm.inputEditSala = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

// #region Funzioni Armadi

        vm.annullaInserimentoArmadio = function annullaInserimentoArmadio() {
            vm.panelCancellaArmadioVisibile = false;
            vm.panelInserimentoArmadioVisibile = false;
            vm.panelEditArmadioVisibile = true;
            vm.pulsanteInserimentoArmadioVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneArmadioVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneArmadioVisibile = true;
            };
        };

        vm.annullaCancellaArmadio = function annullaCancellaArmadio() {
            vm.panelCancellaArmadioVisibile = false;
            vm.panelInserimentoArmadioVisibile = false;
            vm.panelEditArmadioVisibile = true;
            vm.pulsanteInserimentoArmadioVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneArmadioVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneArmadioVisibile = true;
            };
        };

        vm.apriPannelloInserimentoArmadio = function apriPannelloInserimentoArmadio() {
            vm.panelCancellaArmadioVisibile = false;
            vm.panelEditArmadioVisibile = false;
            vm.panelInserimentoArmadioVisibile = true;
            vm.pulsanteInserimentoArmadioVisibile = false;
            vm.pulsanteCancellazioneArmadioVisibile = false;
            vm.inputInsertArmadio = "";
        };

        vm.apriPannelloCancellaArmadio = function apriPannelloCancellaArmadio() {
            vm.panelCancellaArmadioVisibile = true;
            vm.panelEditArmadioVisibile = false;
            vm.panelInserimentoArmadioVisibile = false;
            vm.pulsanteInserimentoArmadioVisibile = false;
            vm.pulsanteCancellazioneArmadioVisibile = false;
            vm.armadioDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditArmadio = function verificaEditArmadio() {
            var armadioDoppio = _.find(vm.percorsoSala.figli, function (armadio) { return funzioni.confrontaStringhe(armadio.nome, vm.inputEditArmadio) });
            vm.pulsanteEditArmadioDisabilitato = (_.trim(vm.inputEditArmadio) == "" || _.trim(vm.inputEditArmadio) == "-" || armadioDoppio);
            if (_.trim(vm.inputEditArmadio) == "-") {
                vm.inputEditArmadio = "";
            }
        };

        vm.verificaInsertArmadio = function verificaInsertArmadio() {
            var armadioDoppio = _.find(vm.percorsoSala.figli, function (armadio) { return funzioni.confrontaStringhe(armadio.nome, vm.inputInsertArmadio) });
            vm.pulsanteInsertArmadioDisabilitato = (_.trim(vm.inputInsertArmadio) == "" || _.trim(vm.inputInsertArmadio) == "-" || armadioDoppio);
            if (_.trim(vm.inputInsertArmadio) == "-") {
                vm.inputInsertArmadio = "";
            }
        };

        vm.editArmadio = function editArmadio() {

            $http.put("/api/armadi",
                {
                    "id": vm.percorsoArmadio.idArmadio,
                    "salaId": vm.percorsoSala.idSala,
                    "armadio": _.trim(vm.inputEditArmadio)
                })
                .then(function (response) {
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idArmadio": vm.percorsoArmadio.idArmadio, "nome": _.trim(vm.inputEditArmadio) };

                            vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                            vm.percorsoArmadio = _.find(vm.percorsoSala.figli, ["idArmadio", vm.percorsoArmadio.idArmadio]);
                            vm.percorsoCassetto = null;
                            vm.percorsoVassoio = null;

                            vm.testo = _.trim(vm.inputEditArmadio) +
                                " (" + vm.percorsoSala.nome + "/" +
                                _.trim(vm.inputEditArmadio) + ")";
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.inserisciArmadio = function inserisciArmadio() {

            $http.post("/api/armadi",
                {
                    "salaId": vm.percorsoSala.idSala,
                    "armadio": _.trim(vm.inputInsertArmadio)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idArmadio": nodoInserito.id, "nome": _.trim(vm.inputInsertArmadio) };

                            vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                            vm.percorsoArmadio = _.find(vm.percorsoSala.figli, ["idArmadio", vm.percorsoArmadio.idArmadio]);
                            vm.percorsoCassetto = null;
                            vm.percorsoVassoio = null;

                            vm.testo = _.trim(vm.inputInsertArmadio) + " (" +
                                vm.percorsoSala.nome + "/" +
                                _.trim(vm.inputInsertArmadio) + ")";

                            vm.panelCancellaArmadioVisibile = false;
                            vm.panelInserimentoArmadioVisibile = false;
                            vm.panelEditArmadioVisibile = true;
                            vm.pulsanteInserimentoArmadioVisibile = true;
                            vm.pulsanteCancellazioneArmadioVisibile = true;

                            vm.inputEditArmadio = _.trim(vm.inputInsertArmadio);
                        });
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaArmadio = function cancellaArmadio() {

            $http.delete("/api/armadi/" + vm.selectedNode.idArmadio)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridaarmadio/" + vm.selectedNode.idArmadio)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;

                                    vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                                    vm.selectedNode = vm.percorsoSala;
                                    vm.testo = vm.selectedNode.nome;

                                    vm.livello = 1;

                                    vm.panelCancellaSalaVisibile = false;
                                    vm.panelInserimentoSalaVisibile = false;
                                    vm.panelEditSalaVisibile = true;
                                    vm.pulsanteInserimentoSalaVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneSalaVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneSalaVisibile = true;
                                    };

                                    vm.inputEditSala = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

// #region Funzioni Cassetti

        vm.annullaInserimentoCassetto = function annullaInserimentoCassetto() {
            vm.panelCancellaCassettoVisibile = false;
            vm.panelInserimentoCassettoVisibile = false;
            vm.panelEditCassettoVisibile = true;
            vm.pulsanteInserimentoCassettoVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneCassettoVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneCassettoVisibile = true;
            };
        };

        vm.annullaCancellaCassetto = function annullaCancellaCassetto() {
            vm.panelCancellaCassettoVisibile = false;
            vm.panelInserimentoCassettoVisibile = false;
            vm.panelEditCassettoVisibile = true;
            vm.pulsanteInserimentoCassettoVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneCassettoVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneCassettoVisibile = true;
            };
        };

        vm.apriPannelloInserimentoCassetto = function apriPannelloInserimentoCassetto() {
            vm.panelCancellaCassettoVisibile = false;
            vm.panelEditCassettoVisibile = false;
            vm.panelInserimentoCassettoVisibile = true;
            vm.pulsanteInserimentoCassettoVisibile = false;
            vm.pulsanteCancellazioneCassettoVisibile = false;
            vm.inputInsertCassetto = "";
        };

        vm.apriPannelloCancellaCassetto = function apriPannelloCancellaCassetto() {
            vm.panelCancellaCassettoVisibile = true;
            vm.panelEditCassettoVisibile = false;
            vm.panelInserimentoCassettoVisibile = false;
            vm.pulsanteInserimentoCassettoVisibile = false;
            vm.pulsanteCancellazioneCassettoVisibile = false;
            vm.cassettoDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditCassetto = function verificaEditCassetto() {
            var cassettoDoppio = _.find(vm.percorsoArmadio.figli, function (cassetto) { return funzioni.confrontaStringhe(cassetto.nome, vm.inputEditCassetto) });
            vm.pulsanteEditCassettoDisabilitato = (_.trim(vm.inputEditCassetto) == "" || _.trim(vm.inputEditCassetto) == "-" || cassettoDoppio);
            if (_.trim(vm.inputEditCassetto) == "-") {
                vm.inputEditCassetto = "";
            }
        };

        vm.verificaInsertCassetto = function verificaInsertCassetto() {
            var cassettoDoppio = _.find(vm.percorsoArmadio.figli, function (cassetto) { return funzioni.confrontaStringhe(cassetto.nome, vm.inputInsertCassetto) });
            vm.pulsanteInsertCassettoDisabilitato = (_.trim(vm.inputInsertCassetto) == "" || _.trim(vm.inputInsertCassetto) == "-" || cassettoDoppio);
            if (_.trim(vm.inputInsertCassetto) == "-") {
                vm.inputInsertCassetto = "";
            }
        };

        vm.editCassetto = function editCassetto() {

            $http.put("/api/cassetti",
                {
                    "id": vm.percorsoCassetto.idCassetto,
                    "armadioId": vm.percorsoArmadio.idArmadio,
                    "cassetto": _.trim(vm.inputEditCassetto)
                })
                .then(function (response) {
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idCassetto": vm.percorsoCassetto.idCassetto, "nome": _.trim(vm.inputEditCassetto) };

                            vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                            vm.percorsoArmadio = _.find(vm.percorsoSala.figli, ["idArmadio", vm.percorsoArmadio.idArmadio]);
                            vm.percorsoCassetto = _.find(vm.percorsoArmadio.figli, ["idCassetto", vm.percorsoCassetto.idCassetto]);
                            vm.percorsoVassoio = null;

                            vm.testo = _.trim(vm.inputEditCassetto) +
                                " (" + vm.percorsoSala.nome + "/" +
                                vm.percorsoArmadio.nome + "/" +
                                _.trim(vm.inputEditCassetto) + ")";
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.inserisciCassetto = function inserisciCassetto() {

            $http.post("/api/cassetti",
                {
                    "armadioId": vm.percorsoArmadio.idArmadio,
                    "cassetto": _.trim(vm.inputInsertCassetto)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idCassetto": nodoInserito.id, "nome": _.trim(vm.inputInsertCassetto) };

                            vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                            vm.percorsoArmadio = _.find(vm.percorsoSala.figli, ["idArmadio", vm.percorsoArmadio.idArmadio]);
                            vm.percorsoCassetto = _.find(vm.percorsoArmadio.figli, ["idCassetto", vm.percorsoCassetto.idCassetto]);
                            vm.percorsoVassoio = null;

                            vm.testo = _.trim(vm.inputInsertCassetto) + " (" +
                                vm.percorsoSala.nome + "/" +
                                vm.percorsoArmadio.nome + "/" +
                               _.trim(vm.inputInsertCassetto) + ")";

                            vm.panelCancellaCassettoVisibile = false;
                            vm.panelInserimentoCassettoVisibile = false;
                            vm.panelEditCassettoVisibile = true;
                            vm.pulsanteInserimentoCassettoVisibile = true;
                            vm.pulsanteCancellazioneCassettoVisibile = true;

                            vm.inputEditCassetto = _.trim(vm.inputInsertCassetto);
                        });
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaCassetto = function cancellaCassetto() {

            $http.delete("/api/cassetti/" + vm.selectedNode.idCassetto)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridacassetto/" + vm.selectedNode.idCassetto)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;

                                    vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                                    vm.percorsoArmadio = _.find(vm.percorsoSala.figli, ["idArmadio", vm.percorsoArmadio.idArmadio]);
                                    vm.selectedNode = vm.percorsoArmadio;
                                    vm.testo = vm.selectedNode.nome;

                                    vm.livello = 2;

                                    vm.panelCancellaArmadioVisibile = false;
                                    vm.panelInserimentoArmadioVisibile = false;
                                    vm.panelEditArmadioVisibile = true;
                                    vm.pulsanteInserimentoArmadioVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneArmadioVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneArmadioVisibile = true;
                                    };

                                    vm.inputEditArmadio = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

// #region Funzioni Vassoi

        vm.annullaInserimentoVassoio = function annullaInserimentoVassoio() {
            vm.panelCancellaVassoioVisibile = false;
            vm.panelInserimentoVassoioVisibile = false;
            vm.panelEditVassoioVisibile = true;
            vm.pulsanteInserimentoVassoioVisibile = true;
            if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1)) {
                vm.pulsanteCancellazioneVassoioVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneVassoioVisibile = true;
            };
        };

        vm.annullaCancellaVassoio = function annullaCancellaVassoio() {
            vm.panelCancellaVassoioVisibile = false;
            vm.panelInserimentoVassoioVisibile = false;
            vm.panelEditVassoioVisibile = true;
            vm.pulsanteInserimentoVassoioVisibile = true;
            if (vm.selectedNode.nome == '-') {
                vm.pulsanteCancellazioneVassoioVisibile = false;
            }
            else {
                vm.pulsanteCancellazioneVassoioVisibile = true;
            };
        };

        vm.apriPannelloInserimentoVassoio = function apriPannelloInserimentoVassoio() {
            vm.panelCancellaVassoioVisibile = false;
            vm.panelEditVassoioVisibile = false;
            vm.panelInserimentoVassoioVisibile = true;
            vm.pulsanteInserimentoVassoioVisibile = false;
            vm.pulsanteCancellazioneVassoioVisibile = false;
            vm.inputInsertVassoio = "";
        };

        vm.apriPannelloCancellaVassoio = function apriPannelloCancellaVassoio() {
            vm.panelCancellaVassoioVisibile = true;
            vm.panelEditVassoioVisibile = false;
            vm.panelInserimentoVassoioVisibile = false;
            vm.pulsanteInserimentoVassoioVisibile = false;
            vm.pulsanteCancellazioneVassoioVisibile = false;
            vm.vassoioDaCancellare = vm.selectedNode.nome;
        };

        vm.verificaEditVassoio = function verificaEditVassoio() {
            var vassoioDoppio = _.find(vm.percorsoCassetto.figli, function (vassoio) { return funzioni.confrontaStringhe(vassoio.nome, vm.inputEditVassoio) });
            vm.pulsanteEditVassoioDisabilitato = (_.trim(vm.inputEditVassoio) == "" || _.trim(vm.inputEditVassoio) == "-" || vassoioDoppio);
            if (_.trim(vm.inputEditVassoio) == "-") {
                vm.inputEditVassoio = "";
            }
        };

        vm.verificaInsertVassoio = function verificaInsertVassoio() {
            var vassoioDoppio = _.find(vm.percorsoCassetto.figli, function (vassoio) { return funzioni.confrontaStringhe(vassoio.nome, vm.inputInsertVassoio) });
            vm.pulsanteInsertVassoioDisabilitato = (_.trim(vm.inputInsertVassoio) == "" || _.trim(vm.inputInsertVassoio) == "-" || vassoioDoppio);
            if (_.trim(vm.inputInsertVassoio) == "-") {
                vm.inputInsertVassoio = "";
            }
        };

        vm.editVassoio = function editVassoio() {

            $http.put("/api/vassoi",
                {
                    "id": vm.percorsoVassoio.idVassoio,
                    "cassettoId": vm.percorsoCassetto.idCassetto,
                    "vassoio": _.trim(vm.inputEditVassoio)
                })
                .then(function (response) {
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idVassoio": vm.percorsoVassoio.idVassoio, "nome": _.trim(vm.inputEditVassoio) };

                            vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                            vm.percorsoArmadio = _.find(vm.percorsoSala.figli, ["idArmadio", vm.percorsoArmadio.idArmadio]);
                            vm.percorsoCassetto = _.find(vm.percorsoArmadio.figli, ["idCassetto", vm.percorsoCassetto.idCassetto]);
                            vm.percorsoVassoio = _.find(vm.percorsoCassetto.figli, ["idVassoio", vm.percorsoVassoio.idVassoio]);

                            vm.testo = _.trim(vm.inputEditVassoio) + " (" +
                               vm.percorsoSala.nome + "/" +
                               vm.percorsoArmadio.nome + "/" +
                               vm.percorsoCassetto.nome + "/" +
                               _.trim(vm.inputEditVassoio) + ")";
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.inserisciVassoio = function inserisciVassoio() {

            $http.post("/api/vassoi",
                {
                    "cassettoId": vm.percorsoCassetto.idCassetto,
                    "vassoio": _.trim(vm.inputInsertVassoio)
                })
                .then(function (response) {
                    var nodoInserito = response.data;
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = { "idVassoio": nodoInserito.id, "nome": _.trim(vm.inputInsertVassoio) };

                            vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                            vm.percorsoArmadio = _.find(vm.percorsoSala.figli, ["idArmadio", vm.percorsoArmadio.idArmadio]);
                            vm.percorsoCassetto = _.find(vm.percorsoArmadio.figli, ["idCassetto", vm.percorsoCassetto.idCassetto]);
                            vm.percorsoVassoio = _.find(vm.percorsoCassetto.figli, ["idVassoio", vm.percorsoVassoio.idVassoio]);

                            vm.testo = _.trim(vm.inputInsertVassoio) + " (" +
                                vm.percorsoSala.nome + "/" +
                                vm.percorsoArmadio.nome + "/" +
                                vm.percorsoCassetto.nome + "/" +
                               _.trim(vm.inputInsertVassoio) + ")";

                            vm.panelCancellaVassoioVisibile = false;
                            vm.panelInserimentoVassoioVisibile = false;
                            vm.panelEditVassoioVisibile = true;
                            vm.pulsanteInserimentoVassoioVisibile = true;
                            vm.pulsanteCancellazioneVassoioVisibile = true;

                            vm.inputEditVassoio = _.trim(vm.inputInsertVassoio);
                        });
                }, function () {
                    alert("Errore non gestito durante l'inserimento");
                })
                .finally(function () {

                })
        };

        vm.cancellaVassoio = function cancellaVassoio() {

            $http.delete("/api/vassoi/" + vm.selectedNode.idVassoio)     // chiamo la API di cancellazione
                .then(function (response) {
                    $http.get("/api/collocazione")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            $http.get("/api/elencoesemplaridavassoio/" + vm.selectedNode.idVassoio)
                                .then(function (response) {
                                    numeroEsemplari = response.data.length;

                                    vm.percorsoSala = _.find(vm.datiAlbero, ["idSala", vm.percorsoSala.idSala]);
                                    vm.percorsoArmadio = _.find(vm.percorsoSala.figli, ["idArmadio", vm.percorsoArmadio.idArmadio]);
                                    vm.percorsoCassetto = _.find(vm.percorsoArmadio.figli, ["idCassetto", vm.percorsoCassetto.idCassetto]);
                                    
                                    vm.selectedNode = vm.percorsoCassetto;
                                    vm.testo = vm.selectedNode.nome;

                                    vm.livello = 3;

                                    vm.panelCancellaCassettoVisibile = false;
                                    vm.panelInserimentoCassettoVisibile = false;
                                    vm.panelEditCassettoVisibile = true;
                                    vm.pulsanteInserimentoCassettoVisibile = true;
                                    if ((vm.selectedNode.nome == '-') || (vm.selectedNode.figli.length != 1) || (numeroEsemplari > 0)) {
                                        vm.pulsanteCancellazioneCassettoVisibile = false;
                                    }
                                    else {
                                        vm.pulsanteCancellazioneCassettoVisibile = true;
                                    };

                                    vm.inputEditCassetto = vm.selectedNode.nome;
                                })
                        });
                }, function () {
                    alert("Errore non gestito durante la cancellazione");
                })
            .finally(function () {

            })
        };

// #endregion

        $http.get("/api/collocazione")
            .then(function (response) {
                vm.datiAlbero = response.data;
            });
    }
})();