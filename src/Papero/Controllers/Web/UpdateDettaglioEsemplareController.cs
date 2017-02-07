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
    }
}
