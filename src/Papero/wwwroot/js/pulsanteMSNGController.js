//pulsanteMSNGController.js

// Controller per la gestione del pulsante di cambio MSNG e anche per la funzionalità
// di aggiornamento

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("pulsanteMSNGController", pulsanteMSNGController);

    function pulsanteMSNGController($http) {
        var vm = this;
        var re = new RegExp("([1-9][0-9]*)");
        vm.MSNG = $("#inputMSNG").val();
        vm.submitCambioMSNGdisabilitato = true;

        vm.MSNGdoppio = false;

        vm.controllaMSNG = function controllaMSNG() {
            return !re.test(vm.MSNG);
        };

        vm.controllaCambioMSNG = function controllaCambioMSNG() {
            vm.MSNGdoppio = false;
            vm.submitCambioMSNGdisabilitato = !re.test(vm.cambioMSNG);
        };

        vm.apriModaleCambioMSNG = function apriModaleCambioMSNG(Id, Msng) {
            vm.MSNGdoppio = false;
            vm.cambioMSNG = Msng;
        };

        vm.verificaPresenzaMSNG = function verificaPresenzaMSNG() {

            $http.get("/api/msng/" + vm.cambioMSNG)  // questa API ritorna -1 se l'MSNG non è presente
                .then(function (response) {
                    if (response.data == -1) {  // se l'MSNG non è presente si può fare la submit del form...
                        $("#formCambioMSNG").submit();
                    }
                    else {                     // ...altrimenti segnaliamo il messaggio di errore
                        vm.MSNGdoppio = true;
                        vm.submitCambioMSNGdisabilitato = true;
                    }
                });

        };
    }

})();