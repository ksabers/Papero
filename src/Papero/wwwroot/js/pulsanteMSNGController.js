//pulsanteMSNGController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("pulsanteMSNGController", pulsanteMSNGController);

    function pulsanteMSNGController() {
        var vm = this;
        var re = new RegExp("([1-9][0-9]*)");
        vm.MSNG = $("#inputMSNG").val();

        vm.controllaMSNG = function controllaMSNG() {
            return !re.test(vm.MSNG);
        }
    }

})();