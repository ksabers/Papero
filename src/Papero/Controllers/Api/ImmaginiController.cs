using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class ImmaginiController : Controller
    {
        private IImmaginiRepository _repository;
        private IPaperoRepository _repositoryComune;

        public ImmaginiController(IImmaginiRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize(Policy = "VisualizzaImmagini")]
        [HttpGet("api/immagini")]
        public IActionResult GetImmagini()
        {
            return Ok(_repository.LeggiImmagini());
        }

        [Authorize(Policy = "VisualizzaImmagini")]
        [HttpGet("api/immagini/{idImmagine}")]
        public IActionResult GetImmagini(int idImmagine)
        {
            return Ok(_repository.LeggiImmagini(idImmagine));
        }

        [Authorize(Policy = "EditImmagini")]
        [HttpPost("api/immagini")]
        public async Task<IActionResult> PostImmagine([FromBody]Immagini immagine)
        {
            _repository.PostImmagine(immagine);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/immagini/{immagine.Id}", immagine);
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditImmagini")]
        [HttpDelete("api/immagini/{idImmagine}")]
        public async Task<IActionResult> DeleteImmagine(int idImmagine)
        {
            _repository.CancellaImmagine(idImmagine);
            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }

    }
}
