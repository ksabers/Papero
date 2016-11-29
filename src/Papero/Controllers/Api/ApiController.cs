using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Papero.Models;

namespace Papero.Controllers
{
    public class ApiController : Controller
    {
        private IPaperoRepository _repository;

        public ApiController(IPaperoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("api/tassonomia")]
        public IActionResult Get()
        {
            return Ok(_repository.LeggiTassonomia());
        }


    }
}
