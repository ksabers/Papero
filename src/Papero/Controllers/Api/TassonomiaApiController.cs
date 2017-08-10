using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using Papero.ViewModels;
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

        [Authorize(Policy = "VisualizzaTassonomia")]
        [HttpGet("api/sottospecieconautori/{idSottospecie}")]
        public IActionResult GetSottospecieConAutori(int idSottospecie)
        {
            return Ok(_repository.LeggiSottospecieConAutori(idSottospecie));
        }

        #endregion

        #region Put

        [Authorize(Policy = "EditTassonomia")]
        [HttpPut("/api/famiglie")]
        public async Task<IActionResult> PutFamiglia([FromBody]Famiglie famiglia)
        {
            _repository.PutFamiglia(famiglia);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/famiglie/{famiglia.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPut("/api/sottofamiglie")]
        public async Task<IActionResult> PutSottofamiglia([FromBody]Sottofamiglie sottofamiglia)
        {
            _repository.PutSottofamiglia(sottofamiglia);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/sottofamiglie/{sottofamiglia.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPut("/api/tribu")]
        public async Task<IActionResult> PutTribu([FromBody]Tribu tribu)
        {
            _repository.PutTribu(tribu);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/tribu/{tribu.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPut("/api/generi")]
        public async Task<IActionResult> PutGenere([FromBody]Generi genere)
        {
            _repository.PutGenere(genere);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/generi/{genere.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPut("/api/specie")]
        public async Task<IActionResult> PutSpecie([FromBody]Specie specie)
        {
            _repository.PutSpecie(specie);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/specie/{specie.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPut("/api/sottospecieconautori")]
        public async Task<IActionResult> PutSottospecieConAutori([FromBody]SottospecieViewModel sottospecie)
        {
            _repository.PutSottospecieConAutori(sottospecie);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/sottospecieconautori/{sottospecie.Id}");
            return BadRequest("Errore");
        }

        #endregion

        #region Post

        [Authorize(Policy = "EditTassonomia")]
        [HttpPost("/api/sottospecieconautori")]
        public async Task<IActionResult> PostSottospecieConAutori([FromBody]SottospecieViewModel sottospecie)
        {
            _repository.PostSottospecieConAutori(sottospecie);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/sottospecieconautori/{sottospecie.Id}", sottospecie);
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPost("/api/specie")]
        public async Task<IActionResult> PostSpecie([FromBody]Specie specie)
        {
            _repository.PostSpecie(specie);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/specie/{specie.Id}", specie);
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPost("/api/generi")]
        public async Task<IActionResult> PostGenere([FromBody]Generi genere)
        {
            _repository.PostGenere(genere);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/generi/{genere.Id}", genere);
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPost("/api/tribu")]
        public async Task<IActionResult> PostTribu([FromBody]Tribu tribu)
        {
            _repository.PostTribu(tribu);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/tribu/{tribu.Id}", tribu);
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPost("/api/sottofamiglie")]
        public async Task<IActionResult> PostSottofamiglia([FromBody]Sottofamiglie sottofamiglia)
        {
            _repository.PostSottofamiglia(sottofamiglia);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/sottofamiglie/{sottofamiglia.Id}", sottofamiglia);
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpPost("/api/famiglie")]
        public async Task<IActionResult> PostFamiglia([FromBody]Famiglie famiglia)
        {
            _repository.PostFamiglia(famiglia);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/famiglie/{famiglia.Id}", famiglia);
            return BadRequest("Errore");
        }

        #endregion

        #region Delete

        [Authorize(Policy = "EditTassonomia")]
        [HttpDelete("/api/sottospecieconautori/{idSottospecie}")]
        [HttpDelete("/api/sottospecie/{idSottospecie}")]
        public async Task<IActionResult> DeleteSottospecie(int idSottospecie)
        {
            _repository.CancellaSottospecie(idSottospecie);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpDelete("/api/specie/{idSpecie}")]
        public async Task<IActionResult> DeleteSpecie(int idSpecie)
        {
            _repository.CancellaSottospecie(_repository.IdSottospecieIndeterminataDaSpecie(idSpecie));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaSpecie(idSpecie);
                if (await _repositoryComune.SalvaModifiche())
                {
                    return Ok();
                }   
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpDelete("/api/generi/{idGenere}")]
        public async Task<IActionResult> DeleteGenere(int idGenere)
        {
            _repository.CancellaSottospecie(_repository.IdSottospecieIndeterminataDaGenere(idGenere));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaSpecie(_repository.IdUnicaSpecieDaGenere(idGenere));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaGenere(idGenere);
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        return Ok();
                    }                     
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpDelete("/api/tribu/{idTribu}")]
        public async Task<IActionResult> DeleteTribu(int idTribu)
        {
            _repository.CancellaSottospecie(_repository.IdSottospecieIndeterminataDaTribu(idTribu));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaSpecie(_repository.IdUnicaSpecieDaTribu(idTribu));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaGenere(_repository.IdUnicoGenereDaTribu(idTribu));
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        _repository.CancellaTribu(idTribu);
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            return Ok();
                        }    
                    }
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpDelete("/api/sottofamiglie/{idSottofamiglia}")]
        public async Task<IActionResult> DeleteSottofamiglia(int idSottofamiglia)
        {
            _repository.CancellaSottospecie(_repository.IdSottospecieIndeterminataDaSottofamiglia(idSottofamiglia));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaSpecie(_repository.IdUnicaSpecieDaSottofamiglia(idSottofamiglia));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaGenere(_repository.IdUnicoGenereDaSottofamiglia(idSottofamiglia));
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        _repository.CancellaTribu(_repository.IdUnicaTribuDaSottofamiglia(idSottofamiglia));
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            _repository.CancellaSottofamiglia(idSottofamiglia);
                            if (await _repositoryComune.SalvaModifiche())
                            {
                                return Ok();
                            }
                        }
                    }
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditTassonomia")]
        [HttpDelete("/api/famiglie/{idFamiglia}")]
        public async Task<IActionResult> DeleteFamiglia(int idFamiglia)
        {
            _repository.CancellaSottospecie(_repository.IdSottospecieIndeterminataDaFamiglia(idFamiglia));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaSpecie(_repository.IdUnicaSpecieDaFamiglia(idFamiglia));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaGenere(_repository.IdUnicoGenereDaFamiglia(idFamiglia));
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        _repository.CancellaTribu(_repository.IdUnicaTribuDaFamiglia(idFamiglia));
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            _repository.CancellaSottofamiglia(_repository.IdUnicaSottofamigliaDaFamiglia(idFamiglia));
                            if (await _repositoryComune.SalvaModifiche())
                            {
                                _repository.CancellaFamiglia(idFamiglia);
                                if (await _repositoryComune.SalvaModifiche())
                                {
                                    return Ok();
                                }   
                            }
                        }
                    }
                }
            }
            return BadRequest("Errore");
        }

        #endregion

        #region Conteggio Esemplari

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridasottospecie/{idSottospecie}")]
        public IActionResult GetElencoEsemplariDaSottospecie(int idSottospecie)
        {
            return Ok(_repository.LeggiElencoEsemplariDaSottospecie(idSottospecie));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridaspecie/{idSpecie}")]
        public IActionResult GetElencoEsemplariDaSpecie(int idSpecie)
        {
            return Ok(_repository.LeggiElencoEsemplariDaSpecie(idSpecie));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridagenere/{idGenere}")]
        public IActionResult GetElencoEsemplariDaGenere(int idGenere)
        {
            return Ok(_repository.LeggiElencoEsemplariDaGenere(idGenere));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridatribu/{idTribu}")]
        public IActionResult GetElencoEsemplariDaTribu(int idTribu)
        {
            return Ok(_repository.LeggiElencoEsemplariDaTribu(idTribu));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridasottofamiglia/{idSottofamiglia}")]
        public IActionResult GetElencoEsemplariDaSottofamiglia(int idSottofamiglia)
        {
            return Ok(_repository.LeggiElencoEsemplariDaSottofamiglia(idSottofamiglia));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridafamiglia/{idFamiglia}")]
        public IActionResult GetElencoEsemplariDaFamiglia(int idFamiglia)
        {
            return Ok(_repository.LeggiElencoEsemplariDaFamiglia(idFamiglia));
        }

        #endregion

    }
}
