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

        #region Get

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

        [Authorize]
        [HttpGet("api/armadi")]
        public IActionResult GetArmadi()
        {
            return Ok(_repository.LeggiArmadi());
        }

        [Authorize]
        [HttpGet("api/armadi/{idArmadio}")]
        public IActionResult GetArmadi(int idArmadio)
        {
            return Ok(_repository.LeggiArmadi(idArmadio));
        }

        [Authorize]
        [HttpGet("api/cassetti")]
        public IActionResult GetCassetti()
        {
            return Ok(_repository.LeggiCassetti());
        }

        [Authorize]
        [HttpGet("api/cassetti/{idCassetto}")]
        public IActionResult GetCassetti(int idCassetto)
        {
            return Ok(_repository.LeggiCassetti(idCassetto));
        }

        [Authorize]
        [HttpGet("api/vassoi")]
        public IActionResult GetVassoi()
        {
            return Ok(_repository.LeggiVassoi());
        }

        [Authorize]
        [HttpGet("api/vassoi/{idVassoio}")]
        public IActionResult GetVassoi(int idVassoio)
        {
            return Ok(_repository.LeggiVassoi(idVassoio));
        }

        #endregion

        #region Post

        [HttpPost("api/sale")]
        public async Task<IActionResult> PostSala([FromBody]Sale sala)
        {
            _repository.PostSala(sala);

            if (await _repositoryComune.SalvaModifiche())
            {
                var armadio = new Armadi();
                armadio.SalaId = sala.Id;
                armadio.Armadio = "-";
                _repository.PostArmadio(armadio);
                if (await _repositoryComune.SalvaModifiche())
                {
                    var cassetto = new Cassetti();
                    cassetto.ArmadioId = armadio.Id;
                    cassetto.Cassetto = "-";
                    _repository.PostCassetto(cassetto);
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        var vassoio = new Vassoi();
                        vassoio.CassettoId = cassetto.Id;
                        vassoio.Vassoio = "-";
                        _repository.PostVassoio(vassoio);
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            return Created($"api/sale/{sala.Id}", sala);
                        }
                    }
                }
            }
            return BadRequest("Errore");
        }

        [HttpPost("api/armadi")]
        public async Task<IActionResult> PostArmadio([FromBody]Armadi armadio)
        {
            _repository.PostArmadio(armadio);

            if (await _repositoryComune.SalvaModifiche())
            {
                var cassetto = new Cassetti();
                cassetto.ArmadioId = armadio.Id;
                cassetto.Cassetto = "-";
                _repository.PostCassetto(cassetto);
                if (await _repositoryComune.SalvaModifiche())
                {
                    var vassoio = new Vassoi();
                    vassoio.CassettoId = cassetto.Id;
                    vassoio.Vassoio = "-";
                    _repository.PostVassoio(vassoio);
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        return Created($"api/armadi/{armadio.Id}", armadio);
                    }
                }
            }
            return BadRequest("Errore");
        }

        [HttpPost("api/cassetti")]
        public async Task<IActionResult> PostCassetto([FromBody]Cassetti cassetto)
        {
            _repository.PostCassetto(cassetto);

            if (await _repositoryComune.SalvaModifiche())
            {
                var vassoio = new Vassoi();
                vassoio.CassettoId = cassetto.Id;
                vassoio.Vassoio = "-";
                _repository.PostVassoio(vassoio);
                if (await _repositoryComune.SalvaModifiche())
                {
                    return Created($"api/cassetti/{cassetto.Id}", cassetto);
                }
            }
            return BadRequest("Errore");
        }

        [HttpPost("api/vassoi")]
        public async Task<IActionResult> PostVassoio([FromBody]Vassoi vassoio)
        {
            _repository.PostVassoio(vassoio);

            if (await _repositoryComune.SalvaModifiche())
                return Created($"api/vassoi/{vassoio.Id}", vassoio);
            return BadRequest("Errore");
        }

        #endregion

        #region Put

        [HttpPut("api/sale")]
        public async Task<IActionResult> PutSala([FromBody]Sale sala)
        {
            _repository.PutSala(sala);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/sale/{sala.Id}");
            return BadRequest("Errore");
        }

        [HttpPut("api/armadi")]
        public async Task<IActionResult> PutArmadio([FromBody]Armadi armadio)
        {
            _repository.PutArmadio(armadio);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/armadi/{armadio.Id}");
            return BadRequest("Errore");
        }

        [HttpPut("api/cassetti")]
        public async Task<IActionResult> PutCassetto([FromBody]Cassetti cassetto)
        {
            _repository.PutCassetto(cassetto);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/cassetti/{cassetto.Id}");
            return BadRequest("Errore");
        }

        [HttpPut("api/vassoi")]
        public async Task<IActionResult> PutVassoio([FromBody]Vassoi vassoio)
        {
            _repository.PutVassoio(vassoio);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/vassoi/{vassoio.Id}");
            return BadRequest("Errore");
        }

        #endregion

        #region Delete

        [HttpDelete("api/sale/{idSala}")]
        public async Task<IActionResult> CancellaSala(int idSala)
        {
            _repository.CancellaVassoio(_repository.IdVassoioIndeterminatoDaSala(idSala));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaCassetto(_repository.IdCassettoIndeterminatoDaSala(idSala));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaArmadio(_repository.IdArmadioIndeterminatoDaSala(idSala));
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        _repository.CancellaSala(idSala);
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            return Ok();
                        }
                    }
                }
            }
            return BadRequest("Errore");
        }

        [HttpDelete("api/armadi/{idArmadio}")]
        public async Task<IActionResult> CancellaArmadio(int idArmadio)
        {
            _repository.CancellaVassoio(_repository.IdVassoioIndeterminatoDaArmadio(idArmadio));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaCassetto(_repository.IdCassettoIndeterminatoDaArmadio(idArmadio));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaArmadio(idArmadio);
                    if (await _repositoryComune.SalvaModifiche())
                        return Ok();
                }
            }
            return BadRequest("Errore");
        }

        [HttpDelete("api/cassetti/{idCassetto}")]
        public async Task<IActionResult> CancellaCassetto(int idCassetto)
        {
            _repository.CancellaVassoio(_repository.IdVassoioIndeterminatoDaCassetto(idCassetto));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaCassetto(idCassetto);
                if (await _repositoryComune.SalvaModifiche())
                    return Ok();
            }
            return BadRequest("Errore");
        }

        [HttpDelete("api/vassoi/{idVassoio}")]
        public async Task<IActionResult> CancellaVassoio(int idVassoio)
        {
            _repository.CancellaVassoio(idVassoio);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }

        #endregion

    }
}
