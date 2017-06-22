//alberoController.js 

(function () {
    "use strict";

    angular.module("papero-app")
        .controller("alberoController", alberoController);

    function alberoController($http, DTOptionsBuilder, DTColumnDefBuilder) {

        var elencoEsemplari = [];                 // Elenco completo non filtrato degli esemplari 
        var elencoFiltratoEsemplari = [];         // Elenco filtrato degli esemplari 

        var alberoTassonomia = [];                // Array delle entità contenute nell'albero
        var re = new RegExp("([1-9][0-9]*)");

        var elencoRegioni = [];   //  Array che contengono le entità complete non filtrate
        var elencoProvince = [];
        var elencoCitta = [];
        var elencoLocalita = [];
        var elencoArmadi = [];
        var elencoCassetti = [];
        var elencoVassoi = [];

        var inizialeAlbero = true;    // Variabili che memorizzano lo stato dei filtri all'apertura della finestra
        var inizialeNazione = [];      // in modo da poterlo ripristinare in caso di chiusura con "Annulla" 
        var inizialeRegione = [];
        var inizialeProvincia = [];
        var inizialeCitta = [];
        var inizialeLocalita = [];
        var inizialeRaccoglitore = [];
        var inizialeSala = [];
        var inizialeArmadio = [];
        var inizialeCassetto = [];
        var inizialeVassoio = [];
        var inizialeSpedizione = [];
        var inizialeCollezione = [];
        var inizialeDataDa = null;
        var inizialeDataA = null;
        var inizialeTipoDataDa = "";
        var inizialeTipoDataA = "";

        var esemplariFiltratiSuGeografia = [];     // elenchi di esemplari restituiti dai singoli filtri
        var esemplariFiltratiSuRaccoglitori = [];
        var esemplariFiltratiSuCollocazione = [];
        var esemplariFiltratiSuSpedizione = [];
        var esemplariFiltratiSuCollezione = [];
        var esemplariFiltratiSuDataDa = [];
        var esemplariFiltratiSuDataA = [];


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
        };


        function resetDropDownSeNecessario() {         // inizializza le dropdown se non hanno un valore impostato

            if (vm.nazioneSelezionata == undefined) {
                vm.resetNazione();
            };
            if (vm.raccoglitoreSelezionato == undefined) {
                vm.resetRaccoglitore();
            };

            if (vm.salaSelezionata == undefined) {
                vm.resetSala();
            };
            if (vm.spedizioneSelezionata == undefined) {
                vm.resetSpedizione();
            };
            if (vm.collezioneSelezionata == undefined) {
                vm.resetCollezione();
            };
            if (vm.tipoDataDa == undefined) {
                vm.resetDataDa();
            };
            if (vm.tipoDataA == undefined) {
                vm.resetDataA();
            };
        };


        function salvaFiltri() {
            inizialeAlbero = vm.filtroSuAlberoAttivo;
            inizialeNazione = vm.nazioneSelezionata;
            inizialeRegione = vm.regioneSelezionata;
            inizialeProvincia = vm.provinciaSelezionata;
            inizialeCitta = vm.cittaSelezionata;
            inizialeLocalita = vm.localitaSelezionata;
            inizialeRaccoglitore = vm.raccoglitoreSelezionato;
            inizialeSala = vm.salaSelezionata;
            inizialeArmadio = vm.armadioSelezionato;
            inizialeCassetto = vm.cassettoSelezionato;
            inizialeVassoio = vm.vassoioSelezionato;
            inizialeSpedizione = vm.spedizioneSelezionata;
            inizialeCollezione = vm.collezioneSelezionata;
            inizialeDataDa = vm.dataCatturaDa;
            inizialeTipoDataDa = vm.tipoDataCatturaDa;
            inizialeDataA = vm.dataCatturaA;
            inizialeTipoDataA = vm.tipoDataCatturaA;
        };


        var vm = this;

        vm.filtroSuAlberoAttivo = true;             //  booleani che indicano se un certo filtro è attivo o no. Per default è attivo solo quello sull'albero
        vm.filtroSuGeografiaAttivo = false;
        vm.filtroSuRaccoglitoriAttivo = false;
        vm.filtroSuCollocazioneAttivo = false;
        vm.filtroSuSpedizioneAttivo = false;
        vm.filtroSuCollezioneAttivo = false;
        vm.filtroDataDa = false;
        vm.filtroDataA = false;

        vm.datiAlbero = [];            // Albero tassonomico
        vm.datiElencoSpecie = [];      // Elenco delle specie che compare nella dropdown di selezione diretta
        vm.esemplariSelezionati = [];  // Contenuto della tabella
        vm.numeroSpecie = 0;           // Badge che contiene il numero di sottospecie attualmente selezionate nell'albero
        vm.nodiSelezionati = [];       // Collection che contiene i nodi attualmente selezionati nell'albero (che permette la multiselezione)
        vm.foglia = false;             // Indica se è selezionata una ed una sola foglia dell'albero (cioè una singola sottospecie). Usato per visualizzare il box di inserimento
        vm.MSNGpresente = false;       // Flag che indica se visualizzare o no l'alert di MSNG già presente
        vm.numeroRigheOK = true;       // Flag che indica se i filtri visualizzebbero troppe righe nella tabella e quindi richiede un'ulteriore conferma
        vm.sottospecieSelezionate = [];  // Elenco degli ID delle sottospecie selezionate nell'albero
        vm.arrayIdEsemplari = [];

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

        vm.opzioniTabella = DTOptionsBuilder.newOptions()       // Opzioni di visualizzazione della angular datatable
            .withOption("lengthMenu", [10, 25])
            .withLanguageSource(stringaLinguaggioDatatables);   // La lingua della tabella viene impostata "al volo" appena prima della generazione della tabella stessa
                                                                // (come da specifiche delle angular datatables)
                                                                // utilizzando la variabile globale javascript "stringaLinguaggioDatatables" (che si trova in _Layout.cshtml)

        vm.colonneTabella = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()  // Impedisce l'ordinamento della tabella sulla colonna dei pulsanti
        ];

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

        vm.deseleziona = function deseleziona() {
            vm.nodiSelezionati = [];
            vm.specieSelezionata = [];
            vm.sottospecieSelezionate = [];
            vm.numeroSpecie = 0;
            vm.foglia = false;
            vm.applicaFiltri();
        };

        vm.selezionaSingolaSpecie = function selezionaSingolaSpecie() {
            vm.nodiSelezionati = [];
            vm.sottospecieSelezionate = [];
            vm.sottospecieSelezionate.push(vm.specieSelezionata.id);
            vm.numeroSpecie = 1;
            vm.foglia = true;
            vm.sottospecie = vm.specieSelezionata.id;
            vm.applicaFiltri();
        };

        vm.revertFiltri = function revertFiltri() {

            vm.filtroSuAlberoAttivo = inizialeAlbero;
            vm.nazioneSelezionata = inizialeNazione; vm.selezionaNazione();
            vm.regioneSelezionata = inizialeRegione; vm.selezionaRegione();
            vm.provinciaSelezionata = inizialeProvincia; vm.selezionaProvincia();
            vm.cittaSelezionata = inizialeCitta; vm.selezionaCitta();
            vm.localitaSelezionata = inizialeLocalita; vm.selezionaLocalita();
            vm.impostaFiltriGeografia();

            vm.raccoglitoreSelezionato = inizialeRaccoglitore; vm.selezionaRaccoglitore();
            vm.impostaFiltriRaccoglitori();

            vm.salaSelezionata = inizialeSala; vm.selezionaSala();
            vm.armadioSelezionato = inizialeArmadio; vm.selezionaArmadio();
            vm.cassettoSelezionato = inizialeCassetto; vm.selezionaCassetto();
            vm.vassoioSelezionato = inizialeVassoio; vm.selezionaVassoio();
            vm.impostaFiltriCollocazione();

            vm.spedizioneSelezionata = inizialeSpedizione; vm.selezionaSpedizione();
            vm.impostaFiltriSpedizione();

            vm.collezioneSelezionata = inizialeCollezione; vm.selezionaCollezione();
            vm.impostaFiltriCollezione();

            vm.dataCatturaDa = inizialeDataDa;
            vm.tipoDataCatturaDa = inizialeTipoDataDa;
            vm.dataCatturaA = inizialeDataA;
            vm.tipoDataCatturaA = inizialeTipoDataA;
            vm.impostaFiltriDataDa();
            vm.impostaFiltriDataA();
        };

        vm.applicaFiltri = function applicaFiltri() {

            if (vm.filtroSuAlberoAttivo) {                   // se è selezionato il filtro sull'albero filtra le sottospecie presenti nell'albero stesso...
                elencoFiltratoEsemplari = _.filter(elencoEsemplari, function (esemplare) { return vm.sottospecieSelezionate.includes(esemplare.sottospecieId); });
            }
            else {                                           // ...altrimenti prendi l'intero elenco esemplari
                elencoFiltratoEsemplari = elencoEsemplari;
            };

            if (vm.filtroSuGeografiaAttivo) {  // Filtra sulla località di cattura
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuGeografia, "id");
            };

            if (vm.filtroSuRaccoglitoriAttivo) {  // Filtra sui raccoglitori
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuRaccoglitori, "id");
            };

            if (vm.filtroSuCollocazioneAttivo) {  // Filtra sulla collocazione
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuCollocazione, "id");
            };

            if (vm.filtroSuSpedizioneAttivo) {  // Filtra sulla spedizione
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuSpedizione, "id");
            };

            if (vm.filtroSuCollezioneAttivo) {  // Filtra sulla collezione
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuCollezione, "id");
            };

            if (vm.filtroDataDa) {
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuDataDa, "id");
            };

            if (vm.filtroDataA) {
                elencoFiltratoEsemplari = _.intersectionBy(elencoFiltratoEsemplari, esemplariFiltratiSuDataA, "id");
            };

            if (elencoFiltratoEsemplari.length < 2000) {
                $('#modaleFiltriElencoEsemplari').modal('hide');  // chiude la modale se è aperta, perché il pulsante normale di chiusura non ha data-dismiss="modal"
                vm.eseguiFiltro();                                // (se lo avesse non potrebbe visualizzare il warning di troppe righe, se necessario)
            }
            else vm.numeroRigheOK = false;
        };


        vm.eseguiFiltro = function eseguiFiltro() {  // Esegue effettivamente il riempimento della tabella esemplari
            vm.esemplariSelezionati = elencoFiltratoEsemplari;

            vm.arrayIdEsemplari = [];
            for (var i = 0; i < elencoFiltratoEsemplari.length; i++) {
                vm.arrayIdEsemplari.push(elencoFiltratoEsemplari[i].id)
            };
        };


        vm.aprimodaleFiltriElencoEsemplari = function aprimodaleFiltriElencoEsemplari() {
            vm.numeroRigheOK = true;
            resetDropDownSeNecessario();
            salvaFiltri();
        };


        vm.resetFiltri = function resetFiltri() {  //  Resetta contemporaneamente tutti i filtri
            vm.numeroRigheOK = true;
            vm.filtroSuAlberoAttivo = true;
            vm.resetNazione();
            vm.resetRaccoglitore();
            vm.resetSala();
            vm.resetSpedizione();
            vm.resetCollezione();
            vm.resetDataDa();
            vm.resetDataA();
        };

        vm.resetSala = function resetSala() {
            vm.salaSelezionata = _.find(vm.sale, function (sala) { return sala.sala == "-" });
            vm.selezionaSala();
        };

        vm.resetArmadio = function resetArmadio() {
            vm.armadioSelezionato = _.find(vm.armadi, function (armadio) { return armadio.armadio == "-" });
            vm.selezionaArmadio();
        };

        vm.resetCassetto = function resetCassetto() {
            vm.cassettoSelezionato = _.find(vm.cassetti, function (cassetto) { return cassetto.cassetto == "-" });
            vm.selezionaCassetto();
        };

        vm.resetVassoio = function resetVassoio() {
            vm.vassoioSelezionato = _.find(vm.vassoi, function (vassoio) { return vassoio.vassoio == "-" });
            vm.selezionaVassoio();
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

        vm.resetSpedizione = function resetSpedizione() {
            vm.spedizioneSelezionata = _.find(vm.spedizioni, function (spedizione) { return spedizione.spedizione == "-" });
            vm.selezionaSpedizione();
        };

        vm.resetCollezione = function resetCollezione() {
            vm.collezioneSelezionata = _.find(vm.collezioni, function (collezione) { return collezione.collezione == "-" });
            vm.selezionaCollezione();
        };

        vm.resetDataDa = function resetDataDa() {
            vm.dataCatturaDa = null;
            vm.tipoDataCatturaDa = "Data completa";
        };

        vm.resetDataA = function resetDataA() {
            vm.dataCatturaA = null;
            vm.tipoDataCatturaA = "Data completa";
        };



        vm.selezionaLocalita = function selezionaLocalita() {
            vm.impostaFiltriGeografia();
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

        vm.selezionaRaccoglitore = function selezionaRaccoglitore() {
            vm.impostaFiltriRaccoglitori();
        };

        vm.selezionaSala = function selezionaSala() {
            vm.armadi = _.filter(elencoArmadi, function (armadio) { return armadio.salaId == vm.salaSelezionata.id });
            vm.armadioSelezionato = _.find(vm.armadi, function (armadio) { return armadio.armadio == "-" });
            vm.selezionaArmadio();
        };

        vm.selezionaArmadio = function selezionaArmadio() {
            vm.cassetti = _.filter(elencoCassetti, function (cassetto) { return cassetto.armadioId == vm.armadioSelezionato.id });
            vm.cassettoSelezionato = _.find(vm.cassetti, function (cassetto) { return cassetto.cassetto == "-" });
            vm.selezionaCassetto();
        };

        vm.selezionaCassetto = function selezionaCassetto() {
            vm.vassoi = _.filter(elencoVassoi, function (vassoio) { return vassoio.cassettoId == vm.cassettoSelezionato.id });
            vm.vassoioSelezionato = _.find(vm.vassoi, function (vassoio) { return vassoio.vassoio == "-" });
            vm.selezionaVassoio();
        };

        vm.selezionaVassoio = function selezionaVassoio() {
            vm.impostaFiltriCollocazione();
        };

        vm.selezionaSpedizione = function selezionaSpedizione() {
            vm.impostaFiltriSpedizione();
        };

        vm.selezionaCollezione = function selezionaCollezione() {
            vm.impostaFiltriCollezione();
        };


        vm.impostaFiltriGeografia = function impostaFiltriGeografia() {

            var apiGeograficaDaChiamare = "";

            //resetDropDownSeNecessario();

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
            }
        };


        vm.impostaFiltriRaccoglitori = function impostaFiltriRaccoglitori() {

            //resetDropDownSeNecessario();

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

            //resetDropDownSeNecessario();

            if (vm.salaSelezionata.sala != "-") {
                if (vm.armadioSelezionato.armadio != "-") {
                    if (vm.cassettoSelezionato.cassetto != "-") {
                        if (vm.vassoioSelezionato.vassoio != "-") {
                            apiCollocazioneDaChiamare = "/api/elencoesemplaridavassoio/" + vm.vassoioSelezionato.id;
                        }
                        else {
                            apiCollocazioneDaChiamare = "/api/elencoesemplaridacassetto/" + vm.cassettoSelezionato.id;
                        }
                    }
                    else {
                        apiCollocazioneDaChiamare = "/api/elencoesemplaridaarmadio/" + vm.armadioSelezionato.id;
                    }
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
            };
        };


        vm.impostaFiltriSpedizione = function impostaFiltriSpedizione() {

            //resetDropDownSeNecessario();

            if (vm.spedizioneSelezionata.spedizione != "-") {
                $http.get("/api/elencoesemplaridaspedizione/" + vm.spedizioneSelezionata.id)
                    .then(function (response) {
                        esemplariFiltratiSuSpedizione = response.data;
                        vm.filtroSuSpedizioneAttivo = true;
                    });
            }
            else {
                vm.filtroSuSpedizioneAttivo = false;
            }
        };


        vm.impostaFiltriCollezione = function impostaFiltriCollezione() {

            //resetDropDownSeNecessario();

            if (vm.collezioneSelezionata.collezione != "-") {
                $http.get("/api/elencoesemplaridacollezione/" + vm.collezioneSelezionata.id)
                    .then(function (response) {
                        esemplariFiltratiSuCollezione = response.data;
                        vm.filtroSuCollezioneAttivo = true;
                    });
            }
            else {
                vm.filtroSuCollezioneAttivo = false;
            }
        };

        vm.impostaFiltriDataDa = function impostaFiltriDataDa() {
            if (vm.dataCatturaDa != null) {
                $http.get("/api/elencoesemplaridadatada/" + funzioni.dataInterna(vm.dataCatturaDa, vm.tipoDataCatturaDa)) 
                    .then(function (response) {
                        esemplariFiltratiSuDataDa = response.data;
                        vm.filtroDataDa = true;
                    });
            }
            else {
                vm.filtroDataDa = false;
            }
        };

        vm.impostaFiltriDataA = function impostaFiltriDataA() {
            if (vm.dataCatturaA != null) {
                $http.get("/api/elencoesemplaridadataa/" + funzioni.dataInterna(vm.dataCatturaA, vm.tipoDataCatturaA))
                    .then(function (response) {
                        esemplariFiltratiSuDataA = response.data;
                        vm.filtroDataA = true;
                    });
            }
            else {
                vm.filtroDataA = false;
            }
        };


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

        $http.get("/api/cassetti")
            .then(function (response) {
                elencoCassetti = response.data;
            });

        $http.get("/api/vassoi")
            .then(function (response) {
                elencoVassoi = response.data;
            });

        $http.get("/api/spedizioni")
            .then(function (response) {
                vm.spedizioni = response.data;
            });

        $http.get("/api/collezioni")
            .then(function (response) {
                vm.collezioni = response.data;
            });

    }
})();