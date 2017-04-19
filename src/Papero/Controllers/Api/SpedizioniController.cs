using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class SpedizioniController : Controller
    {
        private ISpedizioniRepository _repository;
        private IPaperoRepository _repositoryComune;

        public SpedizioniController(ISpedizioniRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize]
        [HttpGet("api/spedizioni")]
        public IActionResult GetSpedizioni()
        {
            return Ok(_repository.LeggiSpedizioni());
        }

        [HttpPost("api/spedizioni")]
        public async Task<IActionResult> PostSpedizione([FromBody]Spedizioni spedizione)
        {
            _repository.PostSpedizione(spedizione);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/spedizioni/{spedizione.Id}", spedizione);
            return BadRequest("Errore");
        }

        [HttpPut("api/spedizioni")]
        public async Task<IActionResult> PutSpedizione([FromBody]Spedizioni spedizione)
        {
            _repository.PutSpedizione(spedizione);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/spedizioni/{spedizione.Id}");
            return BadRequest("Errore");
        }

        [HttpDelete("api/spedizioni/{idSpedizione}")]
        public async Task<IActionResult> CancellaSpedizione(int idSpedizione)
        {
            _repository.CancellaSpedizione(idSpedizione);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }

    }
}
