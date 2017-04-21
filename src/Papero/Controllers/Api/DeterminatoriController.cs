using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class DeterminatoriController : Controller
    {
        private IDeterminatoriRepository _repository;
        private IPaperoRepository _repositoryComune;

        public DeterminatoriController(IDeterminatoriRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/determinatori")]
        public IActionResult GetDeterminatori()
        {
            return Ok(_repository.LeggiDeterminatori());
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/determinatori/{idDeterminatore}")]
        public IActionResult GetDeterminatori(int idDeterminatore)
        {
            return Ok(_repository.LeggiDeterminatori(idDeterminatore));
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/determinatoridaesemplare/{idEsemplare}")]
        public IActionResult GetDeterminatoriDaEsemplare(int idEsemplare)
        {
            return Ok(_repository.LeggiDeterminatoriDaEsemplare(idEsemplare));
        }

        [HttpPost("api/determinatori")]
        public async Task<IActionResult> PostDeterminatore([FromBody]Determinatori determinatore)
        {
            _repository.PostDeterminatore(determinatore);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/determinatori/{determinatore.Id}", determinatore);
            return BadRequest("Errore");
        }

        [HttpPut("api/determinatori")]
        public async Task<IActionResult> PutDeterminatore([FromBody]Determinatori determinatore)
        {
            _repository.PutDeterminatore(determinatore);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/determinatori/{determinatore.Id}");
            return BadRequest("Errore");
        }

        [HttpDelete("api/determinatori/{idDeterminatore}")]
        public async Task<IActionResult> CancellaDeterminatore(int idDeterminatore)
        {
            _repository.CancellaDeterminatore(idDeterminatore);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }
    }
}
