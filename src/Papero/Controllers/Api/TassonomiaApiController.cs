using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class TassonomiaApiController : Controller
    {
        private ITassonomiaRepository _repository;
        private IPaperoRepository _repositoryComune;

        public TassonomiaApiController(ITassonomiaRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        #region Get

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/albero")]
        public IActionResult GetAlbero()
        {
            return Ok(_repository.LeggiAlbero());
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/famiglie")]
        public IActionResult GetFamiglie()
        {
            return Ok(_repository.LeggiFamiglie());
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/famiglie/{idFamiglia}")]
        public IActionResult GetFamiglie(int idFamiglia)
        {
            return Ok(_repository.LeggiFamiglie(idFamiglia));
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/sottofamiglie")]
        public IActionResult GetSottofamiglie()
        {
            return Ok(_repository.LeggiSottofamiglie());
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/sottofamiglie/{idSottofamiglia}")]
        public IActionResult GetSottofamiglie(int idSottofamiglia)
        {
            return Ok(_repository.LeggiSottofamiglie(idSottofamiglia));
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/tribu")]
        public IActionResult GetTribu()
        {
            return Ok(_repository.LeggiTribu());
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/tribu/{idTribu}")]
        public IActionResult GetTribu(int idTribu)
        {
            return Ok(_repository.LeggiTribu(idTribu));
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/generi")]
        public IActionResult GetGeneri()
        {
            return Ok(_repository.LeggiGeneri());
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/generi/{idGenere}")]
        public IActionResult GetGenere(int idGenere)
        {
            return Ok(_repository.LeggiGeneri(idGenere));
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/specie")]
        public IActionResult GetSpecie()
        {
            return Ok(_repository.LeggiSpecie());
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/specie/{idSpecie}")]
        public IActionResult GetSpecie(int idSpecie)
        {
            return Ok(_repository.LeggiSpecie(idSpecie));
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/sottospecie")]
        public IActionResult GetSottospecie()
        {
            return Ok(_repository.LeggiSottospecie());
        }

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/sottospecie/{idSottospecie}")]
        public IActionResult GetSottospecie(int idSottospecie)
        {
            return Ok(_repository.LeggiSottospecie(idSottospecie));
        }


        #endregion

        //[Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        //[HttpGet("api/classificatori")]
        //public IActionResult GetClassificatori()
        //{
        //    return Ok(_repository.LeggiClassificatori());
        //}

        //[Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        //[HttpGet("api/classificatori/{idClassificatore}")]
        //public IActionResult GetClassificatori(int classificatoreID)
        //{
        //    return Ok(_repository.LeggiClassificatori(classificatoreID));
        //}

        //[HttpPost("api/classificatori")]
        //public async Task<IActionResult> PostClassificatore([FromBody]Classificatori classificatore)
        //{
        //    _repository.PostClassificatore(classificatore);

        //    if (await _repositoryComune.SalvaModifiche())
        //        return Created($"api/classificatori/{classificatore.Id}", classificatore);
        //    return BadRequest("Errore");
        //}

        //[HttpPut("api/classificatori")]
        //public async Task<IActionResult> PutClassificatore([FromBody]Classificatori classificatore)
        //{
        //    _repository.PutClassificatore(classificatore);

        //    if (await _repositoryComune.SalvaModifiche())
        //        return Ok($"api/classificatori/{classificatore.Id}");
        //    return BadRequest("Errore");
        //}

        //[HttpDelete("api/classificatori/{idClassificatore}")]
        //public async Task<IActionResult> CancellaClassificatore(int idClassificatore)
        //{
        //    _repository.CancellaClassificatore(idClassificatore);

        //    if (await _repositoryComune.SalvaModifiche())
        //        return Ok();
        //    return BadRequest("Errore");
        //}
    }
}
