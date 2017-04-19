using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class RaccoglitoriController : Controller
    {
        private IRaccoglitoriRepository _repository;
        private IPaperoRepository _repositoryComune;

        public RaccoglitoriController(IRaccoglitoriRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/raccoglitori")]
        public IActionResult GetRaccoglitori()
        {
            return Ok(_repository.LeggiRaccoglitori());
        }

        [HttpPost("api/raccoglitori")]
        public async Task<IActionResult> PostRaccoglitore([FromBody]Raccoglitori raccoglitore)
        {
            _repository.PostRaccoglitore(raccoglitore);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/raccoglitori/{raccoglitore.Id}", raccoglitore);
            return BadRequest("Errore");
        }

        [HttpPut("api/raccoglitori")]
        public async Task<IActionResult> PutRaccoglitore([FromBody]Raccoglitori raccoglitore)
        {
            _repository.PutRaccoglitore(raccoglitore);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/raccoglitori/{raccoglitore.Id}");
            return BadRequest("Errore");
        }

        [HttpDelete("api/raccoglitori/{idRaccoglitore}")]
        public async Task<IActionResult> CancellaRaccoglitore(int idRaccoglitore)
        {
            _repository.CancellaRaccoglitore(idRaccoglitore);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }
    }
}
