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

        #region Get

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

        public IEnumerable<Armadi> LeggiArmadi()
        {
            return _contesto.Armadi
                .Include(armadio => armadio.Cassetti)
                    .ThenInclude(cassetto => cassetto.Vassoi)
                .OrderBy(armadio => armadio.Armadio)
                .ToList();
        }

        public IEnumerable<Armadi> LeggiArmadi(int idArmadio)
        {
            return _contesto.Armadi
                .Where(armadio => armadio.Id == idArmadio)
                .Include(armadio => armadio.Cassetti)
                    .ThenInclude(cassetto => cassetto.Vassoi)
                .OrderBy(armadio => armadio.Armadio)
                .ToList();
        }

        public IEnumerable<Cassetti> LeggiCassetti()
        {
            return _contesto.Cassetti
                .Include(cassetto => cassetto.Vassoi)
                .OrderBy(cassetto => cassetto.Cassetto)
                .ToList();
        }

        public IEnumerable<Cassetti> LeggiCassetti(int idCassetto)
        {
            return _contesto.Cassetti
                .Where(cassetto => cassetto.Id == idCassetto)
                .Include(cassetto => cassetto.Vassoi)
                .OrderBy(cassetto => cassetto.Cassetto)
                .ToList();
        }

        public IEnumerable<Vassoi> LeggiVassoi()
        {
            return _contesto.Vassoi
                .Include(vassoio => vassoio.Preparati)
                .OrderBy(vassoio => vassoio.Vassoio)
                .ToList();
        }

        public IEnumerable<Vassoi> LeggiVassoi(int idVassoio)
        {
            return _contesto.Vassoi
                .Include(vassoio => vassoio.Preparati)
                .Where(vassoio => vassoio.Id == idVassoio)
                .OrderBy(vassoio => vassoio.Vassoio)
                .ToList();
        }

        #endregion

        #region Post

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

        public void PostArmadio(Armadi armadio)
        {
            try
            {
                _contesto.Add(armadio);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostCassetto(Cassetti cassetto)
        {
            try
            {
                _contesto.Add(cassetto);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostVassoio(Vassoi vassoio)
        {
            try
            {
                _contesto.Add(vassoio);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        #endregion

        #region Put

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

        public void PutArmadio(Armadi armadio)
        {
            try
            {
                _contesto.Update(armadio);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutCassetto(Cassetti cassetto)
        {
            try
            {
                _contesto.Update(cassetto);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutVassoio(Vassoi vassoio)
        {
            try
            {
                _contesto.Update(vassoio);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        #endregion

        #region Delete

        public void CancellaSala(int idSala)
        {
            _contesto.Sale
                .RemoveRange(_contesto.Sale.Where(sala => sala.Id == idSala));
        }

        public void CancellaArmadio(int idArmadio)
        {
            _contesto.Armadi
                .RemoveRange(_contesto.Armadi.Where(armadio => armadio.Id == idArmadio));
        }

        public void CancellaCassetto(int idCassetto)
        {
            _contesto.Cassetti
                .RemoveRange(_contesto.Cassetti.Where(cassetto => cassetto.Id == idCassetto));
        }

        public void CancellaVassoio(int idVassoio)
        {
            _contesto.Vassoi
                .RemoveRange(_contesto.Vassoi.Where(vassoio => vassoio.Id == idVassoio));
        }

        #endregion

        #region Navigazione Inversa

        public int IdVassoioIndeterminatoDaSala(int idSala)
        {
            return _contesto.Vassoi
                .Single(vassoio =>
                        vassoio.Vassoio == "-" &&
                        vassoio.Cassetto.Cassetto == "-" &&
                        vassoio.Cassetto.Armadio.Armadio == "-" &&
                        vassoio.Cassetto.Armadio.SalaId == idSala)
                .Id;
        }

        public int IdVassoioIndeterminatoDaArmadio(int idArmadio)
        {
            return _contesto.Vassoi
                .Single(vassoio =>
                        vassoio.Vassoio == "-" &&
                        vassoio.Cassetto.Cassetto == "-" &&
                        vassoio.Cassetto.ArmadioId == idArmadio)
                .Id;
        }

        public int IdVassoioIndeterminatoDaCassetto(int idCassetto)
        {
            return _contesto.Vassoi
                .Single(vassoio =>
                        vassoio.Vassoio == "-" &&
                        vassoio.CassettoId == idCassetto)
                .Id;
        }

        public int IdCassettoIndeterminatoDaSala(int idSala)
        {
            return _contesto.Cassetti
                .Single(cassetto =>
                        cassetto.Cassetto == "-" &&
                        cassetto.Armadio.Armadio == "-" &&
                        cassetto.Armadio.SalaId == idSala)
                .Id;
        }

        public int IdCassettoIndeterminatoDaArmadio(int idArmadio)
        {
            return _contesto.Cassetti
                .Single(cassetto =>
                        cassetto.Cassetto == "-" &&
                        cassetto.ArmadioId == idArmadio)
                .Id;
        }

        public int IdArmadioIndeterminatoDaSala(int idSala)
        {
            return _contesto.Armadi
                .Single(armadio =>
                        armadio.Armadio == "-" &&
                        armadio.SalaId == idSala)
                .Id;
        }


        #endregion



    }
}
