using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class ClassificatoriController : Controller
    {
        private IClassificatoriRepository _repository;
        private IPaperoRepository _repositoryComune;

        public ClassificatoriController(IClassificatoriRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/classificatori")]
        public IActionResult GetClassificatori()
        {
            return Ok(_repository.LeggiClassificatori());
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/classificatori/{idClassificatore}")]
        public IActionResult GetClassificatori(int classificatoreID)
        {
            return Ok(_repository.LeggiClassificatori(classificatoreID));
        }

        [HttpPost("api/classificatori")]
        public async Task<IActionResult> PostClassificatore([FromBody]Classificatori classificatore)
        {
            _repository.PostClassificatore(classificatore);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/classificatori/{classificatore.Id}", classificatore);
            return BadRequest("Errore");
        }

        [HttpPut("api/classificatori")]
        public async Task<IActionResult> PutClassificatore([FromBody]Classificatori classificatore)
        {
            _repository.PutClassificatore(classificatore);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/classificatori/{classificatore.Id}");
            return BadRequest("Errore");
        }

        [HttpDelete("api/classificatori/{idClassificatore}")]
        public async Task<IActionResult> CancellaClassificatore(int idClassificatore)
        {
            _repository.CancellaClassificatore(idClassificatore);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }
    }
}
