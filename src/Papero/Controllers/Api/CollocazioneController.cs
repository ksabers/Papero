using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class CollocazioneController : Controller
    {
        private ICollocazioneRepository _repository;
        private IPaperoRepository _repositoryComune;

        public CollocazioneController(ICollocazioneRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize]
        [HttpGet("api/sale")]
        public IActionResult GetSale()
        {
            return Ok(_repository.LeggiSale());
        }

        [Authorize]
        [HttpGet("api/sale/{idSala}")]
        public IActionResult GetSale(int idSala)
        {
            return Ok(_repository.LeggiSale(idSala));
        }

        [HttpPost("api/sale")]
        public async Task<IActionResult> PostSala([FromBody]Sale sala)
        {
            _repository.PostSala(sala);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/sale/{sala.Id}", sala);
            return BadRequest("Errore");
        }

        [HttpPut("api/sale")]
        public async Task<IActionResult> PutSala([FromBody]Sale sala)
        {
            _repository.PutSala(sala);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/sale/{sala.Id}");
            return BadRequest("Errore");
        }

        [HttpDelete("api/sale/{idSala}")]
        public async Task<IActionResult> CancellaSala(int idSala)
        {
            _repository.CancellaSala(idSala);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }
    }
}
