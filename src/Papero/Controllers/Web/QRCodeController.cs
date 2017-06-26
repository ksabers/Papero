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
using Papero.Funzioni;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Papero.Controllers
{
    public class QRCodeController : Controller
    {
        private IStringLocalizer<QRCodeController> _localizzatore;  // dichiarazione dei campi privati che incapsulano gli oggetti passati per dependency injection
        private IPaperoRepository _repository;
        private ILogger<QRCodeController> _logger;
        private OpzioniQRCode _opzioni;

        public QRCodeController(IStringLocalizer<QRCodeController> localizzatore,   // Costruttore della classe, con le dependency injection di: 1)supporto per la localizzazione
                                IPaperoRepository repository,                       // 2) Repository delle query nel database
                                ILogger<QRCodeController> logger,                   // 3) Supporto per i log
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

            vista.urlQRCode = _opzioni.URLScheda + "/?size=" + _opzioni.Formati[formato].Pixel + "x" + _opzioni.Formati[formato].Pixel + "&data=";

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

        [Authorize(Policy = "VisualizzaQRCodeScheda")]
        public IActionResult ListaQRCodeScheda(string arrayIdEsemplariQRCode, string formatoQRCode)
        {
            var elencoEsemplari = JsonConvert.DeserializeObject<int[]>("[" + arrayIdEsemplariQRCode + "]");

            var esemplare = new Esemplari();

            List<QRCodeListaViewModel> modello = new List<QRCodeListaViewModel>();

            //modello.formato = formatoQRCode;

            //modello.urlQRCode = _opzioni.URLScheda + "/?size=" + _opzioni.Formati[Int32.Parse(formatoQRCode)].Pixel + "x" + _opzioni.Formati[Int32.Parse(formatoQRCode)].Pixel + "&data=";

            for (int i = 0; i < elencoEsemplari.Length; i++)
            {
                esemplare = _repository.LeggiEsemplare(elencoEsemplari[i]);

                var esemplareDaAggiungere = new QRCodeListaViewModel();

                esemplareDaAggiungere.Id = esemplare.Id;

                esemplareDaAggiungere.urlQRCode = _opzioni.URLScheda + "/?size=" + _opzioni.Formati[Int32.Parse(formatoQRCode)].Pixel + "x" + _opzioni.Formati[Int32.Parse(formatoQRCode)].Pixel + "&data=";

                esemplareDaAggiungere.formato = formatoQRCode;

                esemplareDaAggiungere.MSNG = esemplare.Msng;

                esemplareDaAggiungere.testoQRCode = System.Text.Encodings.Web.UrlEncoder.Default.Encode(
                    funzioni.FormattaNomeScientifico(esemplare.Sottospecie.Specie.Genere.Nome, 
                                                     esemplare.Sottospecie.Specie.Nome, 
                                                     esemplare.Sottospecie.Nome) + Environment.NewLine +
                    esemplare.Sottospecie.ElencoAutori + Environment.NewLine +
                    Environment.NewLine +
                    _localizzatore["MSNG"] + ": " + esemplare.Msng + Environment.NewLine +
                    _localizzatore["Sesso"] + ": " + _localizzatore[esemplare.Sesso.Sesso] + Environment.NewLine +
                    _localizzatore["Lettera"] + ": " + esemplare.LetteraEsemplare + Environment.NewLine +
                    _localizzatore["Numero"] + ": " + esemplare.NumeroEsemplare + Environment.NewLine +
                    _localizzatore["Tipo"] + ": " + _localizzatore[esemplare.Tipo.Tipo] + Environment.NewLine +
                    _localizzatore["Aberrazione"] + ": " + _localizzatore[esemplare.Aberrazione.Aberrazione]
                    );

                modello.Add(esemplareDaAggiungere);
            }

            return View(modello);
        }

    }
}
