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

        public IActionResult DettaglioEsemplare(int id)
        {
            var data = _repository.LeggiEsemplare(id);

            return View(data);
        }

        public IActionResult DettaglioEsemplareByMSNG(int MSNG)
        {
            var data = _repository.LeggiEsemplare(MSNG);

            return View("DettaglioEsemplare", data);
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
