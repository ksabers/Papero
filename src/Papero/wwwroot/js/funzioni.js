(function (window, document) {
    'use strict';


    var funzioni = window.funzioni || (window.funzioni = {});


    function trasformaData(dataIngresso) {

        var dataUscita = new Date();
        var annoStringa = "";
        var meseStringa = "";
        var giornoStringa = "";


        if (dataIngresso.length != 8 && dataIngresso.length != 10) {
            return { data: null, tipo: "Data completa" };
        };

        if (dataIngresso.length == 10) {
            annoStringa = dataIngresso.substring(0, 4);
            meseStringa = dataIngresso.substring(5, 7);
            giornoStringa = dataIngresso.substring(8);
        }
        else {
            annoStringa = dataIngresso.substring(0, 4);
            meseStringa = dataIngresso.substring(4, 6);
            giornoStringa = dataIngresso.substring(6);
        };

        if (meseStringa == "00") {
            dataUscita.setYear(parseInt(annoStringa, 10));
            dataUscita.setMonth(0);
            dataUscita.setDate(1);
            return { data: dataUscita, tipo: "Ignora mese/giorno" };
        }

        if (giornoStringa == "00") {
            dataUscita.setYear(parseInt(annoStringa, 10));
            dataUscita.setMonth(parseInt(meseStringa, 10)-1);
            dataUscita.setDate(1);
            return { data: dataUscita, tipo: "Ignora giorno" };
        }

        dataUscita.setYear(parseInt(annoStringa, 10));
        dataUscita.setMonth(parseInt(meseStringa, 10)-1);
        dataUscita.setDate(parseInt(giornoStringa, 10));
        return { data: dataUscita, tipo: "Data completa" };



    }






    function pubblicaFunzioniEsterne(funzioni) {
        angular.extend(funzioni, {
            'trasformaData': trasformaData
        });
    }


    pubblicaFunzioniEsterne(funzioni);

})(window, document);