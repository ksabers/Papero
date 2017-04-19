// CollezioniRepository.cs
//
// Metodi che implementano le query relative alle collezioni sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Papero.Models
{
    public class CollezioniRepository : ICollezioniRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<CollezioniRepository> _log;
        private IStringLocalizer<CollezioniRepository> _localizzatore;

        public CollezioniRepository(PaperoDBContext contesto,
                                ILogger<CollezioniRepository> log,
                                IStringLocalizer<CollezioniRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<Collezioni> LeggiCollezioni()
        {
            return _contesto.Collezioni
                .OrderBy(collezione => collezione.Collezione)
                .ToList();
        }

        public void PostCollezione(Collezioni collezione)
        {
            try
            {
                _contesto.Add(collezione);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutCollezione(Collezioni collezione)
        {
            try
            {
                _contesto.Update(collezione);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void CancellaCollezione(int idCollezione)
        {
            _contesto.Collezioni
                .RemoveRange(_contesto.Collezioni.Where(collezione => collezione.Id == idCollezione));
        }
    }
}
