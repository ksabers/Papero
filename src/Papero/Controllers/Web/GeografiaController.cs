using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Papero.Models;

namespace Papero.Controllers.Web
{
    public class GeografiaController : Controller
    {

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        public IActionResult Geografia()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        public IActionResult Nazioni()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        public IActionResult Regioni(int Id)
        {
            var nazione = new Nazioni();
            nazione.Id = Id;
            return View(nazione);
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        public IActionResult Province(int Id)
        {
            var regione = new Regioni();
            regione.Id = Id;
            return View(regione);
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        public IActionResult Citta(int Id)
        {
            var provincia = new Province();
            provincia.Id = Id;
            return View(provincia);
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        public IActionResult Localita(int Id)
        {
            var citta = new Citta();
            citta.Id = Id;
            return View(citta);
        }

    }
}
