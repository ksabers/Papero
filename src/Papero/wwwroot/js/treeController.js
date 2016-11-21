//treeController.js nuova versione

(function () {
    "use strict";

    angular.module("app-tree")
	   .controller("treeController", treeController);

    function treeController($http) {

        var vm = this;


        vm.nodoSelezionato = function prova(node) {
            alert(node.id);
        }

        $http.get("/api/esemplari")
             .then(function (response) {
                 //$scope.esemplari = response.data;


                 vm.esemplari = [
                       { "id": 1, "sottospecieId": 1791, "msng": 58364 }
                 ];




             });

        $http.get("/api/famiglie")
        .then(function (response) {

            vm.treeOptions = {
                dirSelectable: true,
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

            vm.tassonomia = response.data;

        });


    }




})();