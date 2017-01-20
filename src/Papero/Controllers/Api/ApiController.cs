using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class ApiController : Controller
    {
        private IPaperoRepository _repository;

        public ApiController(IPaperoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("api/albero")]
        public IActionResult GetAlbero()
        {
            return Ok(_repository.LeggiAlbero());
        }

        [HttpGet("api/esemplari")]
        public IActionResult GetElencoSinteticoEsemplari()
        {
            return Ok(_repository.LeggiElencoEsemplari());
        }

        [HttpGet("api/esemplare/{idEsemplare}")]
        public IActionResult GetEsemplare(int idEsemplare)
        {
            return Ok(_repository.LeggiEsemplare(idEsemplare));
        }

        [HttpGet("api/staticonservazione")]
        public IActionResult GetStatiConservazione()
        {
            return Ok(_repository.LeggiStatiConservazione());
        }

        [HttpGet("api/classificazioni/{idSottospecie}")]
        public IActionResult GetClassificazioni(int idSottospecie)
        {
            return Ok(_repository.LeggiClassificazioni(idSottospecie));
        }

        [HttpGet("api/classificatori")]
        public IActionResult GetClassificatori()
        {
            return Ok(_repository.LeggiClassificatori());
        }

        [HttpPut("api/aggiornanomiestato/{idSottospecie}")]
        public async Task<IActionResult> PutNomiEStato([FromBody]int idSottospecie)
        {
            var sottospecie = new Sottospecie();

            _repository.AggiornaNomiEStato(idSottospecie, sottospecie);

            if (await _repository.SalvaModifiche())
            {
                return Created("api/trips/{theTrip.Name}","");
            }
            return BadRequest("Failed to save the trip");
        }
    }
}
