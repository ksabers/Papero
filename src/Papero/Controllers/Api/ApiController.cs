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
            return Ok(_repository.LeggiElencoSinteticoEsemplari());
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

        [HttpPut("api/aggiornaNomeItaliano/{idSottospecie}/{nomeItaliano}")]
        public async Task<IActionResult> PutNomeItaliano(int idSottospecie, string nomeItaliano)
        {
            _repository.AggiornaNomeItaliano(idSottospecie, nomeItaliano);

            if (await _repository.SalvaModifiche())
            {
                return Created("api/trips/{theTrip.Name}","");
            }
            return BadRequest("Failed to save the trip");
        }
    }
}
