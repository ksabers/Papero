﻿using System;
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


    }
}
