using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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
    }
}
