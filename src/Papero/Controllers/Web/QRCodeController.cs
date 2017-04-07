﻿//  QRCodeController.cs
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
using Papero.Funzioni;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Papero.Controllers
{
    public class QRCodeController : Controller
    {
        private IStringLocalizer<PaperoController> _localizzatore;  // dichiarazione dei campi privati che incapsulano gli oggetti passati per dependency injection
        private IPaperoRepository _repository;
        private ILogger<PaperoController> _logger;
        private OpzioniQRCode _opzioni;

        public QRCodeController(IStringLocalizer<PaperoController> localizzatore,   // Costruttore della classe, con le dependency injection di: 1)supporto per la localizzazione
                                IPaperoRepository repository,                       // 2) Repository delle query nel database
                                ILogger<PaperoController> logger,                   // 3) Supporto per i log
                                IOptions<OpzioniQRCode> opzioni)                   // 4) Oggetto che mappa le variabili di configurazione della sezione QRCode
        {
            _localizzatore = localizzatore;
            _repository = repository;
            _logger = logger;
            _opzioni = opzioni.Value;
        }

        /// <summary>
        /// Visualizza la pagina con il cartellino QRCode contenente i dati dell'esemplare 
        /// </summary>
        /// <param name="id">ID dell'esemplare richiesto</param>
        /// <returns></returns>
        [Authorize(Policy = "VisualizzaQRCodeScheda")]
        public IActionResult QRCodeScheda(int id, int formato)
        {
                ViewBag.trovato = true;                                        // Flag che dice alla vista che l'ID è valido
                var modello = _repository.LeggiEsemplare(id);                  // Legge tutti i dati dell'esemplare
                var vista = Mapper.Map<QRCodeViewModel>(modello);              // Mappa i dati dell'esemplare sul ViewModel che usiamo per comunicare con la vista

            //vista.urlQRCode = "https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=";

            vista.urlQRCode = _opzioni.URLScheda + "/?size=" + _opzioni.Formati[formato].Pixel + "x" + _opzioni.Formati[formato].Pixel + "&data=";

            //vista.urlQRCode = _opzioni.URLScheda + "/?size=80x80&data=";

            var testoQRCode = System.Text.Encodings.Web.UrlEncoder.Default.Encode(  // La stringa viene url-encodata prima di essere aggiunta all'URL 
                funzioni.FormattaNomeScientifico(modello.Sottospecie.Specie.Genere.Nome, modello.Sottospecie.Specie.Nome, modello.Sottospecie.Nome) +
                Environment.NewLine +
                modello.Sottospecie.ElencoAutori + Environment.NewLine +
                Environment.NewLine +
                _localizzatore["Sesso"] + ": " + _localizzatore[modello.Sesso.Sesso] + Environment.NewLine +
                _localizzatore["Lettera"] + ": " + modello.LetteraEsemplare + Environment.NewLine +
                _localizzatore["Numero"] + ": " + modello.NumeroEsemplare + Environment.NewLine +
                _localizzatore["Tipo"] + ": " + _localizzatore[modello.Tipo.Tipo] + Environment.NewLine +
                _localizzatore["Aberrazione"] + ": " + _localizzatore[modello.Aberrazione.Aberrazione]
                );

            //var testoQRCode = "http://localhost:55072/Papero/DettaglioEsemplare/" + modello.Id;

            if (testoQRCode.Length < _opzioni.CaratteriMassimi)
            {
                vista.testoQRCode = testoQRCode;
            }
            else
            {
                vista.testoQRCode = testoQRCode.Substring(0, _opzioni.CaratteriMassimi);
            }
                return View(vista);        // Restituisce la vista di dettaglio passandole il ViewModel riempito di dati   
        }

    }
}