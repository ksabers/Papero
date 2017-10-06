//modaleImmaginiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleImmaginiController", modaleImmaginiController);

    function modaleImmaginiController($http) {

        var gallery = {};

        var vm = this;

        vm.apriModaleUploadImmagini = function apriModaleUploadImmagini() {
            $("table#img tbody.files").empty();  // Ripulisce la lista dei file usata dal JQuery File Upload
        };

        $('#modaleVisualizzaImmagini').on('shown.bs.modal', function (e) {  // Quando si apre la modale, inizializza il carousel con le immagini

            gallery = blueimp.Gallery(
                document.getElementById('links').getElementsByTagName('a'),
                {
                    container: '#blueimp-gallery-carousel',
                    carousel: true,
                    toggleControlsOnReturn: false,
                    toggleControlsOnSlideClick: false,
                    onslide: function (index, slide) {                                                     // Questo evento aggiorna la didascalia dell'immagine recuperandola come attributo
                        $("#didascaliaImmagine").text(this.list[index].getAttribute('data-didascalia'));   // e scrivendola sotto il carousel
                    }
                });

        });

        $('#fileupload')                                        // Eventi durante l'upload delle immagini:
            .bind('fileuploadsubmit', function (e, data) {      // 1) prima di ciascun upload...
                data.formData =                                 // ...mette nei dati che verranno inviati al server:
                    {
                        didascalia: data.files[0].didascalia,   // la didascalia di ciascuna immagine...
                        idEsemplare: $("#idEsemplare").val()    // e l'ID dell'esemplare
                    };
            })
            .bind('fileuploadstop', function (e) {              // 2) Alla fine dell'upload delle immagini...
                $("#modaleUploadImmagini").modal('hide');       // ...chiude la modale...
                location.reload(true);                          // ...e ricarica la pagina (per mostrare il pulsante delle immagini e aggiornare il contatore) 
            })
    }

})();