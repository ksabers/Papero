using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;

namespace Papero.Controllers
{
    public class EsemplariController : Controller
    {
        private IPaperoRepository _repository;

        public EsemplariController(IPaperoRepository repository)
        {
            _repository = repository;
        }
        [HttpGet("api/esemplari")]
        public IActionResult Get()
        {
            return Ok(_repository.LeggiEsemplari());
        }
    }
}
