using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class UtentiController : Controller
    {
        private IAuthRepository _repository;
        private IPaperoRepository _repositoryComune;

        public UtentiController(IAuthRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpGet("api/utenti")]
        public IActionResult GetUtenti()
        {
            return Ok(_repository.LeggiUtenti());
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpGet("api/utenti/{idUtente}")]
        public IActionResult GetUtenti(string idUtente)
        {
            return Ok(_repository.LeggiUtenti(idUtente));
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpPost("api/utenti")]
        public async Task<IActionResult> PostUtente([FromBody]UtentePaperoConAutorizzazioni utente)
        {
            if (await _repository.PostUtente(utente))
            {
                return Created($"api/utenti/{utente.Id}", utente);
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpPut("api/utenti")]
        public async Task<IActionResult> PutUtente([FromBody]UtentePaperoConAutorizzazioni utente)
        {
            await _repository.PutUtente(utente);
            return Ok($"api/utenti/{utente.Id}");
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpDelete("api/utenti/{idUtente}")]
        public async Task<IActionResult> CancellaUtente(string idUtente)
        {
            await _repository.DeleteUtente(idUtente);
            return Ok();
        }

        //[HttpPost("api/spedizioni")]
        //public async Task<IActionResult> PostSpedizione([FromBody]Spedizioni spedizione)
        //{
        //    _repository.PostSpedizione(spedizione);

        //    if (await _repositoryComune.SalvaModifiche())
        //        return Created($"api/spedizioni/{spedizione.Id}", spedizione);
        //    return BadRequest("Errore");
        //}

        //[HttpPut("api/spedizioni")]
        //public async Task<IActionResult> PutSpedizione([FromBody]Spedizioni spedizione)
        //{
        //    _repository.PutSpedizione(spedizione);

        //    if (await _repositoryComune.SalvaModifiche())
        //        return Ok($"api/spedizioni/{spedizione.Id}");
        //    return BadRequest("Errore");
        //}

        //[HttpDelete("api/spedizioni/{idSpedizione}")]
        //public async Task<IActionResult> CancellaSpedizione(int idSpedizione)
        //{
        //    _repository.CancellaSpedizione(idSpedizione);

        //    if (await _repositoryComune.SalvaModifiche())
        //        return Ok();
        //    return BadRequest("Errore");
        //}

    }
}
