// ImmaginiRepository.cs
//
// Metodi che implementano le query relative alle immagini sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class ImmaginiRepository : IImmaginiRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<ImmaginiRepository> _log;
        private IStringLocalizer<ImmaginiRepository> _localizzatore;
        private OpzioniImmagini _opzioni;
        private IHostingEnvironment _ambiente;

        public ImmaginiRepository(PaperoDBContext contesto,
                                ILogger<ImmaginiRepository> log,
                                IStringLocalizer<ImmaginiRepository> localizzatore,
                                IOptions<OpzioniImmagini> opzioni,
                                IHostingEnvironment ambiente)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
            _opzioni = opzioni.Value;
            _ambiente = ambiente;
        }

        public IEnumerable<Immagini> LeggiImmagini()
        {
            return _contesto.Immagini
                .OrderBy(immagine => immagine.Id)
                .ToList();
        }

        public IEnumerable<Immagini> LeggiImmagini(int idImmagine)
        {
            return _contesto.Immagini
                .Where(immagine => immagine.Id == idImmagine)
                .OrderBy(immagine => immagine.Id)
                .ToList();
        }

        public void PostImmagine(Immagini immagine)
        {
            try
            {
                _contesto.Add(immagine);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void CancellaImmagine(int idImmagine)
        {
            var URL = _contesto.Immagini.Single(immagine => immagine.Id == idImmagine).URL;
            var nomeFileFisico = idImmagine.ToString() + "_" + URL;
            var uploads = Path.Combine(_ambiente.WebRootPath, _opzioni.PercorsoUpload); // Percorso fisico dove vengono caricati i file (di default "img/esemplari")

            var file = new FileInfo(Path.Combine(uploads, nomeFileFisico));

            if (file.Exists)
            {
                file.Delete();
                _contesto.Immagini
                    .RemoveRange(_contesto.Immagini.Where(immagine => immagine.Id == idImmagine));
            }
        }
    }
}
