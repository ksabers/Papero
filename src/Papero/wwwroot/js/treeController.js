//treeController.js funzionante

(function () {
    "use strict";

    angular.module("app-tree")
	   .controller("treeController", treeController);

    function treeController($http) {

        var sottospecieSelezionate = [];  // Array delle foglie selezionate all'interno dell'albero
        var elencoEsemplari = [];  // Elenco completo non filtrato degli esemplari 

        var vm = this;
        vm.tassonomia = [];  // Albero tassonomico
        vm.esemplariSelezionati = [];  // Contenuto della tabella 
        vm.treeOptions = {
            allowDeselect: false,
            dirSelectable: true,
            nodeChildren: "figli",
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

        vm.nodoSelezionato = function selezionaEsemplari(nodo) {
            var elencoFigli = [];
            function trovaFigli(nodo) {

                if (!!nodo.figli) {
                    for (var figlio in nodo.figli) {
                        trovaFigli(nodo.figli[figlio]);
                    }
                }
                else {
                    elencoFigli[elencoFigli.length] = nodo.id;
                }
                return elencoFigli;
            }

            if (!!nodo.specieId) {
                elencoFigli = nodo.id;
            } else {
                elencoFigli = trovaFigli(nodo);
            };

            //alert(sottospecieSelezionate);

            sottospecieSelezionate = elencoFigli;

            vm.esemplariSelezionati = _.filter(elencoEsemplari, function (esemplare) { return esemplare.sottospecieId in sottospecieSelezionate; });

            //vm.esemplariSelezionati = [{ "id": 1, "sottospecieId": 1791, "msng": 58364 }];

        }

        $http.get("/api/esemplari")
             .then(function (response) {
                 elencoEsemplari = response.data;
             });


        $http.get("/api/famiglie")
            .then(function (response) {

                vm.tassonomia = response.data;
            });







    }




})();