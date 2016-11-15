using Microsoft.AspNetCore.Mvc;
using Papero.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class FamiglieController : Controller
    {
        private IPaperoRepository _repository;

        public FamiglieController(IPaperoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("api/famiglie")]
        public IActionResult Get()
        {
            return Ok(_repository.LeggiFamiglie());
        }
    }
}
