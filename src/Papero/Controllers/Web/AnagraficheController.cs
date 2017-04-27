using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Papero.Models;

namespace Papero.Controllers.Web
{
    public class AnagraficheController : Controller
    {

        [Authorize(Policy = "VisualizzaAnagraficaClassificatori")]
        public IActionResult Classificatori()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaCollezioni")]
        public IActionResult Collezioni()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaSpedizioni")]
        public IActionResult Spedizioni()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaRaccoglitori")]
        public IActionResult Raccoglitori()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaDeterminatori")]
        public IActionResult Determinatori()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaPreparatori")]
        public IActionResult Preparatori()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaCollocazione")]
        public IActionResult Sale()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaAnagraficaCollocazione")]
        public IActionResult Armadi(int Id)
        {
            var sala = new Sale();
            sala.Id = Id;
            return View(sala);
        }

        [Authorize(Policy = "VisualizzaAnagraficaCollocazione")]
        public IActionResult Cassetti(int Id)
        {
            var armadio = new Armadi();
            armadio.Id = Id;
            return View(armadio);
        }

        [Authorize(Policy = "VisualizzaAnagraficaCollocazione")]
        public IActionResult Vassoi(int Id)
        {
            var cassetto = new Cassetti();
            cassetto.Id = Id;
            return View(cassetto);
        }
    }
}
