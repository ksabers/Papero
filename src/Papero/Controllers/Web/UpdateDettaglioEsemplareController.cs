//  UpdateDettaglioEsemplareController.js
//
//  Controller delle azioni di update che si effettuano nella pagina di dettaglio
//  (tutto ciò che succede cliccando sulle matitine)


using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using System.Globalization;
using Papero.Funzioni;

namespace Papero.Controllers
{
    public class UpdateDettaglioEsemplareController : Controller
    {
        private IPaperoRepository _repository;
        private ILogger<UpdateDettaglioEsemplareController> _logger;

        public UpdateDettaglioEsemplareController(IPaperoRepository repository,                        // 1) Repository delle query nel database
                                                  ILogger<UpdateDettaglioEsemplareController> logger)  // 2) Supporto per i log
        {
            _repository = repository;
            _logger = logger;
        }


        [Authorize(Policy = "ModificaPresenzaEsemplare")]
        public async Task<IActionResult> TogglePresenza(int Id)               // Inverte il campo "Presenza" da true a false e viceversa 
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);

            esemplareDaModificare.Presenza = !esemplareDaModificare.Presenza;

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });
            }

            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });  //TODO fare pagina di errore
        }

        [Authorize(Policy = "ModificaElencoAutori")]                                     // Aggiorna la lista degli autori di una sottospecie
        [HttpPost]
        public async Task<IActionResult> AggiornaAutori(int Id,                          //  Id dell'esemplare
                                                int sottospecieId,                       //  Id della sottospecie
                                                string parametroElencoAutori,            //  Elenco autori come stringa, compreso di parentesi e anno classificazione
                                                int inputAnnoClassificazione,            //  Anno classificazione da solo come intero
                                                string tabellaElencoAutoriSerializzata,  //  Serie di id degli autori, separati da virgole
                                                string inputClassificazioneOriginale)    //  Decodifica della checkbox di class. originale: "on" significa true, altrimenti false
        {
            var sottospecieDaModificare = _repository.LeggiSottospecie(sottospecieId);
            var classificazioniDaEliminare = sottospecieDaModificare.Classificazioni;
            var ordinamento = 1;
            var arrayAutori = JsonConvert.DeserializeObject<int[]>(tabellaElencoAutoriSerializzata);   //  Ritrasforma in array la stringa serializzata passata come input

            sottospecieDaModificare.ElencoAutori = parametroElencoAutori;                                               //
            sottospecieDaModificare.AnnoClassificazione = inputAnnoClassificazione.ToString();                          // Setta i campi variati 
            sottospecieDaModificare.ClassificazioneOriginale = inputClassificazioneOriginale == "on" ? true : false;    //

            _repository.CancellaClassificazioni(sottospecieId);  // Cancella tutte le vecchie classificazioni (più semplice che cercare e modificare le pre-esistenti)

            foreach (var autore in arrayAutori)
            {
                var classificazioneDaAggiungere = new Classificazioni();                   //  Scorre l'array degli autori e per ciascun elemento crea una nuova entità
                classificazioneDaAggiungere.SottospecieId = sottospecieId;                 //  "classificazione", la riempie con i campi da inserire (sottospecie, autore
                classificazioneDaAggiungere.ClassificatoreId = autore;                     //  e ordinamento) e la inserisce nel contesto.
                classificazioneDaAggiungere.Ordinamento = ordinamento;                     //
                ordinamento += 1;                                                          //
                sottospecieDaModificare.Classificazioni.Add(classificazioneDaAggiungere);  //
            }

            if (await _repository.SalvaModifiche())                                        //  Salva il contesto nel database e se il salvataggio è andato a buon fine ricarica
            {                                                                              //  la pagina di dettaglio
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });  //TODO andare a pagina di errore
        }

        [Authorize(Policy = "ModificaModiPreparazioneEsemplare")]
        [HttpPost]
        public async Task<IActionResult> AggiornaModiPreparazione(int Id,                              //  Id dell'esemplare
                                                          string tabellaElencoPreparatiSerializzata)  //  Array di array [parte,vassoio] dei preparati
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);
            var preparatiDaCancellare = esemplareDaModificare.Preparati;
            var ordinamento = 1;
            var arrayPreparati = JsonConvert.DeserializeObject<int[][]>(tabellaElencoPreparatiSerializzata);

            _repository.CancellaPreparati(Id);

            foreach (var preparato in arrayPreparati)
            {
                var preparatoDaAggiungere = new Preparati();
                preparatoDaAggiungere.EsemplareId = Id;
                preparatoDaAggiungere.ParteId = preparato[0];
                preparatoDaAggiungere.VassoioId = preparato[1];
                preparatoDaAggiungere.Ordinamento = ordinamento;
                ordinamento += 1;
                esemplareDaModificare.Preparati.Add(preparatoDaAggiungere);
            }

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });  //TODO andare a pagina di errore
        }

        [Authorize(Policy = "ModificaDatiVecchieDeterminazioniEsemplare")]
        [HttpPost]
        public async Task<IActionResult> AggiornaVecchieDeterminazioni(int Id, string serializzazioneHiddenVecchieDeterminazioni, string serializzazioneHiddenVecchiDeterminatori)
        {

            var esemplareDaModificare = _repository.LeggiEsemplare(Id);

            //  deserializza le stringhe e ricostituisce le variabili di partenza

            var vecchieDeterminazioni = JsonConvert.DeserializeObject<IEnumerable<VecchieDeterminazioni>>(serializzazioneHiddenVecchieDeterminazioni);
            var vecchiDeterminatori = JsonConvert.DeserializeObject<IEnumerable<VecchiDeterminatori>>(serializzazioneHiddenVecchiDeterminatori);
            var ordinamentoDeterminazioni = 1;


            //  crea l'array di tutte le determinazioniID corrispondenti all'Id dell'esemplare corrente

            var arrayIdVecchieDeterminazioni = _repository.LeggiVecchieDeterminazioni(Id).Select(determinazione => determinazione.Id).ToArray();

            // cancella dalla tabella VecchiDeterminatori tutte le righe che hanno VecchiaDeterminazioneID compresa nell'array appena creato

            _repository.CancellaVecchiDeterminatori(arrayIdVecchieDeterminazioni);

            //  cancella dalla tabella VecchieDeterminazioni tutte le righe che hanno esemplareId uguale all'Id dell'esemplare corrente

            _repository.CancellaVecchieDeterminazioni(Id);

            //  per ciascuna riga di serializzazioneHiddenVecchieDeterminazioni deserializzata:

            foreach (var determinazione in vecchieDeterminazioni)
            {
                //     1) inserisci nella tabella VecchieDeterminazioni una riga con l'IdEsemplare corrente, il testo, la data e l'ordinamento
                var determinazioneDaInserire = new VecchieDeterminazioni();
                    determinazioneDaInserire.EsemplareId = Id;
                    determinazioneDaInserire.VecchiaDeterminazione = determinazione.VecchiaDeterminazione;
                    determinazioneDaInserire.DataDeterminazione = determinazione.DataDeterminazione;
                    determinazioneDaInserire.Ordinamento = ordinamentoDeterminazioni;
                ordinamentoDeterminazioni += 1;
                esemplareDaModificare.VecchieDeterminazioni.Add(determinazioneDaInserire);
                await _repository.SalvaModifiche();

                //     2) fatti restituire l'ID della riga appena inserita

                var idDeterminazioneInserita = determinazioneDaInserire.Id;

                //     3) filtra serializzazioneHiddenVecchiDeterminatori in base all'ID di serializzazioneHiddenVecchieDeterminazioni  (NON QUELLO APPENA RESTITUITO!)

                var vecchiDeterminatoriFiltrati = vecchiDeterminatori.Where(determinatore => determinatore.VecchiaDeterminazioneId == determinazione.Id).ToList();
                //     4) per ciascuna riga di serializzazioneHiddenVecchiDeterminatori filtrato:

                var ordinamentoDeterminatori = 1;
                foreach (var determinatore in vecchiDeterminatoriFiltrati)
                {
                    //          a)  inserisci nella tabella VecchiDeterminatori una riga con: ID della riga inserita al passo 3, ID del determinatore, ordinamento

                    var determinatoreDaInserire = new VecchiDeterminatori();
                    determinatoreDaInserire.VecchiaDeterminazioneId = idDeterminazioneInserita;
                    determinatoreDaInserire.DeterminatoreId = determinatore.DeterminatoreId;
                    determinatoreDaInserire.Ordinamento = ordinamentoDeterminatori;
                    ordinamentoDeterminatori += 1;
                    _repository.InserisciVecchiDeterminatori(determinatoreDaInserire);
                };
            }

            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });

        }

        [Authorize(Policy = "ModificaNomiSottospecie")]
        [HttpPost]
        public async Task<IActionResult> AggiornaNomi(int Id, int sottospecieId, string nomeItaliano, string nomeInglese, int statoConservazione)
        {
            var sottospecieDaModificare = _repository.LeggiSottospecie(sottospecieId);

            sottospecieDaModificare.NomeItaliano = nomeItaliano;
            sottospecieDaModificare.NomeInglese = nomeInglese;
            sottospecieDaModificare.StatoConservazioneId = statoConservazione;

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });  // TODO scrivere pagina di errore
        }

        [Authorize(Policy = "InserimentoEsemplare")]
        [HttpPost]
        public async Task<IActionResult>InserisciEsemplare(string inputMSNG, string inputHiddenIdSottospecie)
        {
            var esemplareDaInserire = new Esemplari();
                esemplareDaInserire.SottospecieId = Int32.Parse(inputHiddenIdSottospecie);
                esemplareDaInserire.Msng = Int32.Parse(inputMSNG);
                esemplareDaInserire.SessoId = _repository.LeggiIDSessoIndeterminato();
                esemplareDaInserire.LocalitaCatturaId = _repository.LeggiIDLocalitaIndeterminata();
                esemplareDaInserire.AvutoDaId = esemplareDaInserire.LegitId = esemplareDaInserire.CedenteId = _repository.LeggiIDRaccoglitoreIndeterminato();
                esemplareDaInserire.TipoAcquisizioneId = _repository.LeggiIDTipoAcquisizioneIndeterminato();
                esemplareDaInserire.CollezioneId = _repository.LeggiIDCollezioneIndeterminata();
                esemplareDaInserire.SpedizioneId = _repository.LeggiIDSpedizioneIndeterminata();
                esemplareDaInserire.Presenza = true;
                esemplareDaInserire.TipoId = _repository.LeggiIDTipoIndeterminato();
                esemplareDaInserire.AberrazioneId = _repository.LeggiIDAberrazioneIndeterminata();
                esemplareDaInserire.Inanellato = false;

            _repository.AggiungiEsemplare(esemplareDaInserire);

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaInserire.Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaInserire.Id });  // TODO scrivere pagina di errore
        }

        [Authorize(Policy = "CancellazioneEsemplare")]
        [HttpPost]
        public async Task<IActionResult> CancellaEsemplare(int Id)
        {
            _repository.CancellaEsemplare(Id);

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("ElencoEsemplari", "Papero");
            }
            return RedirectToAction("ElencoEsemplari", "Papero");  // TODO scrivere pagina di errore
        }

        [Authorize(Policy = "ModificaDatiGeografiaEsemplare")]
        [HttpPost]
        public async Task<IActionResult> AggiornaGeografia(int Id,
                                                           string hiddenOutputIdLocalitaSelezionata,
                                                           string inputDataCattura,
                                                           string tipoDataCattura,
                                                           string inputDataCatturaCorretta,
                                                           string hiddenOutputIdTipoAcquisizione,
                                                           string inputDataAcquisizione,
                                                           string tipoDataAcquisizione,
                                                           string hiddenOutputIdCollezione,
                                                           string hiddenoutputIdSpedizione,
                                                           string hiddenOutputIdAvutoDa,
                                                           string hiddenOutputIdLegit,
                                                           string hiddenOutputIdCedente)
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);

            esemplareDaModificare.LocalitaCatturaId = Int32.Parse(hiddenOutputIdLocalitaSelezionata);
            esemplareDaModificare.DataCattura = funzioni.scriviData(inputDataCattura, tipoDataCattura);
            esemplareDaModificare.DataCatturaCorretta = inputDataCatturaCorretta;
            esemplareDaModificare.TipoAcquisizioneId = Int32.Parse(hiddenOutputIdTipoAcquisizione);
            esemplareDaModificare.DataAcquisizione = funzioni.scriviData(inputDataAcquisizione, tipoDataAcquisizione);
            esemplareDaModificare.CollezioneId = Int32.Parse(hiddenOutputIdCollezione);
            esemplareDaModificare.SpedizioneId = Int32.Parse(hiddenoutputIdSpedizione);
            esemplareDaModificare.AvutoDaId = Int32.Parse(hiddenOutputIdAvutoDa);
            esemplareDaModificare.LegitId = Int32.Parse(hiddenOutputIdLegit);
            esemplareDaModificare.CedenteId = Int32.Parse(hiddenOutputIdCedente);

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });  // TODO scrivere pagina di errore
        }

        [Authorize(Policy = "ModificaDatiGeneraliEsemplare")]
        [HttpPost]
        public async Task<IActionResult> AggiornaDatiGenerali(int Id, 
                                                              string hiddenOutputIdSessoSelezionato, 
                                                              string inputLettera, 
                                                              string inputNumero, 
                                                              string hiddenOutputIdTipoSelezionato, 
                                                              string hiddenOutputIdAberrazioneSelezionata)
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);

            esemplareDaModificare.SessoId = Int32.Parse(hiddenOutputIdSessoSelezionato);
            esemplareDaModificare.LetteraEsemplare = inputLettera;
            esemplareDaModificare.NumeroEsemplare = inputNumero;
            esemplareDaModificare.TipoId = Int32.Parse(hiddenOutputIdTipoSelezionato);
            esemplareDaModificare.AberrazioneId = Int32.Parse(hiddenOutputIdAberrazioneSelezionata);

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });  // TODO scrivere pagina di errore
        }

        [Authorize(Policy = "ModificaDatiDeterminazioniEsemplare")]
        [HttpPost]
        public async Task<IActionResult> AggiornaDeterminazioni(int Id,
                                                                string inputDataDiDeterminazione,
                                                                string tipoDataDeterminazione,
                                                                string tabellaElencoDeterminatoriSerializzata)
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);
            var arrayDeterminatori = JsonConvert.DeserializeObject<int[]>(tabellaElencoDeterminatoriSerializzata);
            var ordinamento = 1;

            _repository.CancellaDeterminazioni(Id);

            foreach (var determinatore in arrayDeterminatori)
            {
                var determinazioneDaAggiungere = new Determinazioni();
                determinazioneDaAggiungere.DeterminatoreId = determinatore;
                determinazioneDaAggiungere.EsemplareId = Id;
                determinazioneDaAggiungere.Ordinamento = ordinamento;
                ordinamento += 1;
                esemplareDaModificare.Determinazioni.Add(determinazioneDaAggiungere);
            }

            esemplareDaModificare.DataDeterminazione = funzioni.scriviData(inputDataDiDeterminazione, tipoDataDeterminazione);

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });  // TODO scrivere pagina di errore
        }

        [Authorize(Policy = "ModificaPreparazioneEsemplare")]
        [HttpPost]
        public async Task<IActionResult> AggiornaPreparazione(int Id,
                                                              string inputDataPreparazione,
                                                              string tipoDataPreparazione,
                                                              string inputScheda,
                                                              string tabellaElencoPreparatoriSerializzata,
                                                              string inputNotePreparazione)
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);
            var arrayPreparatori = JsonConvert.DeserializeObject<int[]>(tabellaElencoPreparatoriSerializzata);
            var ordinamento = 1;

            _repository.CancellaPreparazioni(Id);

            foreach (var preparatore in arrayPreparatori)
            {
                var preparazioneDaAggiungere = new Preparazioni();
                preparazioneDaAggiungere.PreparatoreId = preparatore;
                preparazioneDaAggiungere.EsemplareId = Id;
                preparazioneDaAggiungere.Ordinamento = ordinamento;
                ordinamento += 1;
                esemplareDaModificare.Preparazioni.Add(preparazioneDaAggiungere);
            }

            esemplareDaModificare.DataPreparazione = funzioni.scriviData(inputDataPreparazione, tipoDataPreparazione);
            esemplareDaModificare.Scheda = Int32.Parse(inputScheda);
            esemplareDaModificare.NotePreparazione = inputNotePreparazione;

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });  // TODO scrivere pagina di errore
        }

        [Authorize(Policy = "ModificaBibliografiaNoteEsemplare")]
        [HttpPost]
        public async Task<IActionResult> AggiornaBibliografiaNote(int Id, 
                                                                  string inputBibliografia,
                                                                  string inputNote)
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);

            esemplareDaModificare.Bibliografia = inputBibliografia;
            esemplareDaModificare.Note = inputNote;

            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = esemplareDaModificare.Id });  // TODO scrivere pagina di errore
        }

        [Authorize(Policy = "ModificaMorfologiaEsemplare")]
        [HttpPost]
        public async Task<IActionResult> AggiornaMorfologia(int Id, 
                                                            string inputPeso,
                                                            string inputLunghezzaTotale,
                                                            string inputBeccoCranio, 
                                                            string inputCulmine,
                                                            string inputColoreBecco,
                                                            string inputDimensioneOcchio,
                                                            string inputColoreIride,
                                                            string inputAperturaAlare,
                                                            string inputAla,
                                                            string inputTimoniereCentrali,
                                                            string inputTimoniereEsterne,
                                                            string inputRemigante3,
                                                            string inputFormulaAlareE,
                                                            string inputFormulaAlareWP,
                                                            string inputFormulaAlare2,
                                                            string inputTarso,
                                                            string inputColoreZampe,
                                                            string inputInanellato,
                                                            string inputDatiAnello,
                                                            string inputContenutoIngluvie,
                                                            string inputContenutoStomaco)
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);

            double peso, lunghezzaTotale, beccoCranio, culmine, dimensioneOcchio, aperturaAlare, ala, timoniereCentrali,
                   timoniereEsterne, remigante3, formulaAlareE, formulaAlareWP, formulaAlare2, tarso;

            if (String.IsNullOrWhiteSpace(inputPeso))
                esemplareDaModificare.Peso = null;
            else
            {
                inputPeso = inputPeso.Replace(',', '.');
                if(double.TryParse(inputPeso, 
                                   NumberStyles.Any, 
                                   CultureInfo.InvariantCulture, 
                                   out peso))
                    esemplareDaModificare.Peso = funzioni.troncaDecimali(peso);
            }

            if (String.IsNullOrWhiteSpace(inputLunghezzaTotale))
                esemplareDaModificare.LunghezzaTotale = null;
            else
            {
                inputLunghezzaTotale = inputLunghezzaTotale.Replace(',', '.');
                if (double.TryParse(inputLunghezzaTotale, 
                                    NumberStyles.Any, 
                                    CultureInfo.InvariantCulture, 
                                    out lunghezzaTotale))
                    esemplareDaModificare.LunghezzaTotale = funzioni.troncaDecimali(lunghezzaTotale);
            }

            if (String.IsNullOrWhiteSpace(inputBeccoCranio))
                esemplareDaModificare.BeccoCranio = null;
            else
            {
                inputBeccoCranio = inputBeccoCranio.Replace(',', '.');
                if (double.TryParse(inputBeccoCranio, 
                                    NumberStyles.Any, 
                                    CultureInfo.InvariantCulture, 
                                    out beccoCranio))
                    esemplareDaModificare.BeccoCranio = funzioni.troncaDecimali(beccoCranio);
            }

            if (String.IsNullOrWhiteSpace(inputCulmine))
                esemplareDaModificare.Culmine = null;
            else
            {
                inputCulmine = inputCulmine.Replace(',', '.');
                if (double.TryParse(inputCulmine, 
                                    NumberStyles.Any, 
                                    CultureInfo.InvariantCulture, 
                                    out culmine))
                    esemplareDaModificare.Culmine = funzioni.troncaDecimali(culmine);
            }

            if (String.IsNullOrWhiteSpace(inputColoreBecco))
                esemplareDaModificare.ColoreBecco = null;
            else
                esemplareDaModificare.ColoreBecco = inputColoreBecco;

            if (String.IsNullOrWhiteSpace(inputDimensioneOcchio))
                esemplareDaModificare.DimensioneOcchio = null;
            else
            {
                inputDimensioneOcchio = inputDimensioneOcchio.Replace(',', '.');
                if (double.TryParse(inputDimensioneOcchio, 
                                    NumberStyles.Any, 
                                    CultureInfo.InvariantCulture, 
                                    out dimensioneOcchio))
                    esemplareDaModificare.DimensioneOcchio = funzioni.troncaDecimali(dimensioneOcchio);
            }

            if (String.IsNullOrWhiteSpace(inputColoreIride))
                esemplareDaModificare.ColoreIride = null;
            else
                esemplareDaModificare.ColoreIride = inputColoreIride;

            if (String.IsNullOrWhiteSpace(inputAperturaAlare))
                esemplareDaModificare.AperturaAlare = null;
            else
            {
                inputAperturaAlare = inputAperturaAlare.Replace(',', '.');
                if (double.TryParse(inputAperturaAlare,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out aperturaAlare))
                    esemplareDaModificare.AperturaAlare = funzioni.troncaDecimali(aperturaAlare);
            }

            if (String.IsNullOrWhiteSpace(inputAla))
                esemplareDaModificare.Ala = null;
            else
            {
                inputAla = inputAla.Replace(',', '.');
                if (double.TryParse(inputAla,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out ala))
                    esemplareDaModificare.Ala = funzioni.troncaDecimali(ala);
            }

            if (String.IsNullOrWhiteSpace(inputTimoniereCentrali))
                esemplareDaModificare.TimoniereCentrali = null;
            else
            {
                inputTimoniereCentrali = inputTimoniereCentrali.Replace(',', '.');
                if (double.TryParse(inputTimoniereCentrali,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out timoniereCentrali))
                    esemplareDaModificare.TimoniereCentrali = funzioni.troncaDecimali(timoniereCentrali);
            }

            if (String.IsNullOrWhiteSpace(inputTimoniereEsterne))
                esemplareDaModificare.TimoniereEsterne = null;
            else
            {
                inputTimoniereEsterne = inputTimoniereEsterne.Replace(',', '.');
                if (double.TryParse(inputTimoniereEsterne,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out timoniereEsterne))
                    esemplareDaModificare.TimoniereEsterne = funzioni.troncaDecimali(timoniereEsterne);
            }

            if (String.IsNullOrWhiteSpace(inputRemigante3))
                esemplareDaModificare.Remigante3 = null;
            else
            {
                inputRemigante3 = inputRemigante3.Replace(',', '.');
                if (double.TryParse(inputRemigante3,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out remigante3))
                    esemplareDaModificare.Remigante3 = funzioni.troncaDecimali(remigante3);
            }

            if (String.IsNullOrWhiteSpace(inputFormulaAlareE))
                esemplareDaModificare.FormulaAlareE = null;
            else
            {
                inputFormulaAlareE = inputFormulaAlareE.Replace(',', '.');
                if (double.TryParse(inputFormulaAlareE,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out formulaAlareE))
                    esemplareDaModificare.FormulaAlareE = funzioni.troncaDecimali(formulaAlareE);
            }

            if (String.IsNullOrWhiteSpace(inputFormulaAlareWP))
                esemplareDaModificare.FormulaAlareWp = null;
            else
            {
                inputFormulaAlareWP = inputFormulaAlareWP.Replace(',', '.');
                if (double.TryParse(inputFormulaAlareWP,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out formulaAlareWP))
                    esemplareDaModificare.FormulaAlareWp = funzioni.troncaDecimali(formulaAlareWP);
            }

            if (String.IsNullOrWhiteSpace(inputFormulaAlare2))
                esemplareDaModificare.FormulaAlare2 = null;
            else
            {
                inputFormulaAlare2 = inputFormulaAlare2.Replace(',', '.');
                if (double.TryParse(inputFormulaAlare2,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out formulaAlare2))
                    esemplareDaModificare.FormulaAlare2 = funzioni.troncaDecimali(formulaAlare2);
            }

            if (String.IsNullOrWhiteSpace(inputTarso))
                esemplareDaModificare.Tarso = null;
            else
            {
                inputTarso = inputTarso.Replace(',', '.');
                if (double.TryParse(inputTarso,
                                    NumberStyles.Any,
                                    CultureInfo.InvariantCulture,
                                    out tarso))
                    esemplareDaModificare.Tarso = funzioni.troncaDecimali(tarso);
            }

            if (String.IsNullOrWhiteSpace(inputColoreZampe))
                esemplareDaModificare.ColoreZampe = null;
            else
                esemplareDaModificare.ColoreZampe = inputColoreZampe;

            esemplareDaModificare.Inanellato = (inputInanellato == "true" ? true : false);

            if (String.IsNullOrWhiteSpace(inputDatiAnello))
                esemplareDaModificare.DatiAnello = null;
            else
                esemplareDaModificare.DatiAnello = inputDatiAnello;

            if (String.IsNullOrWhiteSpace(inputContenutoIngluvie))
                esemplareDaModificare.ContenutoIngluvie = null;
            else
                esemplareDaModificare.ContenutoIngluvie = inputContenutoIngluvie;

            if (String.IsNullOrWhiteSpace(inputContenutoStomaco))
                esemplareDaModificare.ContenutoStomaco = null;
            else
                esemplareDaModificare.ContenutoStomaco = inputContenutoStomaco;


            if (await _repository.SalvaModifiche())
            {
                return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });
            }
            return RedirectToAction("DettaglioEsemplare", "Papero", new { id = Id });  // TODO scrivere pagina di errore
        }
    }
}
