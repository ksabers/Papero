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

        public IActionResult Famiglie()
        {
            try
            {
                var data = _repository.LeggiFamiglie();
                return View(data);
            }
            catch (Exception eccezione)
            {
                _logger.LogError($"Errore eseguendo LeggiFamiglie in PaperoController: {eccezione.Message}");
                return Redirect("/error");
            }
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
