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

        vm.opzioniTabellaElencoClassificatori = DTOptionsBuilder.newOptions()   // Opzioni di visualizzazione della angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);    // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                 // (come da specifiche delle angular datatables)
                                                                 // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

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
                if (funzioni.confrontaStringhe(vm.percorsoFamiglia.nome, vm.inputEditFamiglia)) {
                    esisteFamigliaDoppia = false
                }
                else {
                    esisteFamigliaDoppia = true;
                }
            };

            passeriformeDoppio = (vm.passeriforme == vm.percorsoFamiglia.passeriforme);

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
        }

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

//#endregion


//#region Funzioni Sottospecie

        vm.verificaEditSottospecie = function verificaEditSottospecie() {
            vm.aggiornaElencoClassificatori();
        }

        vm.aggiungiClassificatore = function aggiungiClassificatore() {
            vm.datiTabellaClassificatori.push(vm.classificatoreSelezionato);
            aggiornaDropdownClassificatori();
            vm.aggiornaElencoClassificatori();
            vm.classificatoreSelezionato = vm.datiDropdownClassificatori[0];
        }

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
            vm.aggiornaElencoClassificatori();
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
            vm.aggiornaElencoClassificatori();
        };

        vm.rimuoviClassificatore = function rimuoviClassificatore(classificatoreSelezionato) {
            vm.datiTabellaClassificatori = _.remove(vm.datiTabellaClassificatori, function (classificatore) { return classificatore.id != classificatoreSelezionato.id });
            aggiornaDropdownClassificatori();
            vm.aggiornaElencoClassificatori();
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

            vm.stringaElencoAutori = elenco;
            serializzazione = "";
            for (var i = 0; i < lunghezza; i++) {
                serializzazione += vm.datiTabellaClassificatori[i].id + ",";
            };
            serializzazione = "[" + serializzazione.substring(0, serializzazione.length - 1) + "]";

            //$("#parametroElencoAutori").val(elenco);
            //$("#tabellaElencoAutoriSerializzata").val(serializzazione);
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