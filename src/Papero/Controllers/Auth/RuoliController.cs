using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class RuoliController : Controller
    {
        private IAuthRepository _repository;
        private IPaperoRepository _repositoryComune;

        public RuoliController(IAuthRepository repository, IPaperoRepository repositoryComune)
        {
            _repository = repository;
            _repositoryComune = repositoryComune;
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpGet("api/ruoli")]
        public IActionResult GetRuoli()
        {
            return Ok(_repository.LeggiRuoli());
        }

        [Authorize(Policy = "GestioneUtenti")]
        [HttpGet("api/policies")]
        public IActionResult GetPolicies()
        {
            return Ok(_repository.LeggiPolicies().Result);
        }
    }
}
