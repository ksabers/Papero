// CollocazioneRepository.cs
//
// Metodi che implementano le query relative alla collocazione sul database
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
    public class CollocazioneRepository : ICollocazioneRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<CollocazioneRepository> _log;
        private IStringLocalizer<CollocazioneRepository> _localizzatore;

        public CollocazioneRepository(PaperoDBContext contesto,
                                      ILogger<CollocazioneRepository> log,
                                      IStringLocalizer<CollocazioneRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<Sale> LeggiSale()
        {
            return _contesto.Sale
                .Include(sala => sala.Armadi)
                    .ThenInclude(armadio => armadio.Cassetti)
                        .ThenInclude(cassetto => cassetto.Vassoi)
                .OrderBy(sala => sala.Sala)
                .ToList();
        }

        public IEnumerable<Sale> LeggiSale(int idSala)
        {
            return _contesto.Sale
                .Where(sala => sala.Id == idSala)
                .Include(sala => sala.Armadi)
                    .ThenInclude(armadio => armadio.Cassetti)
                        .ThenInclude(cassetto => cassetto.Vassoi)
                .OrderBy(sala => sala.Sala)
                .ToList();
        }

        public void PostSala(Sale sala)
        {
            try
            {
                _contesto.Add(sala);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutSala(Sale sala)
        {
            try
            {
                _contesto.Update(sala);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void CancellaSala(int idSala)
        {
            _contesto.Sale
                .RemoveRange(_contesto.Sale.Where(sala => sala.Id == idSala));
        }
    }
}
