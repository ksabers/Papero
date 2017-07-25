(function (window, document) {
    'use strict';

    var funzioni = window.funzioni || (window.funzioni = {});

    /**
     * Prende una data in formato interno e la restituisce in formato datetime assieme ad una stringa che dice se è parziale o no
     * @param {stringa} dataIngresso
     * @returns { data: dataUscita (date), tipo: "Data completa"/"Ignora mese/giorno"/"Ignora giorno" (stringa) } 
     */
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
            dataUscita.setMonth(parseInt(meseStringa, 10) - 1);
            dataUscita.setDate(1);
            return { data: dataUscita, tipo: "Ignora giorno" };
        }

        dataUscita.setYear(parseInt(annoStringa, 10));
        dataUscita.setMonth(parseInt(meseStringa, 10) - 1);
        dataUscita.setDate(parseInt(giornoStringa, 10));
        return { data: dataUscita, tipo: "Data completa" };
    };

    /**
     * Restituisce una data in formato interno
     * @param {Datetime} data
     * @param {stringa} tipo
     */
    function dataInterna(data, tipo) {

        var data_interna = "";

        if (data == null) {
            return "";
        };
        switch (tipo) {
            case "Data completa":
                data_interna = data.toISOString().substring(0, 10).replace(/-/g, "");
                break;
            case "Ignora mese/giorno":
                data_interna = data.getFullYear().toString() + "0000";
                break;
            case "Ignora giorno":
                data_interna = data.toISOString().substring(0, 7).replace(/-/g, "") + "00";
                break;
        };
        return data_interna;
    };

    /**
     * Confronta due stringhe ignorando maiuscole, minuscole e spazi prima/dopo/in mezzo.
     * @param {stringa} stringaOriginale
     * @param {stringa} stringaDaConfrontare
     */
    function confrontaStringhe(stringaOriginale, stringaDaConfrontare) {

        return (_.toLower(_.trim(stringaOriginale)) == _.toLower(_.trim(stringaDaConfrontare)))
    };

    function pubblicaFunzioniEsterne(funzioni) {
        angular.extend(funzioni, {
            'trasformaData': trasformaData,
            'dataInterna': dataInterna,
            'confrontaStringhe': confrontaStringhe
        });
    }

    pubblicaFunzioniEsterne(funzioni);

})(window, document);