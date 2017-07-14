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

        vm.nodoSelezionato = function nodoSelezionato(nodo, livello) {  //  Funzione che viene richiamata alla selezione di un elemento dell'albero
            vm.livello = livello;
            vm.testo = nodo.nome;
            switch (livello) {
                case 1:
                    vm.inputEditFamiglia = nodo.nome;
                    vm.passeriforme = nodo.passeriforme;
                    break;
                case 2:
                    vm.inputEditSottofamiglia = nodo.nome;
                default:
            }
        };

        $http.get("/api/albero")
            .then(function (response) {
                vm.datiAlbero = response.data;
            });
    }
})();