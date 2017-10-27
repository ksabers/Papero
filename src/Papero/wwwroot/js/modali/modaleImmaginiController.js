//modaleImmaginiController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleImmaginiController", modaleImmaginiController);

    function modaleImmaginiController($http) {

        var gallery = {};
        var galleryContext

        var vm = this;

        vm.visualizzaConfermaCancellazioneImmagine = false;  // Flag che mostra o nasconde la coppia di pulsanti di conferma

        vm.clickCancellaImmagine = function clickCancellaImmagine() {                   // Click sul pulsante di cancellazione:
            gallery.pause();                                                            // Ferma la gallery
            $("#blueimp-gallery-carousel").removeClass("blueimp-gallery-controls");     // Nasconde i controlli di movimento
            galleryContext.destroyEventListeners();                                     // Blocca tutti gli eventi (in modo che non si possa scorrere l'immagine con il mouse)
            vm.visualizzaConfermaCancellazioneImmagine = true;                          // Mostra il pulsante di conferma della cancellazione
        };

        vm.annullaCancellazioneImmagine = function annullaCancellazioneImmagine() {     // Click sul pulsante di annullamento della cancellazione:
            vm.visualizzaConfermaCancellazioneImmagine = false;                         // Nasconde la coppia di pulsanti di conferma e fa riapparire il pulsante principale
            galleryContext.initEventListeners();                                        // Riattiva gli eventi (in modo che si possa scorrere l'immagine con il mouse)
            $("#blueimp-gallery-carousel").addClass("blueimp-gallery-controls");        // Visualizza i controlli di movimento
            gallery.play();                                                             // Rimette in movimento la gallery
        }

        vm.cancellaImmagine = function cancellaImmagine() {                                     // Cancellazione effettiva dell'immagine selezionata
            var idImmagine = gallery.list[gallery.getIndex()].getAttribute("data-idImmagine");

            $http.delete("/api/immagini/" + idImmagine)     // chiamo la API di cancellazione
                .then(function (response) {
                    $("#modaleVisualizzaImmagini").modal('hide');       // chiude la modale...
                    location.reload(true);                          // ...e ricarica la pagina (per aggiornare il contatore) 
                }, function () {
                })
            .finally(function () {

            })

        };

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
                    },
                    onopened: function () {
                        galleryContext = this;  // Recuperiamo il context in modo da poter chiamare destroyEventListeners e initEventListeners quando clicchiamo i pulsanti di conferma/annulla
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