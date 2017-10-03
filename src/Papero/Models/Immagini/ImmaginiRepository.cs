// ImmaginiRepository.cs
//
// Metodi che implementano le query relative alle immagini sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Papero.Models
{
    public class ImmaginiRepository : IImmaginiRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<ImmaginiRepository> _log;
        private IStringLocalizer<ImmaginiRepository> _localizzatore;

        public ImmaginiRepository(PaperoDBContext contesto,
                                ILogger<ImmaginiRepository> log,
                                IStringLocalizer<ImmaginiRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
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

        //public void PostCollezione(Collezioni collezione)
        //{
        //    try
        //    {
        //        _contesto.Add(collezione);
        //    }
        //    catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
        //    {
        //    }
        //}

        //public void PutCollezione(Collezioni collezione)
        //{
        //    try
        //    {
        //        _contesto.Update(collezione);
        //    }
        //    catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
        //    {
        //    }
        //}

        //public void CancellaCollezione(int idCollezione)
        //{
        //    _contesto.Collezioni
        //        .RemoveRange(_contesto.Collezioni.Where(collezione => collezione.Id == idCollezione));
        //}
    }
}
