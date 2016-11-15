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
        private IStringLocalizer<PaperoController> _localizzatore;
        private IPaperoRepository _repository;
        private ILogger<PaperoController> _logger;


        public PaperoController(IStringLocalizer<PaperoController> localizzatore,   // Supporto per la localizzazione
                                IPaperoRepository repository,                       // Repository delle query nel database
                                ILogger<PaperoController> logger)                       
        {
            _localizzatore = localizzatore;
            _repository = repository;
            _logger = logger;

        }
        public IActionResult Index()
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


        public IActionResult Info()
        {
            return View();
        }

        public IActionResult Contatti()
        {
            return View();
        }

        public IActionResult ImpostaLingua(string lingua, string indirizzoRitorno)
        {

            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(lingua)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );

            return LocalRedirect(indirizzoRitorno);
        }
    }
}
