using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class CollezioniController : Controller
    {
        private ICollezioniRepository _repository;
        private IPaperoRepository _repositoryComune;

        public CollezioniController(ICollezioniRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize]
        [HttpGet("api/collezioni")]
        public IActionResult GetCollezioni()
        {
            return Ok(_repository.LeggiCollezioni());
        }

        [HttpPost("api/collezioni")]
        public async Task<IActionResult> PostCollezione([FromBody]Collezioni collezione)
        {
            _repository.PostCollezione(collezione);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/collezioni/{collezione.Id}", collezione);
            return BadRequest("Errore");
        }

        [HttpPut("api/collezioni")]
        public async Task<IActionResult> PutCollezione([FromBody]Collezioni collezione)
        {
            _repository.PutCollezione(collezione);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/collezioni/{collezione.Id}");
            return BadRequest("Errore");
        }

        [HttpDelete("api/collezioni/{idCollezione}")]
        public async Task<IActionResult> CancellaCollezione(int idCollezione)
        {
            _repository.CancellaCollezione(idCollezione);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }
    }
}
