﻿//alberoController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("alberoController", alberoController);

    function alberoController($http, DTOptionsBuilder) {


        var elencoEsemplari = [];         // Elenco completo non filtrato degli esemplari 
        var alberoTassonomia = [];
        var re = new RegExp("([1-9][0-9]*)");

        var vm = this;

        vm.datiAlbero = [];            // Albero tassonomico
        vm.datiElencoSpecie = [];
        vm.esemplariSelezionati = [];  // Contenuto della tabella
        vm.numeroSpecie = 0;           // Badge che contiene il numero di sottospecie attualmente selezionate nell'albero
        vm.expandedNodes = [];
        vm.foglia = false;
        vm.MSNGpresente = false;

        vm.selezionaSpecie = function selezionaSpecie() {
            //alert(vm.specieSelezionata.id);
            //vm.filtroAlbero = { specieId: vm.specieSelezionata.id };


            //vm.filtroAlbero = {
            //    "figli": [
            //      {
            //          "figli": [
            //            {
            //                "figli": [
            //                  {
            //                      "figli": [
            //                        {
            //                            "figli": [
            //                              {
            //                                  "id": vm.specieSelezionata.id
            //                              }
            //                            ]
            //                        }

            //                      ]
            //                  }
            //                ]
            //            }
            //          ]
            //      }

            //    ]
            //};

            //vm.filtroAlbero = { "specieId": vm.specieSelezionata.specieId };


            vm.esemplariSelezionati = _.filter(elencoEsemplari, function (esemplare) { return esemplare.sottospecieId == vm.specieSelezionata.id });
            vm.numeroSpecie = 1;
            vm.foglia = true;
            vm.sottospecie = vm.specieSelezionata.id;


        }

        vm.controllaMSNG = function controllaMSNG() {
            vm.MSNGpresente = false;
            return !re.test(vm.inputMSNG);
        }

        vm.verificaMSNG = function verificaMSNG(eventoSubmit) {
            //alert(vm.specieSelezionata.id);
            
            if (_.find(elencoEsemplari, function (esemplare) { return esemplare.msng == _.trim(vm.inputMSNG); })) {
                vm.MSNGpresente = true;
                eventoSubmit.preventDefault();
                return false;
            }
        }


        vm.opzioniTabella = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption("lengthMenu", [10, 25])
            .withLanguageSource(stringaLinguaggioDatatables);  // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                               // (come da specifiche delle angular datatables)
                                                               // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
            
        vm.opzioniAlbero = {          // Opzioni di visualizzazione dell'angular treeview
            allowDeselect: false,
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

        vm.nodoSelezionato = function selezionaEsemplari(nodo) {  //  Funzione che viene richiamata alla selezione di un elemento dell'albero
            var elencoFigli = [];                                 //  Lo scopo è riempire un array che contiene tutti gli ID delle "foglie" sotto l'elemento selezionato
            function trovaFigli(nodo) {            // funzioncina ricorsiva che traversa l'albero e trova le foglie
                if (!!nodo.figli) {                //  Il doppio ! è un trucco veloce per stabilire se l'elemento "nodo" è una foglia: !!nodo.figli è false se "figli" è undefined
                    for (var figlio in nodo.figli) {
                        trovaFigli(nodo.figli[figlio]);
                    }
                }
                else {
                    elencoFigli[elencoFigli.length] = nodo.id;
                }
                return elencoFigli;
            }

            vm.specieSelezionata = [];

            if (!!nodo.specieId) {                    // Gestione del caso speciale in cui venga selezionata direttamente una foglia:
                elencoFigli = $(nodo.id).toArray();   // deve essere restituita solo lei, ma in forma di array (altrimenti "elencoFigli.includes" qui sotto non funzionerebbe)
                vm.foglia = true;
                vm.sottospecie = nodo.id;
            } else {
                elencoFigli = trovaFigli(nodo);       // altrimenti si traversa l'albero ricorsivamente
                vm.foglia = false;
            }

            vm.numeroSpecie = elencoFigli.length;  // Le foglie selezionate vengono contate per mostrarle in cima all'albero

            // La tabella esemplari viene riempita con gli esemplari i cui sottospecieID compaiono nell'elenco selezionato nell'albero. 
            vm.esemplariSelezionati = _.filter(elencoEsemplari, function (esemplare) { return elencoFigli.includes(esemplare.sottospecieId); });
        };

        $http.get("/api/esemplari")
             .then(function (response) {
                 elencoEsemplari = response.data;
             });

        $http.get("/api/albero")
            .then(function (response) {
                alberoTassonomia = response.data;
                vm.datiAlbero = alberoTassonomia;
            });

        $http.get("/api/elencospecie")
            .then(function (response) {
                vm.datiElencoSpecie = response.data;
    });


    }

})();