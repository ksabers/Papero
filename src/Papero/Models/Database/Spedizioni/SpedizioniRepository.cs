// SpedizioniRepository.cs
//
// Metodi che implementano le query relative alle spedizioni sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Papero.Models
{
    public class SpedizioniRepository : ISpedizioniRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<SpedizioniRepository> _log;
        private IStringLocalizer<SpedizioniRepository> _localizzatore;

        public SpedizioniRepository(PaperoDBContext contesto,
                                ILogger<SpedizioniRepository> log,
                                IStringLocalizer<SpedizioniRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<Spedizioni> LeggiSpedizioni()
        {
            return _contesto.Spedizioni
                .OrderBy(spedizione => spedizione.Spedizione)
                .ToList();
        }

        public IEnumerable<Spedizioni> LeggiSpedizioni(int idSpedizione)
        {
            return _contesto.Spedizioni
                .Where(spedizione => spedizione.Id == idSpedizione)
                .OrderBy(spedizione => spedizione.Spedizione)
                .ToList();
        }

        public void PostSpedizione(Spedizioni spedizione)
        {
            try
            {
                _contesto.Add(spedizione);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutSpedizione(Spedizioni spedizione)
        {
            try
            {
                _contesto.Update(spedizione);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void CancellaSpedizione(int idSpedizione)
        {
            _contesto.Spedizioni
                .RemoveRange(_contesto.Spedizioni.Where(spedizione => spedizione.Id == idSpedizione));
        }
    }
}
