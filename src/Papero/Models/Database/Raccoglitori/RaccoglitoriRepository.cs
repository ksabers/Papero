// RaccoglitoriRepository.cs
//
// Metodi che implementano le query relative ai Raccoglitori sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Papero.Models
{
    public class RaccoglitoriRepository : IRaccoglitoriRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<RaccoglitoriRepository> _log;
        private IStringLocalizer<RaccoglitoriRepository> _localizzatore;

        public RaccoglitoriRepository(PaperoDBContext contesto,
                                ILogger<RaccoglitoriRepository> log,
                                IStringLocalizer<RaccoglitoriRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<Raccoglitori> LeggiRaccoglitori()
        {
            return _contesto.Raccoglitori
                .OrderBy(raccoglitore => raccoglitore.Raccoglitore)
                .ToList();
        }

        public IEnumerable<Raccoglitori> LeggiRaccoglitori(int idRaccoglitore)
        {
            return _contesto.Raccoglitori
                .Where(raccoglitore => raccoglitore.Id == idRaccoglitore)
                .OrderBy(raccoglitore => raccoglitore.Raccoglitore)
                .ToList();
        }

        public void PostRaccoglitore(Raccoglitori raccoglitore)
        {
            try
            {
                _contesto.Add(raccoglitore);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutRaccoglitore(Raccoglitori raccoglitore)
        {
            try
            {
                _contesto.Update(raccoglitore);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void CancellaRaccoglitore(int idRaccoglitore)
        {
            _contesto.Raccoglitori
                .RemoveRange(_contesto.Raccoglitori.Where(raccoglitore => raccoglitore.Id == idRaccoglitore));
        }
    }
}
