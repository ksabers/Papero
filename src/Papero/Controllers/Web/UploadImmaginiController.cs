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
        private IPaperoRepository _repositoryComune;
        private ILogger<UploadImmaginiController> _logger;
        private IHostingEnvironment _ambiente;
        private IImmaginiRepository _repositoryImmagini;

        public UploadImmaginiController(IStringLocalizer<UploadImmaginiController> localizzatore,   // Costruttore della classe, con le dependency injection di: 1)supporto per la localizzazione
                                IPaperoRepository repositoryComune,                       // 2) Repository delle query generiche
                                IImmaginiRepository repositoryImmagini,  // 3) Repository delle query relative alle immagini
                                ILogger<UploadImmaginiController> logger, // 4) Supporto per i log
                                IHostingEnvironment ambiente)                   
        {
            _localizzatore = localizzatore;
            _repositoryComune = repositoryComune;
            _repositoryImmagini = repositoryImmagini;
            _logger = logger;
            _ambiente = ambiente;
        }


        public async Task<IActionResult> Upload()
        {
            var elencoFiles = Request.Form.Files;  // Elenco dei file che sono stati caricati contemporaneamente

            var uploads = Path.Combine(_ambiente.WebRootPath, "img/esemplari"); // Percorso fisico dove verranno caricati i file

            var idEsemplare = 0;
            Int32.TryParse(Request.Form["idEsemplare"], out idEsemplare);  // ID dell'esemplare a cui associare i file

            if (elencoFiles.Count > 0)  // Procedi solo se sono stati caricati files
            {
                for (int i = 0; i < elencoFiles.Count; i++)          // Per ciascun file caricato...
                {
                    var nomeFile = elencoFiles[i].FileName;          // 1) estrae il nome

                    var didascalia = Request.Form["didascalia"];     // 2) estrai la didascalia

                    var immagine = new Immagini();                   // 3) crea un oggetto Immagini
                    immagine.EsemplareId = idEsemplare;              //    e lo riempie con i dati dell'immagine
                    immagine.Didascalia = didascalia;
                    immagine.URL = nomeFile;

                    _repositoryImmagini.PostImmagine(immagine);      //  4) Inserisce l'oggetto immagine nel database

                    if (await _repositoryComune.SalvaModifiche())
                    {
                        var stringaIdImmagine = immagine.Id.ToString();  // 5) Recupera l'ID dell'oggetto immagine appena inserito nel database

                        var nomeFileFisico = stringaIdImmagine + "_" + nomeFile;  // 6) Usa l'ID recuperato per creare il nome con cui verrà salvato il file 
                        using (var fileStream = new FileStream(Path.Combine(uploads, nomeFileFisico), FileMode.Create))
                            {
                                await elencoFiles[i].CopyToAsync(fileStream);  // 7) Finalmente salva il file immagine nella directory del filesystem
                            }
                    }
                }

            }
            return RedirectToAction("ElencoEsemplari", "Papero");
        }

    }
}
