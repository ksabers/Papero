//  PaperoController.cs
//
//  Controller principale dell'applicazione
//  Gestisce le azioni principali selezionabili nei menu
//  (tranne login e logout che sono gestite da AuthController.cs)

using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http;
using Papero.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Papero.ViewModels;
using AutoMapper;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Papero.Controllers
{
    public class PaperoController : Controller
    {
        private IStringLocalizer<PaperoController> _localizzatore;  // dichiarazione dei campi privati che incapsulano gli oggetti passati per dependency injection
        private IPaperoRepository _repository;
        private ILogger<PaperoController> _logger;

        public PaperoController(IStringLocalizer<PaperoController> localizzatore,   // Costruttore della classe, con le dependency injection di: 1)supporto per la localizzazione
                                IPaperoRepository repository,                       // 2) Repository delle query nel database
                                ILogger<PaperoController> logger)                   // 3) Supporto per i log

        {
            _localizzatore = localizzatore;
            _repository = repository;
            _logger = logger;
        }
        public IActionResult Index()  // Pagina principale dell'applicazione: restituisce semplicemente la sua vista
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        public IActionResult ElencoEsemplari()  // Pagina di navigazione con l'albero tassonomico e la tabella degli esemplari. Tutte le richieste al DB sono fatte da Angular
        {                                       // lato client tramite API, quindi lato server ci si limita a farsi restituire la vista vuota
            return View();
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        public IActionResult DettaglioEsemplare(int id)  // Pagina di dettaglio con tutti i dati del singolo esemplare. E' gestita in modo tradizionale client/server senza
                                                         // chiamate Angular
        {
            if (id != -1)  // Se è stato passato un ID valido, carica i dati. ID = -1 significa "non trovato" e si verifica quando viene cercato un MSNG inesistente
            {

                ViewBag.trovato = true;                                        // Flag che dice alla vista che l'ID è valido
                var modello = _repository.LeggiEsemplare(id);                  // Legge tutti i dati dell'esemplare
                var vista = Mapper.Map<DettaglioEsemplareViewModel>(modello);  // Mappa i dati dell'esemplare sul ViewModel che usiamo per comunicare con la vista

                return View(vista);        // Restituisce la vista di dettaglio passandole il ViewModel riempito di dati   
            }
            else   // Se l'ID non è valido, viene comunicato alla vista che l'MSNG cercato non esiste
            {
                ViewBag.trovato = false;
                ModelState.Clear();
                return View();
            }                                        
        }


        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpPost]
        public IActionResult DettaglioEsemplareByMSNG(int MSNG)    // Gestisce la pressione del pulsante MSNG nella pagina di dettaglio: 
        {                                                          // 

            var idEsemplare = _repository.EsemplareIdDaMSNG(MSNG);  // Ricava l'id esemplare a partire dall'MSNG e richiama la action di dettaglio passandole l'id esemplare

            return RedirectToAction("DettaglioEsemplare", new { id = idEsemplare });  // Con questa sintassi passiamo il parametro alla action come se avessimo scritto
        }                                                                             // "DettaglioEsemplare/id"

        [Authorize(Policy = "VisualizzaListe")]
        public IActionResult ListaTesto(string arrayIdEsemplariLista, string formatoLista)
        {
            var elencoEsemplari = JsonConvert.DeserializeObject<int[]>("[" + arrayIdEsemplariLista + "]");

            List<Esemplari> modello = new List<Esemplari>();

            for (int i = 0; i < elencoEsemplari.Length; i++)
            {
                modello.Add(_repository.LeggiEsemplare(elencoEsemplari[i]));
            }

            ViewBag.formato = formatoLista;
            return View(modello);
        }


        public IActionResult Info()  // Pagina statica di informazioni sull'applicazione: restituisce semplicemente la sua vista
        {
            return View();
        }

        public IActionResult Contatti()  // Pagina statica con email e info di contatto: restituisce semplicemente la sua vista
        {
            return View();
        }

        public IActionResult ImpostaLingua(string lingua, string indirizzoRitorno)  // Imposta la lingua per l'intera applicazione (lato server) settando i Cookie di cultura
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,                               // Inserisce o aggiunge il cookie mettendo come parametro il codice della lingua
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(lingua)),     // scelto nella dropdown in _Layout.cshtml
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }             // e lo imposta perché scada dopo un anno
            );
            return LocalRedirect(indirizzoRitorno);                                           // Poi ritorna alla pagina precedente
        }
    }
}
