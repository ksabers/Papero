//  QRCodeController.cs
//
//  Controller principale dell'applicazione
//  Gestisce le azioni principali selezionabili nei menu
//  (tranne login e logout che sono gestite da AuthController.cs)

using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http;
using Papero.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Papero.ViewModels;
using AutoMapper;


namespace Papero.Controllers
{
    public class QRCodeController : Controller
    {
        private IStringLocalizer<PaperoController> _localizzatore;  // dichiarazione dei campi privati che incapsulano gli oggetti passati per dependency injection
        private IPaperoRepository _repository;
        private ILogger<PaperoController> _logger;

        public QRCodeController(IStringLocalizer<PaperoController> localizzatore,   // Costruttore della classe, con le dependency injection di: 1)supporto per la localizzazione
                                IPaperoRepository repository,                       // 2) Repository delle query nel database
                                ILogger<PaperoController> logger)                   // 3) Supporto per i log

        {
            _localizzatore = localizzatore;
            _repository = repository;
            _logger = logger;
        }

        [Authorize(Policy = "VisualizzaQRCodeScheda")]
        public IActionResult QRCodeScheda(int id)
        {
                ViewBag.trovato = true;                                        // Flag che dice alla vista che l'ID è valido
                var modello = _repository.LeggiEsemplare(id);                  // Legge tutti i dati dell'esemplare
                var vista = Mapper.Map<QRCodeViewModel>(modello);              // Mappa i dati dell'esemplare sul ViewModel che usiamo per comunicare con la vista

            vista.urlQRCode = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";
            var testoQRCode = System.Text.Encodings.Web.UrlEncoder.Default.Encode(
                modello.Sottospecie.Specie.Genere.Nome + " " + modello.Sottospecie.Specie.Nome + " " + (modello.Sottospecie.Nome == "-" ? "" : modello.Sottospecie.Nome) +
                Environment.NewLine +
                modello.Sottospecie.ElencoAutori + Environment.NewLine +
                Environment.NewLine +
                _localizzatore["Sesso"] + ": " + _localizzatore[modello.Sesso.Sesso] + Environment.NewLine +
                _localizzatore["Lettera"] + ": " + modello.LetteraEsemplare + Environment.NewLine +
                _localizzatore["Numero"] + ": " + modello.NumeroEsemplare + Environment.NewLine +
                _localizzatore["Tipo"] + ": " + _localizzatore[modello.Tipo.Tipo] + Environment.NewLine +
                _localizzatore["Aberrazione"] + ": " + _localizzatore[modello.Aberrazione.Aberrazione]
                );

            if (testoQRCode.Length < 4000)
            {
                vista.testoQRCode = testoQRCode;
            }
            else
            {
                vista.testoQRCode = testoQRCode.Substring(0, 4000);
            }
                return View(vista);        // Restituisce la vista di dettaglio passandole il ViewModel riempito di dati   
        }

    }
}
