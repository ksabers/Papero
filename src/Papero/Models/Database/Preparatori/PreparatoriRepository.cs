// PreparatoriRepository.cs
//
// Metodi che implementano le query relative ai Preparatori sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Papero.Models
{
    public class PreparatoriRepository : IPreparatoriRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<PreparatoriRepository> _log;
        private IStringLocalizer<PreparatoriRepository> _localizzatore;

        public PreparatoriRepository(PaperoDBContext contesto,
                                ILogger<PreparatoriRepository> log,
                                IStringLocalizer<PreparatoriRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<Preparatori> LeggiPreparatori()
        {
            return _contesto.Preparatori
                .OrderBy(preparatore => preparatore.Cognome)
                    .ThenBy(preparatore => preparatore.Nome)
                .ToList();
        }

        public IEnumerable<Preparatori> LeggiPreparatori(int idPreparatore)
        {
            return _contesto.Preparatori
                .Where(preparatore => preparatore.Id == idPreparatore)
                .OrderBy(preparatore => preparatore.Cognome)
                    .ThenBy(preparatore => preparatore.Nome)
                .ToList();
        }

        public IEnumerable<Preparatori> LeggiPreparatoriDaEsemplare(int idEsemplare)
        {
            return _contesto.Preparazioni
                .Where(preparazione => preparazione.EsemplareId == idEsemplare)
                .OrderBy(preparazione => preparazione.Ordinamento)
                .Select(preparazione => new Preparatori
                {
                    Id = preparazione.Preparatore.Id,
                    Nome = preparazione.Preparatore.Nome,
                    Cognome = preparazione.Preparatore.Cognome
                })
                .ToList();
        }

        public void PostPreparatore(Preparatori preparatore)
        {
            try
            {
                _contesto.Add(preparatore);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutPreparatore(Preparatori preparatore)
        {
            try
            {
                _contesto.Update(preparatore);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void CancellaPreparatore(int idPreparatore)
        {
            _contesto.Preparatori
                .RemoveRange(_contesto.Preparatori.Where(preparatore => preparatore.Id == idPreparatore));
        }
    }
}
