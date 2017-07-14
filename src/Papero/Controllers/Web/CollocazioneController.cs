using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Papero.Models;

namespace Papero.Controllers.Web
{
    public class CollocazioneController : Controller
    {

        [Authorize(Policy = "VisualizzaAnagraficaCollocazione")]
        public IActionResult Collocazione()
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
