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

        /// <summary>
        /// API che restituisce l'albero tassonomico
        /// </summary>
        /// <returns></returns>
        //[Authorize]
        //[HttpGet("api/albero")]
        //public IActionResult GetAlbero()
        //{
        //    return Ok(_repository.LeggiAlbero());
        //}

        /// <summary>
        /// API che restituisce l'elenco degli esemplari in formato sinteticoVisualizzaElencoEsemplari
        /// </summary>
        /// <returns></returns>
        [Authorize(Policy = "")]
        [HttpGet("api/esemplari")]
        public IActionResult GetElencoSinteticoEsemplari()
        {
            return Ok(_repository.LeggiElencoEsemplari());
        }

        /// <summary>
        /// API che restituisce tutti i dati di un singolo esemplare
        /// </summary>
        /// <param name="idEsemplare"></param>
        /// <returns></returns>
        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/esemplari/{idEsemplare}")]
        public IActionResult GetEsemplare(int idEsemplare)
        {
            return Ok(_repository.LeggiEsemplare(idEsemplare));
        }

        /// <summary>
        /// API che restituisce l'ID dell'esemplare a partire dal suo MSNG
        /// </summary>
        /// <param name="msng"></param>
        /// <returns>Intero ID dell'esemplare, o -1 se non esiste</returns>
        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/msng/{msng}")]
        public IActionResult GetEsemplaredaMSNG(int msng)
        {
            return Ok(_repository.EsemplareIdDaMSNG(msng));
        }

        /// <summary>
        /// API che restituisce gli stati di conservazione
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet("api/staticonservazione")]
        public IActionResult GetStatiConservazione()
        {
            return Ok(_repository.LeggiStatiConservazione());
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/classificazioni/{idSottospecie}")]
        public IActionResult GetClassificazioni(int idSottospecie)
        {
            return Ok(_repository.LeggiClassificazioni(idSottospecie));
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

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/preparati/{idEsemplare}")]
        public IActionResult GetPreparati(int idEsemplare)
        {
            return Ok(_repository.LeggiPreparati(idEsemplare));
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/vecchiedeterminazioni")]
        public IActionResult GetVecchieDeterminazioni()
        {
            return Ok(_repository.LeggiVecchieDeterminazioni());
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/vecchiedeterminazioni/{idEsemplare}")]
        public IActionResult GetVecchieDeterminazioni(int idEsemplare)
        {
            return Ok(_repository.LeggiVecchieDeterminazioni(idEsemplare));
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/vecchideterminatori")]
        public IActionResult GetVecchiDeterminatori()
        {
            return Ok(_repository.LeggiVecchiDeterminatori());
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/vecchideterminatori/{idVecchiaDeterminazione}")]
        public IActionResult GetVecchiDeterminatori(int idVecchiaDeterminazione)
        {
            return Ok(_repository.LeggiVecchiDeterminatori(idVecchiaDeterminazione));
        }

        [Authorize]
        [HttpGet("api/elencoSpecie")]
        public IActionResult GetElencoSpecie()
        {
            return Ok(_repository.LeggiElencoSpecie());
        }





 





        //[Authorize]
        //[HttpGet("api/geografia")]
        //public IActionResult GetGeografia()
        //{
        //    return Ok(_repository.LeggiGeografia());
        //}

        [Authorize]
        [HttpGet("api/tipiacquisizione")]
        public IActionResult GetTipiAcquisizione()
        {
            return Ok(_repository.LeggiTipiAcquisizione());
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

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/preparazioni")]
        public IActionResult GetPreparazioni()
        {
            return Ok(_repository.LeggiPreparazioni());
        }

        [Authorize(Policy = "VisualizzaDettaglioEsemplare")]
        [HttpGet("api/preparazioni/{idEsemplare}")]
        public IActionResult GetPreparazioni(int idEsemplare)
        {
            return Ok(_repository.LeggiPreparazioni(idEsemplare));
        }

        //[Authorize]
        //[HttpGet("api/localitadanazione/{idNazione}")]
        //public IActionResult GetLocalitaDaNazione(int idNazione)
        //{
        //    return Ok(_repository.LeggiLocalitaDaNazione(idNazione));
        //}

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridanazione/{idNazione}")]
        public IActionResult GetElencoEsemplariDaNazione(int idNazione)
        {
            return Ok(_repository.LeggiElencoEsemplariDaNazione(idNazione));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridaregione/{idRegione}")]
        public IActionResult GetElencoEsemplariDaRegione(int idRegione)
        {
            return Ok(_repository.LeggiElencoEsemplariDaRegione(idRegione));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridaprovincia/{idProvincia}")]
        public IActionResult GetElencoEsemplariDaProvincia(int idProvincia)
        {
            return Ok(_repository.LeggiElencoEsemplariDaProvincia(idProvincia));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridacitta/{idCitta}")]
        public IActionResult GetElencoEsemplariDaCitta(int idCitta)
        {
            return Ok(_repository.LeggiElencoEsemplariDaCitta(idCitta));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridalocalita/{idLocalita}")]
        public IActionResult GetElencoEsemplariDaLocalita(int idLocalita)
        {
            return Ok(_repository.LeggiElencoEsemplariDaLocalita(idLocalita));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridaraccoglitore/{idRaccoglitore}")]
        public IActionResult GetElencoEsemplariDaRaccoglitore(int idRaccoglitore)
        {
            return Ok(_repository.LeggiElencoEsemplariDaRaccoglitore(idRaccoglitore));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridasala/{idSala}")]
        public IActionResult GetElencoEsemplariDaSala(int idSala)
        {
            return Ok(_repository.LeggiElencoEsemplariDaSala(idSala));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridaarmadio/{idArmadio}")]
        public IActionResult GetElencoEsemplariDaArmadio(int idArmadio)
        {
            return Ok(_repository.LeggiElencoEsemplariDaArmadio(idArmadio));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridacassetto/{idCassetto}")]
        public IActionResult GetElencoEsemplariDaCassetto(int idCassetto)
        {
            return Ok(_repository.LeggiElencoEsemplariDaCassetto(idCassetto));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridavassoio/{idVassoio}")]
        public IActionResult GetElencoEsemplariDaVassoio(int idVassoio)
        {
            return Ok(_repository.LeggiElencoEsemplariDaVassoio(idVassoio));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridaspedizione/{idSpedizione}")]
        public IActionResult GetElencoEsemplariDaSpedizione(int idSpedizione)
        {
            return Ok(_repository.LeggiElencoEsemplariDaSpedizione(idSpedizione));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridacollezione/{idCollezione}")]
        public IActionResult GetElencoEsemplariDaCollezione(int idCollezione)
        {
            return Ok(_repository.LeggiElencoEsemplariDaCollezione(idCollezione));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridadatada/{dataDa}")]
        public IActionResult GetElencoEsemplariDaDataDa(string dataDa)
        {
            return Ok(_repository.LeggiElencoEsemplariDaDataDa(dataDa));
        }

        [Authorize(Policy = "VisualizzaElencoEsemplari")]
        [HttpGet("api/elencoesemplaridadataa/{dataA}")]
        public IActionResult GetElencoEsemplariDaDataA(string dataA)
        {
            return Ok(_repository.LeggiElencoEsemplariDaDataA(dataA));
        }

    }
}
