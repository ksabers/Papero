using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class PreparatoriController : Controller
    {
        private IPreparatoriRepository _repository;
        private IPaperoRepository _repositoryComune;

        public PreparatoriController(IPreparatoriRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/preparatori")]
        public IActionResult GetPreparatori()
        {
            return Ok(_repository.LeggiPreparatori());
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/preparatori/{idPreparatore}")]
        public IActionResult GetPreparatori(int idPreparatore)
        {
            return Ok(_repository.LeggiPreparatori(idPreparatore));
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/preparatoridaesemplare/{idEsemplare}")]
        public IActionResult GetPreparatoriDaEsemplare(int idEsemplare)
        {
            return Ok(_repository.LeggiPreparatoriDaEsemplare(idEsemplare));
        }

        [HttpPost("api/preparatori")]
        public async Task<IActionResult> PostPreparatore([FromBody]Preparatori preparatore)
        {
            _repository.PostPreparatore(preparatore);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/preparatori/{preparatore.Id}", preparatore);
            return BadRequest("Errore");
        }

        [HttpPut("api/preparatori")]
        public async Task<IActionResult> PutPreparatore([FromBody]Preparatori preparatore)
        {
            _repository.PutPreparatore(preparatore);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/preparatori/{preparatore.Id}");
            return BadRequest("Errore");
        }

        [HttpDelete("api/preparatori/{idPreparatore}")]
        public async Task<IActionResult> CancellaPreparatore(int idPreparatore)
        {
            _repository.CancellaPreparatore(idPreparatore);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }
    }
}
