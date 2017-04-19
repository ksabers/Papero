// ClassificatoriRepository.cs
//
// Metodi che implementano le query relative ai classificatori sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Papero.Models
{
    public class ClassificatoriRepository : IClassificatoriRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<ClassificatoriRepository> _log;
        private IStringLocalizer<ClassificatoriRepository> _localizzatore;

        public ClassificatoriRepository(PaperoDBContext contesto,
                                ILogger<ClassificatoriRepository> log,
                                IStringLocalizer<ClassificatoriRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<Classificatori> LeggiClassificatori()
        {
            return _contesto.Classificatori
                    .OrderBy(classificatore => classificatore.Classificatore)
                    .ToList();
        }

        public IEnumerable<Classificatori> LeggiClassificatori(int idClassificatore)
        {
            return _contesto.Classificatori
                .Where(classificatore => classificatore.Id == idClassificatore)
                    .OrderBy(classificatore => classificatore.Classificatore)
                    .ToList();
        }

        public void PostClassificatore(Classificatori classificatore)
        {
            try
            {
                _contesto.Add(classificatore);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutClassificatore(Classificatori classificatore)
        {
            try
            {
                _contesto.Update(classificatore);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void CancellaClassificatore(int idClassificatore)
        {
            _contesto.Classificatori
                .RemoveRange(_contesto.Classificatori.Where(classificatore => classificatore.Id == idClassificatore));
        }
    }
}
