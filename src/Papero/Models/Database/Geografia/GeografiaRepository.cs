// GeografiaRepository.cs
//
// Metodi che implementano le query relative alla geografia sul database
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Papero.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Papero.Models
{
    public class GeografiaRepository : IGeografiaRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<GeografiaRepository> _log;
        private IStringLocalizer<GeografiaRepository> _localizzatore;

        public GeografiaRepository(PaperoDBContext contesto,
                                      ILogger<GeografiaRepository> log,
                                      IStringLocalizer<GeografiaRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        #region Get

        public IEnumerable<AlberoNazioneViewModel> LeggiGeografia()
        {
            return _contesto.Nazioni
                        .Include(nazione => nazione.Regioni)
                            .ThenInclude(regione => regione.Province)
                                .ThenInclude(provincia => provincia.Citta)
                                    .ThenInclude(citta => citta.Localita)
                .Select(nazione => new AlberoNazioneViewModel {
                    idNazione = nazione.Id,
                    Nome = nazione.Nazione,
                    Iso31661 = nazione.Iso31661,
                    Iso31661Alpha2 = nazione.Iso31661Alpha2,
                    Iso31661Alpha3 = nazione.Iso31661Alpha3,
                    Figli = nazione.Regioni.Select(regione => new AlberoRegioneViewModel {
                        idRegione = regione.Id,
                        Nome = regione.Regione,
                        Figli = regione.Province.Select(provincia => new AlberoProvinciaViewModel {
                            IdProvincia = provincia.Id,
                            Nome = provincia.Provincia,
                            SiglaProvincia = provincia.SiglaProvincia,
                            Figli = provincia.Citta.Select(citta => new AlberoCittaViewModel {
                                IdCitta = citta.Id,
                                Nome = citta.NomeCitta,
                                CodiceCatastale = citta.CodiceCatastale,
                                CodiceIstat = citta.CodiceIstat,
                                Figli = citta.Localita.Select(localita => new AlberoLocalitaViewModel {
                                    IdLocalita = localita.Id,
                                    Nome = localita.NomeLocalita,
                                    Latitudine = localita.Latitudine,
                                    Longitudine = localita.Longitudine
                                }).OrderBy(localita => localita.Nome)
                                  .ToList()})
                            .OrderBy(citta => citta.Nome)
                            .ToList()})
                        .OrderBy(provincia => provincia.Nome)
                        .ToList()})
                    .OrderBy(regione => regione.Nome)
                    .ToList()})
                .OrderBy(nazione => nazione.Nome)
                .ToList();
        }

        public IEnumerable<Nazioni> LeggiNazioni()
        {
            return _contesto.Nazioni
                .OrderBy(nazione => nazione.Nazione)
                    .Include(nazione => nazione.Regioni)
                .ToList();
        }

        public IEnumerable<Nazioni> LeggiNazioni(int idNazione)
        {
            return _contesto.Nazioni
                .Where(nazione => nazione.Id == idNazione)
                .OrderBy(nazione => nazione.Nazione)
                .ToList();
        }

        public IEnumerable<Regioni> LeggiRegioni()
        {
            return _contesto.Regioni
                .Include(regione => regione.Province)
                .OrderBy(regione => regione.Regione)
                .ToList();
        }

        public IEnumerable<Regioni> LeggiRegioni(int idRegione)
        {
            return _contesto.Regioni
                .Where(regione => regione.Id == idRegione)
                .Include(regione => regione.Province)
                .OrderBy(regione => regione.Regione)
                .ToList();
        }

        public IEnumerable<Province> LeggiProvince()
        {
            return _contesto.Province
                .Include(provincia => provincia.Citta)
                .OrderBy(provincia => provincia.Provincia)
                .ToList();
        }

        public IEnumerable<Province> LeggiProvince(int idProvincia)
        {
            return _contesto.Province
                .Where(provincia => provincia.Id == idProvincia)
                .Include(provincia => provincia.Citta)
                .OrderBy(provincia => provincia.Provincia)
                .ToList();
        }

        public IEnumerable<Citta> LeggiCitta()
        {
            return _contesto.Citta
                .Include(citta => citta.Localita)
                .OrderBy(citta => citta.NomeCitta)
                .ToList();
        }

        public IEnumerable<Citta> LeggiCitta(int idCitta)
        {
            return _contesto.Citta
                .Where(citta => citta.Id == idCitta)
                .Include(citta => citta.Localita)
                .OrderBy(citta => citta.NomeCitta)
                .ToList();
        }

        public IEnumerable<Localita> LeggiLocalita()
        {
            return _contesto.Localita
                .OrderBy(localita => localita.NomeLocalita)
                .ToList();
        }

        public IEnumerable<Localita> LeggiLocalita(int idLocalita)
        {
            return _contesto.Localita
                .Where(localita => localita.Id == idLocalita)
                .OrderBy(localita => localita.NomeLocalita)
                .ToList();
        }

        #endregion

        #region Post

        public void PostNazione(Nazioni nazione)
        {
            try
            {
                _contesto.Add(nazione);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostRegione(Regioni regione)
        {
            try
            {
                _contesto.Add(regione);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostProvincia(Province provincia)
        {
            try
            {
                _contesto.Add(provincia);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostCitta(Citta citta)
        {
            try
            {
                _contesto.Add(citta);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostLocalita(Localita localita)
        {
            try
            {
                _contesto.Add(localita);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        #endregion

        #region Put

        public void PutNazione(Nazioni nazione)
        {
            try
            {
                _contesto.Update(nazione);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutRegione(Regioni regione)
        {
            try
            {
                _contesto.Update(regione);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutProvincia(Province provincia)
        {
            try
            {
                _contesto.Update(provincia);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutCitta(Citta citta)
        {
            try
            {
                _contesto.Update(citta);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }
        public void PutLocalita(Localita localita)
        {
            try
            {
                _contesto.Update(localita);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }


        #endregion

        #region Delete

        public void CancellaNazione(int idNazione)
        {
            _contesto.Nazioni
                .RemoveRange(_contesto.Nazioni.Where(nazione => nazione.Id == idNazione));
        }

        public void CancellaRegione(int idRegione)
        {
            _contesto.Regioni
                .RemoveRange(_contesto.Regioni.Where(regione => regione.Id == idRegione));
        }

        public void CancellaProvincia(int idProvincia)
        {
            _contesto.Province
                .RemoveRange(_contesto.Province.Where(provincia => provincia.Id == idProvincia));
        }

        public void CancellaCitta(int idCitta)
        {
            _contesto.Citta
                .RemoveRange(_contesto.Citta.Where(citta => citta.Id == idCitta));
        }

        public void CancellaLocalita(int idLocalita)
        {
            _contesto.Localita
                .RemoveRange(_contesto.Localita.Where(localita => localita.Id == idLocalita));
        }

        #endregion

        #region Navigazione Inversa

        public int IdLocalitaIndeterminataDaNazione(int idNazione)
        {
            return _contesto.Localita
                .Single(localita =>
                        localita.NomeLocalita == "-" &&
                        localita.Citta.NomeCitta == "-" &&
                        localita.Citta.Provincia.Provincia == "-" &&
                        localita.Citta.Provincia.Regione.Regione == "-" &&
                        localita.Citta.Provincia.Regione.NazioneId == idNazione)
                .Id;
        }

        public int IdLocalitaIndeterminataDaRegione(int idRegione)
        {
            return _contesto.Localita
                .Single(localita =>
                        localita.NomeLocalita == "-" &&
                        localita.Citta.NomeCitta == "-" &&
                        localita.Citta.Provincia.Provincia == "-" &&
                        localita.Citta.Provincia.RegioneId == idRegione)
                .Id;
        }

        public int IdLocalitaIndeterminataDaProvincia(int idProvincia)
        {
            return _contesto.Localita
                .Single(localita =>
                        localita.NomeLocalita == "-" &&
                        localita.Citta.NomeCitta == "-" &&
                        localita.Citta.ProvinciaId == idProvincia)
                .Id;
        }

        public int IdLocalitaIndeterminataDaCitta(int idCitta)
        {
            return _contesto.Localita
                .Single(localita =>
                        localita.NomeLocalita == "-" &&
                        localita.CittaId == idCitta)
                .Id;
        }

        public int IdCittaIndeterminataDaNazione(int idNazione)
        {
            return _contesto.Citta
                .Single(citta =>
                        citta.NomeCitta == "-" &&
                        citta.Provincia.Provincia == "-" &&
                        citta.Provincia.Regione.Regione == "-" &&
                        citta.Provincia.Regione.NazioneId == idNazione)
                .Id;
        }

        public int IdCittaIndeterminataDaRegione(int idRegione)
        {
            return _contesto.Citta
                .Single(citta =>
                        citta.NomeCitta == "-" &&
                        citta.Provincia.Provincia == "-" &&
                        citta.Provincia.RegioneId == idRegione)
                .Id;
        }
        public int IdCittaIndeterminataDaProvincia(int idProvincia)
        {
            return _contesto.Citta
                .Single(citta =>
                        citta.NomeCitta == "-" &&
                        citta.ProvinciaId == idProvincia)
                .Id;
        }

        public int IdProvinciaIndeterminataDaNazione(int idNazione)
        {
            return _contesto.Province
                .Single(provincia =>
                        provincia.Provincia == "-" &&
                        provincia.Regione.Regione == "-" &&
                        provincia.Regione.NazioneId == idNazione)
                .Id;
        }

        public int IdProvinciaIndeterminataDaRegione(int idRegione)
        {
            return _contesto.Province
                .Single(provincia =>
                        provincia.Provincia == "-" &&
                        provincia.RegioneId == idRegione)
                .Id;
        }


        public int IdRegioneIndeterminataDaNazione(int idNazione)
        {
            return _contesto.Regioni
                .Single(regione =>
                        regione.Regione == "-" &&
                        regione.NazioneId == idNazione)
                .Id;
        }


        #endregion

    }
}
