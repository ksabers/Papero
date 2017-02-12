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

        private double troncaDecimali(double numero)
        {
            return Math.Truncate(10 * numero) / 10;
        }

        [Authorize]
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

        [Authorize]                                                                      // Aggiorna la lista degli autori di una sottospecie
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

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AggiornaModiPreparazione(int Id,                              //  Id dell'esemplare
                                                          string tabellaElencoPreparatiSerializzata)  //  Array di array [parte,vassoio] dei preparati
        {
            var esemplareDaModificare = _repository.LeggiEsemplare(Id);
            var preparatiDaCancellare = esemplareDaModificare.Preparati;
            var ordinamento = 1;
            var arrayPreparati = JsonConvert.DeserializeObject<int[][]>(tabellaElencoPreparatiSerializzata);

            _repository.cancellaPreparati(Id);

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

        [Authorize]
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

        [Authorize]
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
                    esemplareDaModificare.Peso = troncaDecimali(peso);
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
                    esemplareDaModificare.LunghezzaTotale = troncaDecimali(lunghezzaTotale);
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
                    esemplareDaModificare.BeccoCranio = troncaDecimali(beccoCranio);
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
                    esemplareDaModificare.Culmine = troncaDecimali(culmine);
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
                    esemplareDaModificare.DimensioneOcchio = troncaDecimali(dimensioneOcchio);
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
                    esemplareDaModificare.AperturaAlare = troncaDecimali(aperturaAlare);
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
                    esemplareDaModificare.Ala = troncaDecimali(ala);
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
                    esemplareDaModificare.TimoniereCentrali = troncaDecimali(timoniereCentrali);
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
                    esemplareDaModificare.TimoniereEsterne = troncaDecimali(timoniereEsterne);
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
                    esemplareDaModificare.Remigante3 = troncaDecimali(remigante3);
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
                    esemplareDaModificare.FormulaAlareE = troncaDecimali(formulaAlareE);
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
                    esemplareDaModificare.FormulaAlareWp = troncaDecimali(formulaAlareWP);
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
                    esemplareDaModificare.FormulaAlare2 = troncaDecimali(formulaAlare2);
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
                    esemplareDaModificare.Tarso = troncaDecimali(tarso);
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
