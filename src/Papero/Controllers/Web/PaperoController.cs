//  PaperoController.cs
//  Controller principale dell'applicazione
//  Gestisce le azioni principali selezionabili nei menu
//  (tranne login e logout che sono gestite da AuthController.cs)

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http;
using Papero.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Papero.ViewModels;
using AutoMapper;

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

        [Authorize]

        public IActionResult ElencoEsemplari()  // Pagina di navigazione con l'albero tassonomico e la tabella degli esemplari. Tutte le richieste al DB sono fatte da Angular
        {                                       // lato client tramite API, quindi lato server ci si limita a farsi restituire la vista vuota
            return View();
        }

        public IActionResult DettaglioEsemplare(int id)  // Pagina di dettaglio con tutti i dati del singolo esemplare. E' gestita in modo tradizionale client/server senza
                                                         // chiamate Angular
        {
            if (id != -1)
            {
                var datiEsemplare = _repository.LeggiSingoloEsemplareDaElencoSintetico(id); // Legge i dati generici della sottospecie da scrivere nell'intestazione: 
                                                                                            // nomi e stato di conservazione

                //ViewBag.famiglia = datiEsemplare.Famiglia;              // Per comodità vengono trasmessi alla vista tramite ViewBag e non tramite modello
                //ViewBag.sottofamiglia = datiEsemplare.Sottofamiglia;    // TODO: verificare se si può migliorare il ViewModel includendo anche questi campi
                //ViewBag.tribu = datiEsemplare.Tribu;
                //ViewBag.genere = datiEsemplare.Genere;                                      
                //ViewBag.specie = datiEsemplare.Specie;
                //ViewBag.sottospecie = datiEsemplare.Sottospecie;
                ViewBag.elencoAutori = datiEsemplare.ElencoAutori;
                ViewBag.nomeItaliano = datiEsemplare.NomeItaliano;
                ViewBag.nomeInglese = datiEsemplare.NomeInglese;
                ViewBag.statoConservazione = datiEsemplare.StatoConservazione;
                ViewBag.sigla = datiEsemplare.Sigla;
                ViewBag.trovato = true;

                var modello = _repository.LeggiEsemplare(id);   // Legge tutti i dati dell'esemplare

                var vista = Mapper.Map<DettaglioEsemplareViewModel>(modello);  // Mappa i dati dell'esemplare sul ViewModel che usiamo per comunicare con la vista

                return View(vista);        // Restituisce la vista di dettaglio passandole il ViewModel riempito di dati   
            }
            else
            {
                ViewBag.trovato = false;
                ModelState.Clear();
                return View();
            }

                                        
        }

        public IActionResult DettaglioEsemplareByMSNG(int MSNG)    // Gestisce la pressione del pulsante MSNG nella pagina di dettaglio: 
        {                                                          // 

                var idEsemplare = _repository.EsemplareIdDaMSNG(MSNG);  // Ricava l'id esemplare a partire dall'MSNG e richiama la action di dettaglio passandole l'id esemplare

            return RedirectToAction("DettaglioEsemplare", new { id = idEsemplare });  // Con questa sintassi passiamo il parametro alla action come se avessimo scritto
        }                                                                             // "DettaglioEsemplare/id"


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
