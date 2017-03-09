//modaleVecchieDeterminazioniController.js 

// Controller Angular che gestisce la finestra modale di edit dei vecchi determinatori

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("modaleVecchieDeterminazioniController", modaleVecchieDeterminazioniController);

    function modaleVecchieDeterminazioniController($http, DTOptionsBuilder) {

        var elencoVecchiDeterminatori = [];
        var elencoDeterminatori = [];
        var idMassimo = 0;                  // massimo id del vecchio determinatore presente nella tabella delle vecchie determinazioni. Viene usato quando si inserisce una
                                            // riga nuova nella tabella di sinistra. NON è l'id che verrà poi usato in fase di insert nel database, perché questo è filtrato
                                            // per esemplare.

        var vm = this;

        vm.duranteInserimento = 0;  // flag che dice se abbiamo appena inserito una nuova determinazione, e quindi disabilita qualunque altra operazione tranne la sua cancellazione
                                    // (se l'abbiamo inserita per sbaglio) e l'inserimento di un determinatore associato. Vale 0 se non siamo in inserimento, oppure l'ID della determinazione
                                    // appena inserita

        vm.opzioniTabellaVecchieDeterminazioni = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione delle angular datatable
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.opzioniTabellaVecchiDeterminatori = DTOptionsBuilder.newOptions()     
            .withOption('searching', false)
            .withOption('paging', false)
            .withOption('info', false)
            .withOption('ordering', false)
            .withLanguageSource(stringaLinguaggioDatatables);

        vm.inputDataDeterminazione = "";


        function aggiornaTabellaVecchiDeterminatori(idVecchiaDeterminazione) {
            vm.datiTabellaVecchiDeterminatori = _.filter(elencoVecchiDeterminatori,   // dall'elenco generale si filtrano solo i determinatori associati alla determinazione selezionata
                                                         function (vecchioDeterminatore) {
                                                             return vecchioDeterminatore.vecchiaDeterminazioneId == idVecchiaDeterminazione
                                                         });
            aggiornaDropdownVecchiDeterminatori();   // viene aggiornata la dropdown e viene selezionato il primo nome nella lista
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
            vm.invalido = (vm.datiTabellaVecchiDeterminatori.length == 0);   // se la tabella dei determinatori è vuota viene disabilitato il pulsante di submit
        }

        vm.selezionaRiga = function selezionaRiga(riga) {  // Evento di click sulla riga della tabella delle determinazioni
            for (var i = 0; i < vm.datiTabellaVecchieDeterminazioni.length; i++) {
                if (vm.datiTabellaVecchieDeterminazioni[i].id == riga.id) {
                    $($("#tabellaVecchieDeterminazioni tbody tr")[i]).addClass("active")    // ciclo sulla tabella per attivare graficamente la riga selezionata
                }
                else {
                    $($("#tabellaVecchieDeterminazioni tbody tr")[i]).removeClass("active");
                }
            };
            vm.idVecchioDeterminatoreSelezionato = riga.id;   //  memorizzazione della riga selezionata  
            vm.vecchiaDeterminazioneSelezionata = riga.vecchiaDeterminazione;
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato);   // refresh della tabella di destra
        }

        vm.spostaSu = function spostaSuArray(indice) {  // spostamento in su di una riga della tabella di sinistra
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaVecchieDeterminazioni[indice];
            var elementoPrecedente = vm.datiTabellaVecchieDeterminazioni[indice - 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaVecchieDeterminazioni, vm.datiTabellaVecchieDeterminazioni.length - indice + 1);
            arraySecondaParte = _.drop(vm.datiTabellaVecchieDeterminazioni, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            vm.datiTabellaVecchieDeterminazioni = arrayRiordinato;
        };

        vm.spostaGiu = function spostaGiuArray(indice) {  // spostamento in giù di una riga della tabella di sinistra
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = vm.datiTabellaVecchieDeterminazioni[indice];
            var elementoSuccessivo = vm.datiTabellaVecchieDeterminazioni[indice + 1];

            arrayPrimaParte = _.dropRight(vm.datiTabellaVecchieDeterminazioni, vm.datiTabellaVecchieDeterminazioni.length - indice);
            arraySecondaParte = _.drop(vm.datiTabellaVecchieDeterminazioni, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            vm.datiTabellaVecchieDeterminazioni = arrayRiordinato;

        };

        vm.spostaSuDet = function spostaSuArray(indiceSorgente) {       // spostamento in su di una riga della tabella di destra
            var indice = _.findIndex(elencoVecchiDeterminatori,         // dall'indice della riga selezionata nella tabella (indiceSorgente) si risale all'indice della stessa riga
                                    function (vecchioDeterminatore) {   // nell'elenco non filtrato, perché lo spostamento va fatto lì (altrimenti non verrebbe mantenuto spostandosi di riga)
                                        return (vecchioDeterminatore.vecchiaDeterminazioneId == vm.datiTabellaVecchiDeterminatori[indiceSorgente].vecchiaDeterminazioneId)
                                               &&
                                               (vecchioDeterminatore.determinatoreId == vm.datiTabellaVecchiDeterminatori[indiceSorgente].determinatoreId)
                                    })
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = elencoVecchiDeterminatori[indice];
            var elementoPrecedente = elencoVecchiDeterminatori[indice - 1];

            arrayPrimaParte = _.dropRight(elencoVecchiDeterminatori, elencoVecchiDeterminatori.length - indice + 1);
            arraySecondaParte = _.drop(elencoVecchiDeterminatori, indice + 1);
            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoDaSpostare, elementoPrecedente, arraySecondaParte);

            elencoVecchiDeterminatori = arrayRiordinato;
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato);  // refresh della tabella, che a questo punto avrà la riga spostata perché l'abbiamo spostata nell'elenco non filtrato
        };

        vm.spostaGiuDet = function spostaGiuArray(indiceSorgente) {     // spostamento in giù di una riga della tabella di destra
            var indice = _.findIndex(elencoVecchiDeterminatori,         // dall'indice della riga selezionata nella tabella (indiceSorgente) si risale all'indice della stessa riga
                                     function (vecchioDeterminatore) {  // nell'elenco non filtrato, perché lo spostamento va fatto lì (altrimenti non verrebbe mantenuto spostandosi di riga)
                                         return (vecchioDeterminatore.vecchiaDeterminazioneId == vm.datiTabellaVecchiDeterminatori[indiceSorgente].vecchiaDeterminazioneId)
                                                 &&
                                                (vecchioDeterminatore.determinatoreId == vm.datiTabellaVecchiDeterminatori[indiceSorgente].determinatoreId)
                                     })
            var arrayRiordinato = [];
            var arrayPrimaParte = [];
            var arraySecondaParte = [];
            var elementoDaSpostare = elencoVecchiDeterminatori[indice];
            var elementoSuccessivo = elencoVecchiDeterminatori[indice + 1];

            arrayPrimaParte = _.dropRight(elencoVecchiDeterminatori, elencoVecchiDeterminatori.length - indice);
            arraySecondaParte = _.drop(elencoVecchiDeterminatori, indice + 2);

            arrayRiordinato = arrayRiordinato.concat(arrayPrimaParte, elementoSuccessivo, elementoDaSpostare, arraySecondaParte);

            elencoVecchiDeterminatori = arrayRiordinato;
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato);  // refresh della tabella, che a questo punto avrà la riga spostata perché l'abbiamo spostata nell'elenco non filtrato
        };

        function aggiornaDropdownVecchiDeterminatori() {
            var arrayVecchiDeterminatori = [];   // Array di servizio che serve per tenere l'elenco degli id dei determinatori selezionati nella tabella. Viene usato per filtrare la dropdown
                                                 // togliendo i determinatori già presenti nella tabella.

            for (var i = 0; i < vm.datiTabellaVecchiDeterminatori.length; i++)                        // Riempimento dell'array di servizio
                arrayVecchiDeterminatori.push(vm.datiTabellaVecchiDeterminatori[i].determinatoreId);

            vm.dropdownVecchiDeterminatori = _.filter(elencoDeterminatori, function (determinatore) { return !arrayVecchiDeterminatori.includes(determinatore.id) });
        };

        vm.aggiungiVecchiaDeterminazione = function aggiungiVecchiaDeterminazione() {  // aggiunge una riga nella tabella di sinistra
            var trovato = false;
            var rigaDaInserire = {};

            for (var i = 0; i < vm.datiTabellaVecchieDeterminazioni.length; i++) {  // controlliamo che dati ci sono già nella tabella...
                if (_.trim(vm.inputVecchiaDeterminazione) == "") {// ...se stiamo cercando di inserire spazi o stringa vuota, ignora l'inserimento
                    vm.inputVecchiaDeterminazione = "";
                    return;
                }  // ...se stiamo cercando di inserire un doppione (anche con maiuscole/minuscole diverse o spazi prima/dopo/in mezzo), ignora l'inserimento
                if (_.lowerCase(_.trim(vm.datiTabellaVecchieDeterminazioni[i].vecchiaDeterminazione)) == _.lowerCase(_.trim(vm.inputVecchiaDeterminazione))) {
                    trovato = true;
                    break;
                }               
            };
            if (!trovato) {  // se l'inserimento è valido, viene eseguito
                idMassimo = idMassimo + 1;
                rigaDaInserire = {                                          // la riga da inserire sarà formata:
                    id: idMassimo,                                          //    1) da un nuovo id sicuramente non presente
                    dataDeterminazione: vm.inputDataDeterminazione,         //    2) dall'eventuale data (può non esserci)
                    vecchiaDeterminazione: vm.inputVecchiaDeterminazione    //    3) dal testo della input
                };
                vm.datiTabellaVecchieDeterminazioni.push(rigaDaInserire); // si inserisce la riga nuova e si aggiorna tutto
                aggiornaDropdownVecchiDeterminatori();
                vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
                vm.inputVecchiaDeterminazione = "";
                vm.inputDataDeterminazione = "";
                vm.duranteInserimento = idMassimo;   // flag che dice che siamo in modalità di inserimento di un nuovo determinatore (perché non è zero): questo automaticamente
                vm.selezionaRiga(rigaDaInserire);    // disabilita tutti i pulsanti sulla tabella tranne quello di cancellazione della riga (se fosse stata inserita per sbaglio)
            }
        };

        vm.aggiungiVecchioDeterminatore = function aggiungiVecchioDeterminatore() {  // aggiunge una riga nella tabella di destra prendendo i dati dalla dropdown dei determinatori
            var vecchioDeterminatoreDaInserire = { vecchiaDeterminazioneId: vm.idVecchioDeterminatoreSelezionato,
                                                   determinatoreId: vm.vecchioDeterminatoreSelezionato.id,
                                                   determinatore: { nome: vm.vecchioDeterminatoreSelezionato.nome,
                                                                    cognome: vm.vecchioDeterminatoreSelezionato.cognome
                                                                  }
                                                 };
            elencoVecchiDeterminatori.push(vecchioDeterminatoreDaInserire);           // inseriamo la riga nell'elenco non filtrato, NON direttamente nella tabella...
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato); // ...e poi aggiorniamo la tabella (così l'inserimento è permanente anche se cambiamo riga)
            aggiornaDropdownVecchiDeterminatori();                                    // infine aggiorniamo la dropdown rimuovendo il determinatore che abbiamo appena inserito in tabella
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
            vm.duranteInserimento = 0;  // a questo punto la tabella ha almeno un determinatore quindi possiamo riabilitare i pulsanti
        };

        vm.rimuoviVecchiaDeterminazione = function rimuoviVecchiaDeterminazione(indiceVecchiaDeterminazioneSelezionata) {  // toglie una riga dalla tabella di sinistra
            elencoVecchiDeterminatori = _.remove(elencoVecchiDeterminatori,  // toglie dall'elenco non filtrato tutti i determinatori corrispondenti alla riga che stiamo cancellando
                                                 function (determinazione) { //  (perché cancellando una riga a sx bisogna cancellare anche tutte le corrispondenti righe a dx)
                                                     return determinazione.vecchiaDeterminazioneId != vm.vecchiaDeterminazioneSelezionata
                                                 });
            vm.datiTabellaVecchieDeterminazioni = vm.datiTabellaVecchieDeterminazioni  // cancella effettivamente la riga di sx...
                                                    .slice(0, indiceVecchiaDeterminazioneSelezionata)
                                                        .concat(vm.datiTabellaVecchieDeterminazioni
                                                           .slice(indiceVecchiaDeterminazioneSelezionata + 1));
            aggiornaDropdownVecchiDeterminatori();                                     // ... e fa il refresh della tabella di dx
            vm.selezionaRiga(vm.datiTabellaVecchieDeterminazioni[0]);
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
            vm.duranteInserimento = 0;
        };

        vm.rimuoviVecchioDeterminatore = function rimuoviVecchioDeterminatore(indiceVecchioDeterminatoreSelezionato) {  // toglie una riga dalla tabella di destra
            var indice = _.findIndex(elencoVecchiDeterminatori,         // dall'indice della riga della tabella si risale all'indice della riga nell'elenco non filtrato
                                     function (vecchioDeterminatore) {  // (perché la cancellazione va fatta lì altrimenti non verrebbe mantenuta spostandosi di riga)
                                         return (vecchioDeterminatore.vecchiaDeterminazioneId == vm.datiTabellaVecchiDeterminatori[indiceVecchioDeterminatoreSelezionato].vecchiaDeterminazioneId) && (vecchioDeterminatore.determinatoreId == vm.datiTabellaVecchiDeterminatori[indiceVecchioDeterminatoreSelezionato].determinatoreId)
                                     });
            elencoVecchiDeterminatori = elencoVecchiDeterminatori   // cancella la riga nell'elenco non filtrato...
                                           .slice(0, indice)
                                              .concat(elencoVecchiDeterminatori
                                                 .slice(indice + 1));
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato);  // ...e poi fa il refresh della tabella
            vm.selezionaRiga(vm.datiTabellaVecchieDeterminazioni[0]);
            aggiornaDropdownVecchiDeterminatori();
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
        };

        vm.apriModaleVecchieDeterminazioni = function apriModaleVecchieDeterminazioni() {   // all'apertura della modale impostiamo la dropdown e facciamo il refresh della tabella di dx
            vm.idVecchioDeterminatoreSelezionato = vm.datiTabellaVecchieDeterminazioni[0].id;
            aggiornaTabellaVecchiDeterminatori(vm.idVecchioDeterminatoreSelezionato);
            vm.selezionaRiga(vm.datiTabellaVecchieDeterminazioni[0]);
            aggiornaDropdownVecchiDeterminatori();
            vm.vecchioDeterminatoreSelezionato = vm.dropdownVecchiDeterminatori[0];
        };

        vm.serializzaTabelle = function serializzaTabelle() {  //  Trasforma le tabelle in stringhe JSON che vengono poi inviate con il submit al controller UpdateDettaglioEsemplare sul server
            $("#serializzazioneHiddenVecchieDeterminazioni").val(JSON.stringify(vm.datiTabellaVecchieDeterminazioni));
            $("#serializzazioneHiddenVecchiDeterminatori").val(JSON.stringify(elencoVecchiDeterminatori));
        };

        $http.get("/api/vecchiedeterminazioni/" + inputIdEsemplare.value)
            .then(function (response) {
                vm.datiTabellaVecchieDeterminazioni = response.data;                                             // popolamento della tabella di sx
                if (vm.datiTabellaVecchieDeterminazioni.length > 0) {                                            // calcolo del massimo id presente in tabella, in modo da poterne aggiungere di nuovi
                    idMassimo = _.maxBy(vm.datiTabellaVecchieDeterminazioni, function (o) { return o.id }).id;   // quando cliccheremo sul "+" di sinistra
                }
                else {
                    idMassimo = 0;  //  Ovviamente dobbiamo prevedere il caso in cui la tabella sia vuota
                }
                
            });                                                                                             
        $http.get("/api/vecchideterminatori")
            .then(function (response) {
                elencoVecchiDeterminatori = response.data;  // usato per popolare la tabella di dx, dopo averlo filtrato per id di determinazione in base alla riga selezionata a sx
            });

        $http.get("/api/determinatori")
            .then(function (response) {
                elencoDeterminatori = response.data;  // usato per popolare la dropdown
            });
    }
})();