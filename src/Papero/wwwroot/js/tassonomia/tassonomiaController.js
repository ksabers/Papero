// tassonomiaController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("tassonomiaController", tassonomiaController);

    function tassonomiaController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoEsemplari = [];                 // Elenco completo non filtrato degli esemplari 
        var elencoFiltratoEsemplari = [];         // Elenco filtrato degli esemplari 

        var alberoTassonomia = [];                // Array delle entità contenute nell'albero
        var re = new RegExp("([1-9][0-9]*)");

        var vm = this;

        vm.opzioniTabellaElencoClassificatori = DTOptionsBuilder.newOptions()   // Opzioni di visualizzazione delle angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);    // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                 // (come da specifiche delle angular datatables)
                                                                 // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)


        vm.opzioniTabellaElencoSpecieClassificatori = DTOptionsBuilder.newOptions()   // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);

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

        vm.nodoSelezionato = function nodoSelezionato(nodo, percorso, selezionato) {  //  Funzione che viene richiamata alla selezione di un elemento dell'albero

            if (selezionato) {
                vm.percorso = percorso;
                vm.livello = percorso.length;

                vm.pulsanteEditFamigliaDisabilitato = true;        // All'apertura di un panel di edit, i pulsanti sono sempre disabilitati (perché non è stato
                vm.pulsanteEditSottofamigliaDisabilitato = true;   // ancora modificato nulla)
                vm.pulsanteEditTribuDisabilitato = true;
                vm.pulsanteEditGenereDisabilitato = true;
                vm.pulsanteEditSpecieDisabilitato = true;
                vm.pulsanteEditSottospecieDisabilitato = true;

                vm.testo = nodo.nome;
                switch (vm.livello) {
                    case 1: // clic su una Famiglia

                        vm.panelEditFamigliaVisibile = true;           //  Rendiamo visibile solo il giusto pannello di edit
                        vm.panelEditSottofamigliaVisibile = false;
                        vm.panelEditTribuVisibile = false;
                        vm.panelEditGenereVisibile = false;
                        vm.panelEditSpecieVisibile = false;
                        vm.panelEditSottospecieVisibile = false;
                        vm.panelInsertSpecieVisibile = false;

                        vm.percorsoFamiglia = nodo;                    // Memorizziamo i percorsi del nodo selezionato
                        vm.percorsoSottofamiglia = null;
                        vm.percorsoTribu = null;
                        vm.percorsoGenere = null;
                        vm.percorsoSpecie = null;
                        vm.percorsoSottospecie = null;


                        vm.inputEditFamiglia = nodo.nome;
                        vm.passeriforme = nodo.passeriforme;
                        break;

                    case 2: // Clic su una Sottofamiglia

                        vm.panelEditFamigliaVisibile = false;          //  Rendiamo visibile solo il giusto pannello di edit
                        vm.panelEditSottofamigliaVisibile = true;
                        vm.panelEditTribuVisibile = false;
                        vm.panelEditGenereVisibile = false;
                        vm.panelEditSpecieVisibile = false;
                        vm.panelEditSottospecieVisibile = false;
                        vm.panelInsertSpecieVisibile = false;

                        vm.percorsoFamiglia = percorso[1];             // Memorizziamo i percorsi del nodo selezionato
                        vm.percorsoSottofamiglia = percorso[0];
                        vm.percorsoTribu = null;
                        vm.percorsoGenere = null;
                        vm.percorsoSpecie = null;
                        vm.percorsoSottospecie = null;

                        vm.inputEditSottofamiglia = nodo.nome;
                        break;

                    case 3:  // Clic su una Tribù

                        vm.panelEditFamigliaVisibile = false;          //  Rendiamo visibile solo il giusto pannello di edit
                        vm.panelEditSottofamigliaVisibile = false;
                        vm.panelEditTribuVisibile = true;
                        vm.panelEditGenereVisibile = false;
                        vm.panelEditSpecieVisibile = false;
                        vm.panelEditSottospecieVisibile = false;
                        vm.panelInsertSpecieVisibile = false;

                        vm.percorsoFamiglia = percorso[2];             // Memorizziamo i percorsi del nodo selezionato
                        vm.percorsoSottofamiglia = percorso[1];
                        vm.percorsoTribu = percorso[0];
                        vm.percorsoGenere = null;
                        vm.percorsoSpecie = null;
                        vm.percorsoSottospecie = null;

                        vm.inputEditTribu = nodo.nome;
                        break;

                    case 4:  // Clic su un Genere

                        vm.panelEditFamigliaVisibile = false;          //  Rendiamo visibile solo il giusto pannello di edit
                        vm.panelEditSottofamigliaVisibile = false;
                        vm.panelEditTribuVisibile = false;
                        vm.panelEditGenereVisibile = true;
                        vm.panelEditSpecieVisibile = false;
                        vm.panelEditSottospecieVisibile = false;
                        vm.panelInsertSpecieVisibile = false;

                        vm.percorsoFamiglia = percorso[3];             // Memorizziamo i percorsi del nodo selezionato
                        vm.percorsoSottofamiglia = percorso[2];
                        vm.percorsoTribu = percorso[1];
                        vm.percorsoGenere = percorso[0];
                        vm.percorsoSpecie = null;
                        vm.percorsoSottospecie = null;

                        vm.inputEditGenere = nodo.nome;
                        break;

                    case 5:  // Clic su una Specie

                        vm.panelEditFamigliaVisibile = false;          //  Rendiamo visibile solo il giusto pannello di edit
                        vm.panelEditSottofamigliaVisibile = false;
                        vm.panelEditTribuVisibile = false;
                        vm.panelEditGenereVisibile = false;
                        vm.panelEditSpecieVisibile = true;
                        vm.panelEditSottospecieVisibile = false;
                        vm.panelInsertSpecieVisibile = false;

                        vm.pulsanteInserimentoSpecieVisibile = true;

                        vm.percorsoFamiglia = percorso[4];             // Memorizziamo i percorsi del nodo selezionato
                        vm.percorsoSottofamiglia = percorso[3];
                        vm.percorsoTribu = percorso[2];
                        vm.percorsoGenere = percorso[1];
                        vm.percorsoSpecie = percorso[0];
                        vm.percorsoSottospecie = null;

                        vm.inputEditSpecie = nodo.nome;
                        break;

                    case 6:  // Clic su una Sottospecie

                        $http.get("/api/classificazioni/" + nodo.id)
                            .then(function (response) {
                                vm.datiTabellaClassificatori = response.data;
                                aggiornaDropdownClassificatori();
                                vm.panelEditFamigliaVisibile = false;          //  Rendiamo visibile solo il giusto pannello di edit
                                vm.panelEditSottofamigliaVisibile = false;
                                vm.panelEditTribuVisibile = false;
                                vm.panelEditGenereVisibile = false;
                                vm.panelEditSpecieVisibile = false;
                                vm.panelEditSottospecieVisibile = true;
                                vm.panelInsertSpecieVisibile = false;

                                vm.percorsoFamiglia = percorso[5];             // Memorizziamo i percorsi del nodo selezionato
                                vm.percorsoSottofamiglia = percorso[4];
                                vm.percorsoTribu = percorso[3];
                                vm.percorsoGenere = percorso[2];
                                vm.percorsoSpecie = percorso[1];
                                vm.percorsoSottospecie = percorso[0];

                                vm.inputEditSottospecie = nodo.nome;
                                vm.inputEditNomeItaliano = nodo.nomeItaliano;
                                vm.inputEditNomeInglese = nodo.nomeInglese;
                                vm.statoDiConservazioneSelezionato = _.find(vm.elencoStatiConservazione, ["id", nodo.statoConservazioneId]);
                                vm.inputEditAnnoClassificazione = parseInt(nodo.annoClassificazione);
                                vm.classificazioneOriginale = nodo.classificazioneOriginale;
                                vm.aggiornaElencoClassificatori();
                            }); 
                        break;

                    default:
                }
            }
            else {
                vm.livello = 0;
                vm.percorsoFamiglia = null;       // Azzeriamo i percorsi poiché non c'è nessun nodo selezionato
                vm.percorsoSottofamiglia = null;
                vm.percorsoTribu = null;
                vm.percorsoGenere = null;
                vm.percorsoSpecie = null;
                vm.percorsoSottospecie = null;
            }
        };

// #endregion

// #region Variabili Famiglie

        vm.panelEditFamigliaVisibile = false;

// #endregion

// #region Variabili Sottofamiglie

        vm.panelEditSottofamigliaVisibile = false;

// #endregion

// #region Variabili Tribù

        vm.panelEditTribuVisibile = false;

// #endregion

// #region Variabili Generi

        vm.panelEditGenereVisibile = false;

// #endregion

// #region Variabili Specie

        vm.panelEditSpecieVisibile = false;
        vm.panelInsertSpecieVisibile = false;
        vm.pulsanteInsertSpecieDisabilitato = true;
        vm.pulsanteInserimentoSpecieVisibile = true;

        vm.labelPulsanteFamigliaCorrente = true;
        vm.labelPulsanteSottofamigliaCorrente = true;
        vm.labelPulsanteTribuCorrente = true;
        vm.labelPulsanteGenereCorrente = true;

// #endregion

// #region Variabili Sottospecie

        vm.panelEditSottospecieVisibile = false;

// #endregion

//#region Funzioni Famiglie

        vm.verificaEditFamiglia = function verificaEditFamiglia() {

            var esisteFamigliaDoppia = false;
            var passeriformeDoppio = false;

            var famigliaDoppia = _.find(vm.datiAlbero, function (famiglia) { return funzioni.confrontaStringhe(famiglia.nome, vm.inputEditFamiglia) });
            if (famigliaDoppia == undefined) {
                esisteFamigliaDoppia = false
            }
            else {
                if (funzioni.confrontaStringhe(vm.selectedNode.nome, vm.inputEditFamiglia)) {
                    esisteFamigliaDoppia = false
                }
                else {
                    esisteFamigliaDoppia = true;
                }
            };

            passeriformeDoppio = (vm.passeriforme == vm.selectedNode.passeriforme);

            if (passeriformeDoppio) {
                vm.pulsanteEditFamigliaDisabilitato = (_.trim(vm.inputEditFamiglia) == "" ||
                                                       _.trim(vm.inputEditFamiglia) == "-" ||
                                                       famigliaDoppia);
            }
            else {
                vm.pulsanteEditFamigliaDisabilitato = (_.trim(vm.inputEditFamiglia) == "" ||
                                                       _.trim(vm.inputEditFamiglia) == "-" ||
                                                       esisteFamigliaDoppia);
            }
        };

        vm.editFamiglia = function editFamiglia() {

            $http.put("/api/famiglie",
                {
                    "id": vm.percorsoFamiglia.id,
                    "nome": _.toUpper(_.trim(vm.inputEditFamiglia)),
                    "passeriforme": vm.passeriforme
                })
                .then(function (response) {
                    $http.get("/api/albero")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "id": vm.percorsoFamiglia.id,
                                "nome": _.toUpper(_.trim(vm.inputEditFamiglia)),
                                "passeriforme": vm.passeriforme
                            };

                            vm.percorsoFamiglia = _.find(vm.datiAlbero, ["id", vm.percorsoFamiglia.id]);
                            vm.percorsoSottofamiglia = null;
                            vm.percorsoTribu = null;
                            vm.percorsoGenere = null;
                            vm.percorsoSpecie = null;
                            vm.percorsoSottospecie = null;

                            vm.testo = _.toUpper(_.trim(vm.inputEditFamiglia));
                            vm.inputEditFamiglia = _.toUpper(_.trim(vm.inputEditFamiglia));

                            vm.pulsanteEditFamigliaDisabilitato = true;
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

//#endregion

//#region Funzioni Sottofamiglie

        vm.verificaEditSottofamiglia = function verificaEditSottofamiglia() {

            var sottofamigliaDoppia = _.find(vm.percorsoFamiglia.figli, function (sottofamiglia) { return funzioni.confrontaStringhe(sottofamiglia.nome, vm.inputEditSottofamiglia) });

            vm.pulsanteEditSottofamigliaDisabilitato = (_.trim(vm.inputEditSottofamiglia) == "" ||
                                                       _.trim(vm.inputEditSottofamiglia) == "-" ||
                                                       sottofamigliaDoppia);

            if (_.trim(vm.inputEditSottofamiglia) == "-") {
                vm.inputEditSottofamiglia = "";
            };
        }

        vm.editSottofamiglia = function editSottofamiglia() {

            $http.put("/api/sottofamiglie",
                {
                    "id": vm.percorsoSottofamiglia.id,
                    "famigliaId": vm.percorsoSottofamiglia.famigliaId,
                    "nome": _.upperFirst(_.trim(vm.inputEditSottofamiglia))
                })
                .then(function (response) {
                    $http.get("/api/albero")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "id": vm.percorsoSottofamiglia.id,
                                "famigliaId": vm.percorsoSottofamiglia.famigliaId,
                                "nome": _.upperFirst(_.trim(vm.inputEditSottofamiglia)),
                                "famiglia": null
                            };

                            vm.percorsoFamiglia = _.find(vm.datiAlbero, ["id", vm.percorsoFamiglia.id]);
                            vm.percorsoSottofamiglia = _.find(vm.percorsoFamiglia.figli, ["id", vm.percorsoSottofamiglia.id]);
                            vm.percorsoTribu = null;
                            vm.percorsoGenere = null;
                            vm.percorsoSpecie = null;
                            vm.percorsoSottospecie = null;

                            vm.testo = _.upperFirst(_.trim(vm.inputEditSottofamiglia));
                            vm.inputEditSottofamiglia = vm.testo;

                            vm.pulsanteEditSottofamigliaDisabilitato = true;
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

//#endregion

//#region Funzioni Tribù

        vm.verificaEditTribu = function verificaEditTribu() {

            var tribuDoppia = _.find(vm.percorsoSottofamiglia.figli, function (tribu) { return funzioni.confrontaStringhe(tribu.nome, vm.inputEditTribu) });

            vm.pulsanteEditTribuDisabilitato = (_.trim(vm.inputEditTribu) == "" ||
                                                       _.trim(vm.inputEditTribu) == "-" ||
                                                       tribuDoppia);

            if (_.trim(vm.inputEditTribu) == "-") {
                vm.inputEditTribu = "";
            };
        }

        vm.editTribu = function editTribu() {

            $http.put("/api/tribu",
                {
                    "id": vm.percorsoTribu.id,
                    "sottofamigliaId": vm.percorsoTribu.sottofamigliaId,
                    "nome": _.upperFirst(_.trim(vm.inputEditTribu))
                })
                .then(function (response) {
                    $http.get("/api/albero")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "id": vm.percorsoTribu.id,
                                "sottofamigliaId": vm.percorsoTribu.sottofamigliaId,
                                "nome": _.upperFirst(_.trim(vm.inputEditTribu)),
                                "sottofamiglia": null
                            };
                            vm.percorsoFamiglia = _.find(vm.datiAlbero, ["id", vm.percorsoFamiglia.id]);
                            vm.percorsoSottofamiglia = _.find(vm.percorsoFamiglia.figli, ["id", vm.percorsoSottofamiglia.id]);
                            vm.percorsoTribu = _.find(vm.percorsoSottofamiglia.figli, ["id", vm.percorsoTribu.id]);
                            vm.percorsoGenere = null;
                            vm.percorsoSpecie = null;
                            vm.percorsoSottospecie = null;

                            vm.testo = _.upperFirst(_.trim(vm.inputEditTribu));
                            vm.inputEditTribu = vm.testo;

                            vm.pulsanteEditTribuDisabilitato = true;
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

//#endregion

//#region Funzioni Generi

        vm.verificaEditGenere = function verificaEditGenere() {

            var genereDoppio = _.find(vm.percorsoTribu.figli, function (genere) { return funzioni.confrontaStringhe(genere.nome, vm.inputEditGenere) });

            vm.pulsanteEditGenereDisabilitato = (_.trim(vm.inputEditGenere) == "" ||
                                                 _.trim(vm.inputEditGenere) == "-" ||
                                                 genereDoppio);

            if (_.trim(vm.inputEditGenere) == "-") {
                vm.inputEditGenere = "";
            };
        }

        vm.editGenere = function editGenere() {

            $http.put("/api/generi",
                {
                    "id": vm.percorsoGenere.id,
                    "tribuId": vm.percorsoGenere.tribuId,
                    "nome": _.upperFirst(_.trim(vm.inputEditGenere))
                })
                .then(function (response) {
                    $http.get("/api/albero")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "id": vm.percorsoGenere.id,
                                "tribuId": vm.percorsoGenere.tribuId,
                                "nome": _.upperFirst(_.trim(vm.inputEditGenere)),
                                "tribu": null
                            };
                            vm.percorsoFamiglia = _.find(vm.datiAlbero, ["id", vm.percorsoFamiglia.id]);
                            vm.percorsoSottofamiglia = _.find(vm.percorsoFamiglia.figli, ["id", vm.percorsoSottofamiglia.id]);
                            vm.percorsoTribu = _.find(vm.percorsoSottofamiglia.figli, ["id", vm.percorsoTribu.id]);
                            vm.percorsoGenere = _.find(vm.percorsoTribu.figli, ["id", vm.percorsoGenere.id]);
                            vm.percorsoSpecie = null;
                            vm.percorsoSottospecie = null;

                            vm.testo = _.upperFirst(_.trim(vm.inputEditGenere));
                            vm.inputEditGenere = vm.testo;

                            vm.pulsanteEditGenereDisabilitato = true;
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

//#endregion

//#region Funzioni Specie

        vm.verificaEditSpecie = function verificaEditSpecie() {

            var specieDoppia = _.find(vm.percorsoGenere.figli, function (specie) { return funzioni.confrontaStringhe(specie.nome, vm.inputEditSpecie) });

            vm.pulsanteEditSpecieDisabilitato = (_.trim(vm.inputEditSpecie) == "" ||
                                                 _.trim(vm.inputEditSpecie) == "-" ||
                                                 specieDoppia);

            if (_.trim(vm.inputEditSpecie) == "-") {
                vm.inputEditSpecie = "";
            };
        };

        vm.verificaInsertSpecie = function verificaInsertSpecie() {

            vm.aggiornaElencoSpecieClassificatori();

            vm.pulsanteInsertSpecieDisabilitato = (_.trim(vm.inputInsertSpecie) == "" ||
                                                      _.trim(vm.inputInsertSpecie) == "-" ||
                                                      _.trim(vm.inputInsertSpecieAnnoClassificazione) == "" ||
                                                      vm.stringaElencoSpecieClassificatori == "-" ||
                                                      vm.stringaElencoSpecieClassificatori == "" ||
                                                      ((!vm.labelPulsanteFamigliaCorrente) && (_.trim(vm.inputInsertSpecieFamiglia) == "")) ||
                                                      ((!vm.labelPulsanteGenereCorrente) && (_.trim(vm.inputInsertSpecieGenere) == "")));

            if (_.trim(vm.inputEditSottospecie) == "-") {
                vm.inputEditSottospecie = "";
            };
        };

        vm.editSpecie = function editSpecie() {

            $http.put("/api/specie",
                {
                    "id": vm.percorsoSpecie.id,
                    "genereId": vm.percorsoSpecie.genereId,
                    "nome": _.upperFirst(_.trim(vm.inputEditSpecie))
                })
                .then(function (response) {
                    $http.get("/api/albero")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "id": vm.percorsoSpecie.id,
                                "genereId": vm.percorsoSpecie.genereId,
                                "nome": _.upperFirst(_.trim(vm.inputEditSpecie)),
                                "genere": null
                            };
                            vm.percorsoFamiglia = _.find(vm.datiAlbero, ["id", vm.percorsoFamiglia.id]);
                            vm.percorsoSottofamiglia = _.find(vm.percorsoFamiglia.figli, ["id", vm.percorsoSottofamiglia.id]);
                            vm.percorsoTribu = _.find(vm.percorsoSottofamiglia.figli, ["id", vm.percorsoTribu.id]);
                            vm.percorsoGenere = _.find(vm.percorsoTribu.figli, ["id", vm.percorsoGenere.id]);
                            vm.percorsoSpecie = _.find(vm.percorsoGenere.figli, ["id", vm.percorsoSpecie.id]);
                            vm.percorsoSottospecie = null;

                            vm.testo = _.upperFirst(_.trim(vm.inputEditSpecie));
                            vm.inputEditSpecie = vm.testo;

                            vm.pulsanteEditSpecieDisabilitato = true;
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

        vm.apriPannelloInserimentoSpecie = function apriPannelloInserimentoSpecie() {

            vm.panelEditSpecieVisibile = false;
            vm.panelInsertSpecieVisibile = true;
            vm.pulsanteInserimentoSpecieVisibile = false;

            vm.selezionaFamigliaCorrente();
            vm.selezionaSottofamigliaCorrente();
            vm.selezionaTribuCorrente();
            vm.selezionaGenereCorrente();

            vm.inputInsertSpecie = "";
            vm.inputInsertSpecieNomeItaliano = "";
            vm.inputInsertSpecieNomeInglese = "";
            vm.statoDiConservazioneSpecieSelezionato = _.find(vm.elencoStatiConservazione, ["statoConservazione", "-"]);
            vm.dropdownSpecieClassificatori = vm.elencoClassificatori;
            vm.classificatoreSpecieSelezionato = vm.elencoClassificatori[0];
            vm.inputInsertSpecieAnnoClassificazione = "";
            vm.specieClassificazioneOriginale = false;
            vm.datiTabellaSpecieClassificatori = [];
            vm.stringaElencoSpecieClassificatori = "-";

            vm.pulsanteInsertSpecieDisabilitato = true;

        };

        vm.annullaInserimentoSpecie = function annullaInserimentoSpecie() {

            vm.panelEditSpecieVisibile = true;
            vm.panelInsertSpecieVisibile = false;
            vm.pulsanteInserimentoSpecieVisibile = true;

        };

        vm.inserisciSpecie = function inserisciSpecie() {

        };

        vm.selezionaFamigliaCorrente = function selezionaFamigliaCorrente() {
            vm.labelPulsanteFamigliaCorrente = true;
            vm.inputInsertSpecieFamiglia = vm.percorsoFamiglia.nome;
            vm.verificaInsertSpecie();
        };

        vm.selezionaFamigliaNuova = function selezionaFamigliaNuova() {
            vm.labelPulsanteFamigliaCorrente = false;
            vm.inputInsertSpecieFamiglia = "";
            vm.selezionaSottofamigliaNuova();
            vm.verificaInsertSpecie();
        };

        vm.selezionaSottofamigliaCorrente = function selezionaSottofamigliaCorrente() {
            vm.labelPulsanteSottofamigliaCorrente = true;
            vm.inputInsertSpecieSottofamiglia = vm.percorsoSottofamiglia.nome;
            vm.verificaInsertSpecie();
        };

        vm.selezionaSottofamigliaNuova = function selezionaSottofamigliaNuova() {
            vm.labelPulsanteSottofamigliaCorrente = false;
            vm.inputInsertSpecieSottofamiglia = "-";
            vm.selezionaTribuNuova();
            vm.verificaInsertSpecie();
        };

        vm.selezionaTribuCorrente = function selezionaTribuCorrente() {
            vm.labelPulsanteTribuCorrente = true;
            vm.inputInsertSpecieTribu = vm.percorsoTribu.nome;
            vm.verificaInsertSpecie();
        };

        vm.selezionaTribuNuova = function selezionaTribuNuova() {
            vm.labelPulsanteTribuCorrente = false;
            vm.inputInsertSpecieTribu = "-";
            vm.selezionaGenereNuovo();
            vm.verificaInsertSpecie();
        };

        vm.selezionaGenereCorrente = function selezionaGenereCorrente() {
            vm.labelPulsanteGenereCorrente = true;
            vm.inputInsertSpecieGenere = vm.percorsoGenere.nome;
            vm.verificaInsertSpecie();
        };

        vm.selezionaGenereNuovo = function selezionaGenereNuovo() {
            vm.labelPulsanteGenereCorrente = false;
            vm.inputInsertSpecieGenere = "";
            vm.verificaInsertSpecie();
        };

        vm.spostaSuSpecie = function spostaSuSpecie(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaSpecieClassificatori[indice];
            var elementoPrecedente = vm.datiTabellaSpecieClassificatori[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaSpecieClassificatori, vm.datiTabellaSpecieClassificatori.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaSpecieClassificatori, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaSpecieClassificatori = arrayRiordinato;
            vm.verificaInsertSpecie();
        };

        vm.spostaGiuSpecie = function spostaGiuSpecie(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaSpecieClassificatori[indice];
            var elementoSuccessivo = vm.datiTabellaSpecieClassificatori[indice + 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaSpecieClassificatori, vm.datiTabellaSpecieClassificatori.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaSpecieClassificatori, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaSpecieClassificatori = arrayRiordinato;
            vm.verificaInsertSpecie();
        };

        vm.aggiungiSpecieClassificatore = function aggiungiSpecieClassificatore() {
            vm.datiTabellaSpecieClassificatori.push(vm.classificatoreSpecieSelezionato);
            aggiornaDropdownSpecieClassificatori();
            vm.verificaInsertSpecie();
            vm.classificatoreSpecieSelezionato = vm.dropdownSpecieClassificatori[0];
        };

        function aggiornaDropdownSpecieClassificatori() {
            var arrayClassificatori = [];   // Array di servizio che serve per tenere l'elenco degli id dei Classificatori selezionati nella tabella. Viene usato per filtrare la dropdown
            // togliendo i Classificatori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaSpecieClassificatori.length; i++)           // Riempimento dell'array di servizio
                arrayClassificatori.push(vm.datiTabellaSpecieClassificatori[i].id);

            vm.dropdownSpecieClassificatori = _.filter(vm.elencoClassificatori, function (classificatore) { return !arrayClassificatori.includes(classificatore.id) });
            vm.classificatoreSpecieSelezionato = vm.dropdownSpecieClassificatori[0];
            vm.invalido = vm.datiTabellaSpecieClassificatori.length == 0;
        };

        vm.rimuoviClassificatoreSpecie = function rimuoviClassificatoreSpecie(classificatoreSelezionato) {
            vm.datiTabellaSpecieClassificatori = _.remove(vm.datiTabellaSpecieClassificatori, function (classificatore) { return classificatore.id != classificatoreSelezionato.id });
            aggiornaDropdownSpecieClassificatori();
            vm.verificaInsertSpecie();
        };

        vm.aggiornaElencoSpecieClassificatori = function aggiornaElencoSpecieClassificatori() {
            var elenco = "";
            var serializzazione = "";
            if (vm.datiTabellaSpecieClassificatori == undefined) {  // Questa if serve perché la funzione viene chiamata implicitamente da Angular
                var lunghezza = 0;                                  // quando si apre il panel, e in quel momento la tabella non è ancora popolata,
            }                                                       // quindi è undefined e bisogna considerarla come se fosse vuota
            else {
                var lunghezza = vm.datiTabellaSpecieClassificatori.length;
            }

            var sequenza = 1;

            for (var i = 0; i < lunghezza; i++) {
                if (sequenza < lunghezza - 1) {
                    elenco = elenco + vm.datiTabellaSpecieClassificatori[i].classificatore + ", ";
                    sequenza += 1;
                    continue;
                };
                if (sequenza == lunghezza - 1) {
                    elenco = elenco + vm.datiTabellaSpecieClassificatori[i].classificatore + " & ";
                    sequenza += 1;
                    continue;
                };
                if (sequenza == lunghezza) {
                    elenco = elenco + vm.datiTabellaSpecieClassificatori[i].classificatore;
                    sequenza += 1;
                    break;
                };
            }

            if (vm.inputInsertSpecieAnnoClassificazione != null)
                elenco = elenco + ", " + vm.inputInsertSpecieAnnoClassificazione.toString();

            if (!vm.specieClassificazioneOriginale) {
                elenco = "(" + elenco + ")";
            }

            if (lunghezza == 0) {
                elenco = "-"
            };

            vm.stringaElencoSpecieClassificatori = elenco;
            serializzazione = "";
            for (var i = 0; i < lunghezza; i++) {
                serializzazione += vm.datiTabellaSpecieClassificatori[i].id + ",";
            };
            serializzazione = "[" + serializzazione.substring(0, serializzazione.length - 1) + "]";

        };

//#endregion

//#region Funzioni Sottospecie

        vm.verificaEditSottospecie = function verificaEditSottospecie() {
            vm.aggiornaElencoClassificatori();

            vm.pulsanteEditSottospecieDisabilitato = (_.trim(vm.inputEditSottospecie) == "" ||
                                                      _.trim(vm.inputEditSottospecie) == "-" ||
                                                      _.trim(vm.inputEditAnnoClassificazione) == "" ||
                                                      vm.stringaElencoClassificatori == "-");

            if (_.trim(vm.inputEditSottospecie) == "-") {
                vm.inputEditSottospecie = "";
            };
        }

        vm.aggiungiClassificatore = function aggiungiClassificatore() {
            vm.datiTabellaClassificatori.push(vm.classificatoreSelezionato);
            aggiornaDropdownClassificatori();
            vm.verificaEditSottospecie();
            vm.classificatoreSelezionato = vm.dropdownClassificatori[0];
        };

        function aggiornaDropdownClassificatori() {
            var arrayClassificatori = [];   // Array di servizio che serve per tenere l'elenco degli id dei Classificatori selezionati nella tabella. Viene usato per filtrare la dropdown
                                            // togliendo i Classificatori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaClassificatori.length; i++)           // Riempimento dell'array di servizio
                arrayClassificatori.push(vm.datiTabellaClassificatori[i].id);

            vm.dropdownClassificatori = _.filter(vm.elencoClassificatori, function (classificatore) { return !arrayClassificatori.includes(classificatore.id) });
            vm.classificatoreSelezionato = vm.dropdownClassificatori[0];
            vm.invalido = vm.datiTabellaClassificatori.length == 0;
        };

        vm.spostaSu = function spostaSu(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaClassificatori[indice];
            var elementoPrecedente = vm.datiTabellaClassificatori[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaClassificatori, vm.datiTabellaClassificatori.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaClassificatori, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaClassificatori = arrayRiordinato;
            vm.verificaEditSottospecie();
        };

        vm.spostaGiu = function spostaGiu(indice) {
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaClassificatori[indice];
            var elementoSuccessivo = vm.datiTabellaClassificatori[indice + 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaClassificatori, vm.datiTabellaClassificatori.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaClassificatori, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaClassificatori = arrayRiordinato;
            vm.verificaEditSottospecie();
        };

        vm.rimuoviClassificatore = function rimuoviClassificatore(classificatoreSelezionato) {
            vm.datiTabellaClassificatori = _.remove(vm.datiTabellaClassificatori, function (classificatore) { return classificatore.id != classificatoreSelezionato.id });
            aggiornaDropdownClassificatori();
            vm.verificaEditSottospecie();
        };

        vm.aggiornaElencoClassificatori = function aggiornaElencoClassificatori() {
            var elenco = "";
            var serializzazione = "";
            var lunghezza = vm.datiTabellaClassificatori.length;
            var sequenza = 1;

            for (var i = 0; i < lunghezza; i++) {
                if (sequenza < lunghezza - 1) {
                    elenco = elenco + vm.datiTabellaClassificatori[i].classificatore + ", ";
                    sequenza += 1;
                    continue;
                };
                if (sequenza == lunghezza - 1) {
                    elenco = elenco + vm.datiTabellaClassificatori[i].classificatore + " & ";
                    sequenza += 1;
                    continue;
                };
                if (sequenza == lunghezza) {
                    elenco = elenco + vm.datiTabellaClassificatori[i].classificatore;
                    sequenza += 1;
                    break;
                };
            }

            if (vm.inputEditAnnoClassificazione != null)
                elenco = elenco + ", " + vm.inputEditAnnoClassificazione.toString();

            if (!vm.classificazioneOriginale) {
                elenco = "(" + elenco + ")";
            }

            if (lunghezza == 0) {
                elenco = "-"
            };

            vm.stringaElencoClassificatori = elenco;
            serializzazione = "";
            for (var i = 0; i < lunghezza; i++) {
                serializzazione += vm.datiTabellaClassificatori[i].id + ",";
            };
            serializzazione = "[" + serializzazione.substring(0, serializzazione.length - 1) + "]";

        };

        vm.editSottospecie = function editSottospecie() {

            var listaClassificatori = [];

            for (var i = 0; i < vm.datiTabellaClassificatori.length; i++) {
                listaClassificatori.push({
                    "id": vm.datiTabellaClassificatori[i].id,
                    "classificatore": vm.datiTabellaClassificatori[i].classificatore,
                    "ordinamento": i + 1
                })
            }

            $http.put("/api/sottospecieconautori",
                {
                    "id": vm.percorsoSottospecie.id,
                    "specieId": vm.percorsoSottospecie.specieId,
                    "nome": _.toLower(_.trim(vm.inputEditSottospecie)),
                    "annoClassificazione": vm.inputEditAnnoClassificazione,
                    "classificazioneOriginale": vm.classificazioneOriginale,
                    "nomeItaliano": vm.inputEditNomeItaliano,
                    "nomeInglese": vm.inputEditNomeInglese,
                    "elencoAutori": vm.stringaElencoClassificatori,
                    "statoConservazioneId": vm.statoDiConservazioneSelezionato.id,
                    "classificatori": listaClassificatori
                })
                .then(function (response) {
                    $http.get("/api/albero")
                        .then(function (response) {
                            vm.datiAlbero = response.data;
                            vm.selectedNode = {
                                "id": vm.percorsoSottospecie.id,
                                "specieId": vm.percorsoSottospecie.specieId,
                                "nome": _.toLower(_.trim(vm.inputEditSottospecie)),
                                "annoClassificazione": vm.inputEditAnnoClassificazione,
                                "classificazioneOriginale": vm.classificazioneOriginale,
                                "nomeItaliano": vm.inputEditNomeItaliano,
                                "nomeInglese": vm.inputEditNomeInglese,
                                "elencoAutori": vm.stringaElencoClassificatori,
                                "statoConservazioneId": vm.statoDiConservazioneSelezionato.id,
                                "specie": null,
                                "statoConservazione": null
                            };
                            vm.percorsoFamiglia = _.find(vm.datiAlbero, ["id", vm.percorsoFamiglia.id]);
                            vm.percorsoSottofamiglia = _.find(vm.percorsoFamiglia.figli, ["id", vm.percorsoSottofamiglia.id]);
                            vm.percorsoTribu = _.find(vm.percorsoSottofamiglia.figli, ["id", vm.percorsoTribu.id]);
                            vm.percorsoGenere = _.find(vm.percorsoTribu.figli, ["id", vm.percorsoGenere.id]);
                            vm.percorsoSpecie = _.find(vm.percorsoGenere.figli, ["id", vm.percorsoSpecie.id]);
                            vm.percorsoSottospecie = _.find(vm.percorsoSpecie.figli, ["id", vm.percorsoSottospecie.id]);;

                            vm.testo = _.toLower(_.trim(vm.inputEditSottospecie));
                            vm.inputEditSottospecie = vm.testo;

                            vm.pulsanteEditSottospecieDisabilitato = true;
                        });

                }, function () {
                    alert("Errore non gestito durante l'editazione");
                })
                .finally(function () {

                })
        };

//#endregion

        $http.get("/api/albero")
            .then(function (response) {
                vm.datiAlbero = response.data;
                $http.get("/api/staticonservazione")
                    .then(function (response) {
                        vm.elencoStatiConservazione = response.data;
                        $http.get("/api/classificatori")
                            .then(function (response) {
                                vm.elencoClassificatori = response.data;
                            });
                    });
            });
    }
})();