//profiloController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("profiloController", profiloController);

    function profiloController() {
        var vm = this;

        vm.inputInsertNome = $("#inputInsertNome").val();
        vm.inputInsertCognome = $("#inputInsertCognome").val();
        vm.inputInsertEmail = $("#inputInsertEmail").val();
        vm.inputInsertTelefono = $("#inputInsertTelefono").val();

        vm.verificaInsertPassword = function verificaInsertPassword() {

            if (_.trim(vm.inputInsertPassword) != _.trim(vm.inputConfermaPassword)) {
                vm.pulsanteInsertDisabilitato = true;
            }
            else {
                vm.pulsanteInsertDisabilitato = false;
            };

        };

    }

})();