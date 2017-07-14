using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Papero.Models;

namespace Papero.Controllers.Web
{
    public class TassonomiaController : Controller
    {     
        [Authorize(Policy = "VisualizzaTassonomia")]
        public IActionResult Famiglie()
        {
            return View();
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        public IActionResult Sottofamiglie(int Id)
        {
            var famiglia = new Famiglie();
            famiglia.Id = Id;
            return View(famiglia);
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        public IActionResult Tribu(int Id)
        {
            var sottofamiglia = new Sottofamiglie();
            sottofamiglia.Id = Id;
            return View(sottofamiglia);
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        public IActionResult Generi(int Id)
        {
            var tribu = new Tribu();
            tribu.Id = Id;
            return View(tribu);
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        public IActionResult Specie(int Id)
        {
            var genere = new Generi();
            genere.Id = Id;
            return View(genere);
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        public IActionResult Tassonomia()
        {
            return View();
        }
    }
}
