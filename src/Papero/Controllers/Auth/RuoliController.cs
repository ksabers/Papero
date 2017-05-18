using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class RuoliController : Controller
    {
        private IAuthRepository _repository;
        private IPaperoRepository _repositoryComune;

        public RuoliController(IAuthRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpGet("api/ruoli")]
        public IActionResult GetRuoli()
        {
            return Ok(_repository.LeggiRuoli());
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpGet("api/ruoli/{idRuolo}")]
        public IActionResult GetRuoli(string idRuolo)
        {
            return Ok(_repository.LeggiRuoli(idRuolo));
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpGet("api/policies")]
        public IActionResult GetPolicies()
        {
            return Ok(_repository.LeggiPolicies().Result);
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpPost("api/ruoli")]
        public async Task<IActionResult> PostRuolo([FromBody]RuoloPapero ruolo)
        {
            await _repository.PostRuolo(ruolo);
            return Created($"api/ruoli/{ruolo.Id}", ruolo);

        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpPut("api/ruoli")]
        public async Task<IActionResult> PutRuolo([FromBody]RuoloPapero ruolo)
        {
            await _repository.PutRuolo(ruolo);
            return Ok($"api/ruoli/{ruolo.Id}");

        }
    }
}
