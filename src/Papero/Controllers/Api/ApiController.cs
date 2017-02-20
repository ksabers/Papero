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



    }
}
