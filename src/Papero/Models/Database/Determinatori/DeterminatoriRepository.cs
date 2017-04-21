// DeterminatoriRepository.cs
//
// Metodi che implementano le query relative ai Determinatori sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Papero.Models
{
    public class DeterminatoriRepository : IDeterminatoriRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<DeterminatoriRepository> _log;
        private IStringLocalizer<DeterminatoriRepository> _localizzatore;

        public DeterminatoriRepository(PaperoDBContext contesto,
                                ILogger<DeterminatoriRepository> log,
                                IStringLocalizer<DeterminatoriRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<Determinatori> LeggiDeterminatori()
        {
            return _contesto.Determinatori
                .OrderBy(determinatore => determinatore.Cognome)
                    .ThenBy(determinatore => determinatore.Nome)
                .ToList();
        }

        public IEnumerable<Determinatori> LeggiDeterminatori(int idDeterminatore)
        {
            return _contesto.Determinatori
                .Where(determinatore => determinatore.Id == idDeterminatore)
                .OrderBy(determinatore => determinatore.Cognome)
                    .ThenBy(determinatore => determinatore.Nome)
                .ToList();
        }

        public IEnumerable<Determinatori> LeggiDeterminatoriDaEsemplare(int idEsemplare)
        {
            return _contesto.Determinazioni
                .Where(determinazione => determinazione.EsemplareId == idEsemplare)
                .OrderBy(determinazione => determinazione.Ordinamento)
                .Select(determinazione => new Determinatori
                {
                    Id = determinazione.Determinatore.Id,
                    Nome = determinazione.Determinatore.Nome,
                    Cognome = determinazione.Determinatore.Cognome
                })
                .ToList();
        }

        public void PostDeterminatore(Determinatori determinatore)
        {
            try
            {
                _contesto.Add(determinatore);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutDeterminatore(Determinatori determinatore)
        {
            try
            {
                _contesto.Update(determinatore);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void CancellaDeterminatore(int idDeterminatore)
        {
            _contesto.Determinatori
                .RemoveRange(_contesto.Determinatori.Where(determinatore => determinatore.Id == idDeterminatore));
        }
    }
}
