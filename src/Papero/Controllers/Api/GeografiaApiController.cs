using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class GeografiaApiController : Controller
    {
        private IGeografiaRepository _repository;
        private IPaperoRepository _repositoryComune;

        public GeografiaApiController(IGeografiaRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        #region Get

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/geografia")]
        public IActionResult GetGeografia()
        {
            return Ok(_repository.LeggiGeografia());
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/nazioni")]
        public IActionResult GetNazioni()
        {
            return Ok(_repository.LeggiNazioni());
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/nazioni/{idNazione}")]
        public IActionResult GetNazioni(int idNazione)
        {
            return Ok(_repository.LeggiNazioni(idNazione));
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/regioni")]
        public IActionResult GetRegioni()
        {
            return Ok(_repository.LeggiRegioni());
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/regioni/{idRegione}")]
        public IActionResult GetRegioni(int idRegione)
        {
            return Ok(_repository.LeggiRegioni(idRegione));
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/province")]
        public IActionResult GetProvince()
        {
            return Ok(_repository.LeggiProvince());
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/province/{idProvincia}")]
        public IActionResult GetProvince(int idProvincia)
        {
            return Ok(_repository.LeggiProvince(idProvincia));
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/citta")]
        public IActionResult GetCitta()
        {
            return Ok(_repository.LeggiCitta());
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/citta/{idCitta}")]
        public IActionResult GetCitta(int idCitta)
        {
            return Ok(_repository.LeggiCitta(idCitta));
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/localita")]
        public IActionResult GetLocalita()
        {
            return Ok(_repository.LeggiLocalita());
        }

        [Authorize(Policy = "VisualizzaAnagraficaGeografia")]
        [HttpGet("api/localita/{idLocalita}")]
        public IActionResult GetLocalita(int idLocalita)
        {
            return Ok(_repository.LeggiLocalita(idLocalita));
        }

        #endregion

        #region Post

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPost("api/nazioni")]
        public async Task<IActionResult> PostNazione([FromBody]Nazioni nazione)
        {
            _repository.PostNazione(nazione);

            if (await _repositoryComune.SalvaModifiche())
            {
                var regione = new Regioni();
                regione.NazioneId = nazione.Id;
                regione.Regione = "-";
                _repository.PostRegione(regione);
                if (await _repositoryComune.SalvaModifiche())
                {
                    var provincia = new Province();
                    provincia.RegioneId = regione.Id;
                    provincia.Provincia = "-";
                    _repository.PostProvincia(provincia);
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        var citta = new Citta();
                        citta.ProvinciaId = provincia.Id;
                        citta.NomeCitta = "-";
                        _repository.PostCitta(citta);
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            var localita = new Localita();
                            localita.CittaId = citta.Id;
                            localita.NomeLocalita = "-";
                            _repository.PostLocalita(localita);
                            if (await _repositoryComune.SalvaModifiche())
                            {
                                return Created($"api/nazioni/{nazione.Id}", nazione);
                            }
                        }
                    }
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPost("api/regioni")]
        public async Task<IActionResult> PostRegione([FromBody]Regioni regione)
        {
            _repository.PostRegione(regione);
            if (await _repositoryComune.SalvaModifiche())
            {
                var provincia = new Province();
                provincia.RegioneId = regione.Id;
                provincia.Provincia = "-";
                _repository.PostProvincia(provincia);
                if (await _repositoryComune.SalvaModifiche())
                {
                    var citta = new Citta();
                    citta.ProvinciaId = provincia.Id;
                    citta.NomeCitta = "-";
                    _repository.PostCitta(citta);
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        var localita = new Localita();
                        localita.CittaId = citta.Id;
                        localita.NomeLocalita = "-";
                        _repository.PostLocalita(localita);
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            return Created($"api/regioni/{regione.Id}", regione);
                        }
                    }
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPost("api/province")]
        public async Task<IActionResult> PostProvincia([FromBody]Province provincia)
        {
            _repository.PostProvincia(provincia);
            if (await _repositoryComune.SalvaModifiche())
            {
                var citta = new Citta();
                citta.ProvinciaId = provincia.Id;
                citta.NomeCitta = "-";
                _repository.PostCitta(citta);
                if (await _repositoryComune.SalvaModifiche())
                {
                    var localita = new Localita();
                    localita.CittaId = citta.Id;
                    localita.NomeLocalita = "-";
                    _repository.PostLocalita(localita);
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        return Created($"api/province/{provincia.Id}", provincia);
                    }
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPost("api/citta")]
        public async Task<IActionResult> PostCitta([FromBody]Citta citta)
        {
            _repository.PostCitta(citta);
            if (await _repositoryComune.SalvaModifiche())
            {
                var localita = new Localita();
                localita.CittaId = citta.Id;
                localita.NomeLocalita = "-";
                _repository.PostLocalita(localita);
                if (await _repositoryComune.SalvaModifiche())
                {
                    return Created($"api/citta/{citta.Id}", citta);
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPost("api/localita")]
        public async Task<IActionResult> PostLocalita([FromBody]Localita localita)
        {
            _repository.PostLocalita(localita);
            if (await _repositoryComune.SalvaModifiche())
            {
                return Created($"api/localita/{localita.Id}", localita);
            }
            return BadRequest("Errore");
        }

        #endregion

        #region Put

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPut("api/nazioni")]
        public async Task<IActionResult> PutNazione([FromBody]Nazioni nazione)
        {
            _repository.PutNazione(nazione);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/nazioni/{nazione.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPut("api/regioni")]
        public async Task<IActionResult> PutRegione([FromBody]Regioni regione)
        {
            _repository.PutRegione(regione);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/regioni/{regione.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPut("api/province")]
        public async Task<IActionResult> PutProvincia([FromBody]Province provincia)
        {
            _repository.PutProvincia(provincia);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/province/{provincia.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPut("api/citta")]
        public async Task<IActionResult> PutCitta([FromBody]Citta citta)
        {
            _repository.PutCitta(citta);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/citta/{citta.Id}");
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpPut("api/localita")]
        public async Task<IActionResult> PutLocalita([FromBody]Localita localita)
        {
            _repository.PutLocalita(localita);

            if (await _repositoryComune.SalvaModifiche())
                return Ok($"api/localita/{localita.Id}");
            return BadRequest("Errore");
        }

        #endregion

        #region Delete

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpDelete("api/nazioni/{idNazione}")]
        public async Task<IActionResult> CancellaNazione(int idNazione)
        {
            _repository.CancellaLocalita(_repository.IdLocalitaIndeterminataDaNazione(idNazione));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaCitta(_repository.IdCittaIndeterminataDaNazione(idNazione));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaProvincia(_repository.IdProvinciaIndeterminataDaNazione(idNazione));
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        _repository.CancellaRegione(_repository.IdRegioneIndeterminataDaNazione(idNazione));
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            _repository.CancellaNazione(idNazione);
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

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpDelete("api/regioni/{idRegione}")]
        public async Task<IActionResult> CancellaRegione(int idRegione)
        {
            _repository.CancellaLocalita(_repository.IdLocalitaIndeterminataDaRegione(idRegione));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaCitta(_repository.IdCittaIndeterminataDaRegione(idRegione));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaProvincia(_repository.IdProvinciaIndeterminataDaRegione(idRegione));
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        _repository.CancellaRegione(idRegione);
                        if (await _repositoryComune.SalvaModifiche())
                        {
                            return Ok();
                        }
                    }
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpDelete("api/province/{idProvincia}")]
        public async Task<IActionResult> CancellaProvincia(int idProvincia)
        {
            _repository.CancellaLocalita(_repository.IdLocalitaIndeterminataDaProvincia(idProvincia));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaCitta(_repository.IdCittaIndeterminataDaProvincia(idProvincia));
                if (await _repositoryComune.SalvaModifiche())
                {
                    _repository.CancellaProvincia(idProvincia);
                    if (await _repositoryComune.SalvaModifiche())
                    {
                        return Ok();
                    }
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpDelete("api/citta/{idCitta}")]
        public async Task<IActionResult> CancellaCitta(int idCitta)
        {
            _repository.CancellaLocalita(_repository.IdLocalitaIndeterminataDaCitta(idCitta));

            if (await _repositoryComune.SalvaModifiche())
            {
                _repository.CancellaCitta(idCitta);
                if (await _repositoryComune.SalvaModifiche())
                {
                    return Ok();
                }
            }
            return BadRequest("Errore");
        }

        [Authorize(Policy = "EditAnagraficaGeografia")]
        [HttpDelete("api/localita/{idLocalita}")]
        public async Task<IActionResult> CancellaLocalita(int idLocalita)
        {
            _repository.CancellaLocalita(idLocalita);

            if (await _repositoryComune.SalvaModifiche())
                return Ok();
            return BadRequest("Errore");
        }

        #endregion

    }
}
