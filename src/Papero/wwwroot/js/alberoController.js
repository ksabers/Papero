//alberoController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("alberoController", alberoController);

    function alberoController($http, DTOptionsBuilder) {

        var elencoEsemplari = [];                 // Elenco completo non filtrato degli esemplari 
        var elencoFiltratoEsemplari = [];         // Elenco filtrato degli esemplari 

        var alberoTassonomia = [];                // Array delle entità contenute nell'albero
        var re = new RegExp("([1-9][0-9]*)");

        var elencoRegioni = [];   //  Array che contengono le entità complete non filtrate
        var elencoProvince = [];
        var elencoCitta = [];
        var elencoLocalita = [];
        var elencoArmadi = [];

        var esemplariFiltratiSuGeografia = [];     // elenchi di esemplari restituiti dai singoli filtri
        var esemplariFiltratiSuRaccoglitori = [];
        var esemplariFiltratiSuCollocazione = []

        var vm = this;

        vm.filtroSuAlberoAttivo = true;             //  booleani che indicano se un certo filtro è attivo o no. Per default è attivo solo quello sull'albero
        vm.filtroSuGeografiaAttivo = false;
        vm.filtroSuRaccoglitoriAttivo = false;
        vm.filtrosuCollocazioneAttivo = false;

        vm.regioni = [];  // Contenuto della dropdown Regioni

        vm.datiAlbero = [];            // Albero tassonomico
        vm.datiElencoSpecie = [];      // Elenco delle specie che compare nella dropdown di selezione diretta
        vm.esemplariSelezionati = [];  // Contenuto della tabella
        vm.numeroSpecie = 0;           // Badge che contiene il numero di sottospecie attualmente selezionate nell'albero
        vm.nodiSelezionati = [];       // Collection che contiene i nodi attualmente selezionati nell'albero (che permette la multiselezione)
        vm.foglia = false;             // Indica se è selezionata una ed una sola foglia dell'albero (cioè una singola sottospecie). Usato per visualizzare il box di inserimento
        vm.MSNGpresente = false;       // Flag che indica se visualizzare o no l'alert di MSNG già presente

        vm.sottospecieSelezionate = [];  // Elenco degli ID delle sottospecie selezionate nell'albero

        vm.selezionaSpecie = function selezionaSpecie() {  // Funzione chiamata alla selezione di una specie nella dropdown di selezione diretta
            vm.esemplariSelezionati = _.filter(elencoEsemplari, function (esemplare) { return esemplare.sottospecieId == vm.specieSelezionata.id });
            vm.numeroSpecie = 1;
            vm.foglia = true;
            vm.sottospecie = vm.specieSelezionata.id;
        }

        vm.controllaMSNG = function controllaMSNG() {  // Funzione chiamata ad ogni pressione di tasto nella casella MSNG. Controlla la correttezza
            vm.MSNGpresente = false;                   // tramite regular expression e abilita/disabilita il pulsante di submit
            return !re.test(vm.inputMSNG);
        }

        vm.verificaMSNG = function verificaMSNG(eventoSubmit) {  // Funzione chiamata al momento del submit del form di inserimento nuovo MSNG
                                                                 // Verifica se esiste già l'MSNG inserito: se sì, intercetta l'evento di submit e lo blocca
            if (_.find(elencoEsemplari, function (esemplare) { return esemplare.msng == _.trim(vm.inputMSNG); })) {
                vm.MSNGpresente = true;
                eventoSubmit.preventDefault();
                return false;
            }
        }

        vm.opzioniTabella = DTOptionsBuilder.newOptions()      // Opzioni di visualizzazione della angular datatable
            .withOption("lengthMenu", [10, 25])
            .withLanguageSource(stringaLinguaggioDatatables);  // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                               // (come da specifiche delle angular datatables)
                                                               // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)
            
        vm.opzioniAlbero = {          // Opzioni di visualizzazione dell'angular treeview
            multiSelection: true,
            dirSelectable: true,
            nodeChildren: "figli",    // nome dell'elemento ricorsivo che comprende i figli di ciascun elemento dell'albero all'interno del JSON
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

        function elencaFigli(nodo) {        //   Riempie un array che contiene tutti gli ID delle "foglie" sotto l'elemento selezionato
            var elencoFigli = [];
            function trovaFigli(nodo) {     // funzioncina ricorsiva che traversa l'albero e trova le foglie
                if (!!nodo.figli) {         //  Il doppio ! è un trucco veloce per stabilire se l'elemento "nodo" è una foglia: !!nodo.figli è false se "figli" è undefined
                    for (var figlio in nodo.figli) {
                        trovaFigli(nodo.figli[figlio]);
                    }
                }
                else {
                    elencoFigli[elencoFigli.length] = nodo.id;
                }
                return elencoFigli;
            }
            if (!!nodo.specieId) {                    // Gestione del caso speciale in cui venga selezionata direttamente una foglia:
                elencoFigli = $(nodo.id).toArray();   // deve essere restituita solo lei, ma in forma di array (altrimenti "elencoFigli.includes" qui sotto non funzionerebbe)

            } else {
                elencoFigli = trovaFigli(nodo);       // altrimenti si traversa l'albero ricorsivamente
            }
            return elencoFigli;
        }

        vm.nodoSelezionato = function selezionaEsemplari(nodo, selezionato) {  //  Funzione che viene richiamata alla selezione di un elemento dell'albero

            vm.sottospecieSelezionate = [];  // Azzera l'array globale delle foglie selezionate

            for (var i = 0; i < vm.nodiSelezionati.length; i++)  // Ogni volta che si seleziona/deseleziona un nodo, scorre l'elenco di quelli ancora selezionati, per ciascuno estrae
                                                                 // l'array delle foglie e lo aggiunge ai precedenti (senza duplicati, usando la _.union) in modo da avere l'elenco di 
                                                                 // tutte le sottospecie selezionate
            {
                vm.sottospecieSelezionate = _.union(vm.sottospecieSelezionate, elencaFigli(vm.nodiSelezionati[i]));
            }

            vm.specieSelezionata = [];  //  Ripulisce la dropdown di selezione diretta, nel caso contenesse un valore da una selezione precedente

            if (vm.sottospecieSelezionate.length == 1) {  // Verifica se mostrare la casella per l'inserimento di un nuovo esemplare: solo se è selezionata una singola sottospecie...
                vm.foglia = true;                         //  ...rende visibile la casella (con ng-show)
                vm.sottospecie = nodo.id;                 //  ...e mette nel campo hidden del form l'id della sottospecie da creare
            }
            else {                                        // ...altrimenti nasconde la casella
                vm.foglia = false;
            }

            vm.numeroSpecie = vm.sottospecieSelezionate.length;  // Le foglie selezionate vengono contate per mostrarle in cima all'albero

            vm.applicaFiltri();
        };

        function resetDropDownSeNecessario() {         // inizializza le dropdown se non hanno un valore impostato
            if (vm.nazioneSelezionata == undefined)
                vm.resetNazione();
            if (vm.raccoglitoreSelezionato == undefined)
                vm.resetRaccoglitore();
            if (vm.salaSelezionata == undefined)
                vm.resetSala();
        }

        vm.applicaFiltri = function applicaFiltri() {

            if (vm.filtroSuAlberoAttivo) {                   // se è selezionato il filtro sull'albero filtra le sottospecie presenti nell'albero stesso...
                elencoFiltratoEsemplari = _.filter(elencoEsemplari, function (esemplare) { return vm.sottospecieSelezionate.includes(esemplare.sottospecieId); });
            }
            else {                                           // ...altrimenti prendi l'intero elenco esemplari
                elencoFiltratoEsemplari = elencoEsemplari;
            }

            if (vm.filtroSuGeografiaAttivo) {
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuGeografia, "id")
            }

            if (vm.filtroSuGeografiaAttivo) {
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuGeografia, "id")
            }

            // se è impostato un filtro per raccoglitori:
            //  1) recupera la lista degli esemplari in base al filtro
            //  2) filtra
            //  3) scrivi il filtro nel testo

            if (elencoFiltratoEsemplari.length < 2000) {
                //alert("impostazione tabella: " + elencoFiltratoEsemplari.length);
                vm.esemplariSelezionati = elencoFiltratoEsemplari;
            };
            // conta le righe risultanti
            //  se sono poche:
            //  1) scrivi il filtro nel testo 
            //  2) applica alla tabella
            //  se sono tante:
            //  1) chiudi la modale del filtro se è aperta
            //  2) apri la modale di conferma
            //  3) se è confermato:
            //     a) scrivi il filtro nel testo
            //     b) applica alla tabella
            //     altrimenti:
            //     a) chiudi la modale di conferma
        }

        vm.aprimodaleFiltriElencoEsemplari = function aprimodaleFiltriElencoEsemplari() {
            resetDropDownSeNecessario();
        };

//#region Impostazione Filtri
        vm.impostaFiltriRaccoglitori = function impostaFiltriRaccoglitori() {

            resetDropDownSeNecessario();

            if (vm.raccoglitoreSelezionato.raccoglitore != "-") {
                $http.get("/api/elencoesemplaridaraccoglitori/" + vm.raccoglitoreSelezionato.id)
                    .then(function (response) {
                        esemplariFiltratiSuRaccoglitori = response.data;
                        vm.filtroSuRaccoglitoriAttivo = true;
                    });
            }
            else {
                vm.filtroSuRaccoglitoriAttivo = false;
            }
        };

        vm.impostaFiltriCollocazione = function impostaFiltriCollocazione() {

            var apiCollocazioneDaChiamare = "";

            resetDropDownSeNecessario();

            if (vm.salaSelezionata.sala != "-") {
                if (vm.armadioSelezionato.armadio != "-") {
                    apiCollocazioneDaChiamare = "/api/elencoesemplaridaarmadio/" + vm.armadioSelezionato.id;
                }
                else {
                    apiCollocazioneDaChiamare = "/api/elencoesemplaridasala/" + vm.salaSelezionata.id;
                };
                $http.get(apiCollocazioneDaChiamare)
                    .then(function (response) {
                        esemplariFiltratiSuCollocazione = response.data;
                        vm.filtroSuCollocazioneAttivo = true;
                    });
            }
            else {
                vm.filtroSuCollocazioneAttivo = false;
            }
        };

        vm.impostaFiltriGeografia = function impostaFiltriGeografia() {

            var apiGeograficaDaChiamare = "";

            resetDropDownSeNecessario();

            if (vm.nazioneSelezionata.nazione != "-") {                         // se è impostato un filtro geografico, cioè se almeno la nazione è diversa da "-"
                if (vm.regioneSelezionata.regione != "-") {                     // se è impostata anche la regione
                    if (vm.provinciaSelezionata.provincia != "-") {             // se è impostata anche la provincia
                        if (vm.cittaSelezionata.nomeCitta != "-") {             // se è impostata anche la città
                            if (vm.localitaSelezionata.nomeLocalita != "-") {   // se è impostata anche la località
                                apiGeograficaDaChiamare = "/api/elencoesemplaridalocalita/" + vm.localitaSelezionata.id;
                            }
                            else {  // se sono impostate nazione, regione, provincia e città ma non la località
                                apiGeograficaDaChiamare = "/api/elencoesemplaridacitta/" + vm.cittaSelezionata.id;
                            }
                        }
                        else {  // se sono impostate nazione, regione e provincia ma nient'altro
                            apiGeograficaDaChiamare = "/api/elencoesemplaridaprovincia/" + vm.provinciaSelezionata.id;
                        }
                    }
                    else {  // se sono impostate nazione e regione ma nient'altro
                        apiGeograficaDaChiamare = "/api/elencoesemplaridaregione/" + vm.regioneSelezionata.id;
                    }
                }
                else {           // se è impostata solo la nazione ma nient'altro
                    apiGeograficaDaChiamare = "/api/elencoesemplaridanazione/" + vm.nazioneSelezionata.id;
                };
                $http.get(apiGeograficaDaChiamare)
                    .then(function (response) {
                        esemplariFiltratiSuGeografia = response.data;
                        vm.filtroSuGeografiaAttivo = true;
                    });
            }
            else {
                vm.filtroSuGeografiaAttivo = false;
                //esemplariFiltratiSuGeografia = elencoEsemplari;
            }
        };
//#endregion

//#region SelezioniDropdown
        vm.selezionaLocalita = function selezionaLocalita() {
            //$("#hiddenOutputIdLocalitaSelezionata").val(vm.localitaSelezionata.id);
        };

        vm.selezionaRaccoglitore = function selezionaRaccoglitore() {
            //$("#hiddenOutputIdLocalitaSelezionata").val(vm.localitaSelezionata.id);
        };

        vm.selezionaCitta = function selezionaCitta() {
            vm.localita = _.filter(elencoLocalita, function (localita) { return localita.cittaId == vm.cittaSelezionata.id });
            vm.localitaSelezionata = _.find(vm.localita, function (localita) { return localita.nomeLocalita == "-" });
            vm.selezionaLocalita();
        };

        vm.selezionaProvincia = function selezionaProvincia() {
            vm.citta = _.filter(elencoCitta, function (citta) { return citta.provinciaId == vm.provinciaSelezionata.id });
            vm.cittaSelezionata = _.find(vm.citta, function (citta) { return citta.nomeCitta == "-" });
            vm.selezionaCitta();
        };

        vm.selezionaRegione = function selezionaRegione() {
            vm.province = _.filter(elencoProvince, function (provincia) { return provincia.regioneId == vm.regioneSelezionata.id });
            vm.provinciaSelezionata = _.find(vm.province, function (provincia) { return provincia.provincia == "-" });
            vm.selezionaProvincia();
        };

        vm.selezionaNazione = function selezionaNazione() {
            vm.regioni = _.filter(elencoRegioni, function (regione) { return regione.nazioneId == vm.nazioneSelezionata.id });
            vm.regioneSelezionata = _.find(vm.regioni, function (regione) { return regione.regione == "-" });
            vm.selezionaRegione();
        };

        vm.selezionaSala = function selezionaSala() {
            vm.armadi = _.filter(elencoArmadi, function (armadio) { return armadio.salaId == vm.salaSelezionata.id });
            vm.armadioSelezionato = _.find(vm.armadi, function (armadio) { return armadio.armadio == "-" });
            vm.selezionaArmadio();
        };

        vm.selezionaArmadio = function selezionaArmadio() {

        };
//#endregion

//#region Reset
        vm.resetSala = function resetSala() {
            vm.salaSelezionata = _.find(vm.sale, function (sala) { return sala.sala == "-" });
            vm.selezionaSala();
        };

        vm.resetArmadio = function resetArmadio() {
            vm.armadioSelezionato = _.find(vm.armadi, function (armadio) { return armadio.armadio == "-" });
            vm.selezionaArmadio();
        };

        vm.resetNazione = function resetNazione() {
            vm.nazioneSelezionata = _.find(vm.nazioni, function (nazione) { return nazione.nazione == "-" });
            vm.selezionaNazione();
        };

        vm.resetRegione = function resetRegione() {
            vm.regioneSelezionata = _.find(vm.regioni, function (regione) { return regione.regione == "-" });
            vm.selezionaRegione();
        };

        vm.resetProvincia = function resetProvincia() {
            vm.provinciaSelezionata = _.find(vm.province, function (provincia) { return provincia.provincia == "-" });
            vm.selezionaProvincia();
        };

        vm.resetCitta = function resetCitta() {
            vm.cittaSelezionata = _.find(vm.citta, function (citta) { return citta.nomeCitta == "-" });
            vm.selezionaCitta();
        };

        vm.resetLocalita = function resetLocalita() {
            vm.localitaSelezionata = _.find(vm.localita, function (localita) { return localita.nomeLocalita == "-" });
            vm.selezionaLocalita();
        };

        vm.resetRaccoglitore = function resetRaccoglitore() {
            vm.raccoglitoreSelezionato = _.find(vm.raccoglitori, function (raccoglitore) { return raccoglitore.raccoglitore == "-" });
            vm.selezionaRaccoglitore();
        };
//#endregion

//#region Chiamate $http
        $http.get("/api/esemplari")
             .then(function (response) {
                 elencoEsemplari = response.data;
             });

        $http.get("/api/albero")
            .then(function (response) {
                vm.datiAlbero = response.data;
            });

        $http.get("/api/elencospecie")
            .then(function (response) {
                vm.datiElencoSpecie = response.data;
            });

        $http.get("/api/nazioni")
           .then(function (response) {
               vm.nazioni = response.data;
        });

        $http.get("/api/regioni")
            .then(function (response) {
                elencoRegioni = response.data;
            });

        $http.get("/api/province")
            .then(function (response) {
                elencoProvince = response.data;
            });

        $http.get("/api/citta")
            .then(function (response) {
                elencoCitta = response.data;
            });

        $http.get("/api/localita")
            .then(function (response) {
                elencoLocalita = response.data;
                //vm.resetNazione();
            });

        $http.get("/api/raccoglitori")
            .then(function (response) {
                vm.raccoglitori = response.data;
            });

        $http.get("/api/sale")
            .then(function (response) {
                vm.sale = response.data;
            });

        $http.get("/api/armadi")
            .then(function (response) {
                elencoArmadi = response.data;
            });
//#endregion
    }
})();