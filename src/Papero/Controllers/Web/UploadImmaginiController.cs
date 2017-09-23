//  UploadImmaginiController.cs
//


using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.Extensions.Localization;
using Papero.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Papero.ViewModels;
using AutoMapper;
using Papero.Funzioni;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace Papero.Controllers
{
    public class UploadImmaginiController : Controller
    {
        private IStringLocalizer<UploadImmaginiController> _localizzatore;  // dichiarazione dei campi privati che incapsulano gli oggetti passati per dependency injection
        private IPaperoRepository _repository;
        private ILogger<UploadImmaginiController> _logger;
        private IHostingEnvironment _ambiente;

        public UploadImmaginiController(IStringLocalizer<UploadImmaginiController> localizzatore,   // Costruttore della classe, con le dependency injection di: 1)supporto per la localizzazione
                                IPaperoRepository repository,                       // 2) Repository delle query nel database
                                ILogger<UploadImmaginiController> logger,
                                IHostingEnvironment ambiente)                   // 3) Supporto per i log
        {
            _localizzatore = localizzatore;
            _repository = repository;
            _logger = logger;
            _ambiente = ambiente;
        }


        public async Task<IActionResult> Upload(IFormFile file)
        {

            var uploads = Path.Combine(_ambiente.WebRootPath, "img/esemplari");
            if (file.Length > 0)
            {
                using (var fileStream = new FileStream(Path.Combine(uploads, file.FileName), FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
            }
            return RedirectToAction("ElencoEsemplari", "Papero");
        }

    }
}
