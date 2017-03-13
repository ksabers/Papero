using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class ApiController : Controller
    {
        private IPaperoRepository _repository;

        public ApiController(IPaperoRepository repository)
        {
            _repository = repository;
        }

        [Authorize]
        [HttpGet("api/albero")]
        public IActionResult GetAlbero()
        {
            return Ok(_repository.LeggiAlbero());
        }

        [Authorize]
        [HttpGet("api/esemplari")]
        public IActionResult GetElencoSinteticoEsemplari()
        {
            return Ok(_repository.LeggiElencoEsemplari());
        }

        [Authorize]
        [HttpGet("api/esemplare/{idEsemplare}")]
        public IActionResult GetEsemplare(int idEsemplare)
        {
            return Ok(_repository.LeggiEsemplare(idEsemplare));
        }

        [Authorize]
        [HttpGet("api/staticonservazione")]
        public IActionResult GetStatiConservazione()
        {
            return Ok(_repository.LeggiStatiConservazione());
        }

        [Authorize]
        [HttpGet("api/classificazioni/{idSottospecie}")]
        public IActionResult GetClassificazioni(int idSottospecie)
        {
            return Ok(_repository.LeggiClassificazioni(idSottospecie));
        }

        [Authorize]
        [HttpGet("api/classificatori")]
        public IActionResult GetClassificatori()
        {
            return Ok(_repository.LeggiClassificatori());
        }

        [Authorize]
        [HttpGet("api/partipreparate")]
        public IActionResult GetPartiPreparate()
        {
            return Ok(_repository.LeggiPartiPreparate());
        }

        [Authorize]
        [HttpGet("api/preparati")]
        public IActionResult GetPreparati()
        {
            return Ok(_repository.LeggiPreparati());
        }

        [Authorize]
        [HttpGet("api/preparati/{idEsemplare}")]
        public IActionResult GetPreparati(int idEsemplare)
        {
            return Ok(_repository.LeggiPreparati(idEsemplare));
        }

        [Authorize]
        [HttpGet("api/sale")]
        public IActionResult GetSale()
        {
            return Ok(_repository.LeggiSale());
        }

        [Authorize]
        [HttpGet("api/armadi")]
        public IActionResult GetArmadi()
        {
            return Ok(_repository.LeggiArmadi());
        }

        [Authorize]
        [HttpGet("api/cassetti")]
        public IActionResult GetCassetti()
        {
            return Ok(_repository.LeggiCassetti());
        }

        [Authorize]
        [HttpGet("api/vassoi")]
        public IActionResult GetVassoi()
        {
            return Ok(_repository.LeggiVassoi());
        }

        [Authorize]
        [HttpGet("api/vecchiedeterminazioni")]
        public IActionResult GetVecchieDeterminazioni()
        {
            return Ok(_repository.LeggiVecchieDeterminazioni());
        }

        [Authorize]
        [HttpGet("api/vecchiedeterminazioni/{idEsemplare}")]
        public IActionResult GetVecchieDeterminazioni(int idEsemplare)
        {
            return Ok(_repository.LeggiVecchieDeterminazioni(idEsemplare));
        }

        [Authorize]
        [HttpGet("api/vecchideterminatori")]
        public IActionResult GetVecchiDeterminatori()
        {
            return Ok(_repository.LeggiVecchiDeterminatori());
        }

        [Authorize]
        [HttpGet("api/vecchideterminatori/{idVecchiaDeterminazione}")]
        public IActionResult GetVecchiDeterminatori(int idVecchiaDeterminazione)
        {
            return Ok(_repository.LeggiVecchiDeterminatori(idVecchiaDeterminazione));
        }

        [Authorize]
        [HttpGet("api/determinatori")]
        public IActionResult GetDeterminatori()
        {
            return Ok(_repository.LeggiDeterminatori());
        }

        [Authorize]
        [HttpGet("api/determinatori/{idEsemplare}")]
        public IActionResult GetDeterminazioni(int idEsemplare)
        {
            return Ok(_repository.LeggiDeterminatori(idEsemplare));
        }

        [Authorize]
        [HttpGet("api/elencoSpecie")]
        public IActionResult GetElencoSpecie()
        {
            return Ok(_repository.LeggiElencoSpecie());
        }

        [Authorize]
        [HttpGet("api/nazioni")]
        public IActionResult GetNazioni()
        {
            return Ok(_repository.LeggiNazioni());
        }

        [Authorize]
        [HttpGet("api/regioni")]
        public IActionResult GetRegioni()
        {
            return Ok(_repository.LeggiRegioni());
        }

        [Authorize]
        [HttpGet("api/regioni/{idNazione}")]
        public IActionResult GetRegioni(int idNazione)
        {
            return Ok(_repository.LeggiRegioni(idNazione));
        }

        [Authorize]
        [HttpGet("api/province")]
        public IActionResult GetProvince()
        {
            return Ok(_repository.LeggiProvince());
        }

        [Authorize]
        [HttpGet("api/province/{idRegione}")]
        public IActionResult GetProvince(int idRegione)
        {
            return Ok(_repository.LeggiProvince(idRegione));
        }

        [Authorize]
        [HttpGet("api/citta")]
        public IActionResult GetCitta()
        {
            return Ok(_repository.LeggiCitta());
        }

        [Authorize]
        [HttpGet("api/citta/{idProvincia}")]
        public IActionResult GetCitta(int idProvincia)
        {
            return Ok(_repository.LeggiCitta(idProvincia));
        }

        [Authorize]
        [HttpGet("api/localita")]
        public IActionResult GetLocalita()
        {
            return Ok(_repository.LeggiLocalita());
        }

        [Authorize]
        [HttpGet("api/localita/{idCitta}")]
        public IActionResult GetLocalita(int idCitta)
        {
            return Ok(_repository.LeggiLocalita(idCitta));
        }

        [Authorize]
        [HttpGet("api/geografia")]
        public IActionResult GetGeografia()
        {
            return Ok(_repository.LeggiGeografia());
        }

        [Authorize]
        [HttpGet("api/tipiacquisizione")]
        public IActionResult GetTipiAcquisizione()
        {
            return Ok(_repository.LeggiTipiAcquisizione());
        }

        [Authorize]
        [HttpGet("api/collezioni")]
        public IActionResult GetCollezioni()
        {
            return Ok(_repository.LeggiCollezioni());
        }

        [Authorize]
        [HttpGet("api/spedizioni")]
        public IActionResult GetSpedizioni()
        {
            return Ok(_repository.LeggiSpedizioni());
        }

        [Authorize]
        [HttpGet("api/raccoglitori")]
        public IActionResult GetRaccoglitori()
        {
            return Ok(_repository.LeggiRaccoglitori());
        }

        [Authorize]
        [HttpGet("api/sessi")]
        public IActionResult GetSessi()
        {
            return Ok(_repository.LeggiSessi());
        }

        [Authorize]
        [HttpGet("api/tipi")]
        public IActionResult GetTipi()
        {
            return Ok(_repository.LeggiTipi());
        }

        [Authorize]
        [HttpGet("api/aberrazioni")]
        public IActionResult GetAberrazioni()
        {
            return Ok(_repository.LeggiAberrazioni());
        }

        [Authorize]
        [HttpGet("api/preparatori")]
        public IActionResult GetPreparatori()
        {
            return Ok(_repository.LeggiPreparatori());
        }

        [Authorize]
        [HttpGet("api/preparatori/{idEsemplare}")]
        public IActionResult GetPreparatori(int idEsemplare)
        {
            return Ok(_repository.LeggiPreparatori(idEsemplare));
        }

        [Authorize]
        [HttpGet("api/preparazioni")]
        public IActionResult GetPreparazioni()
        {
            return Ok(_repository.LeggiPreparazioni());
        }

        [Authorize]
        [HttpGet("api/preparazioni/{idEsemplare}")]
        public IActionResult GetPreparazioni(int idEsemplare)
        {
            return Ok(_repository.LeggiPreparazioni(idEsemplare));
        }

    }
}
