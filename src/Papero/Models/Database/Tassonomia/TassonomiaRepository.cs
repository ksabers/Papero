// TassonomiaRepository.cs
//
// Metodi che implementano le query relative alla tassonomia sul database
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
    public class TassonomiaRepository : ITassonomiaRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<TassonomiaRepository> _log;
        private IStringLocalizer<TassonomiaRepository> _localizzatore;

        public TassonomiaRepository(PaperoDBContext contesto,
                                ILogger<TassonomiaRepository> log,
                                IStringLocalizer<TassonomiaRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<Famiglie> LeggiAlbero()
        {
            _log.LogInformation("Chiamata di _contesto.Famiglie.ToList() con Include e ThenInclude");

            return _contesto.Famiglie
                .Include(famiglia => famiglia.Figli)
                    .ThenInclude(sottofamiglia => sottofamiglia.Figli)
                        .ThenInclude(tribu => tribu.Figli)
                            .ThenInclude(genere => genere.Figli)
                                .ThenInclude(specie => specie.Figli)
                .Select(famiglia => new Famiglie                     //  La proiezione in una nuova .Select serve per poter fare l'.OrderBy
                {                                                    //  perché Entity Framework non permette di fare, ad esempio:
                    Id = famiglia.Id,                                //  .Include(famiglia => famiglia.Figli.OrderBy(sottofamiglia => sottofamiglia.Nome))
                    Nome = famiglia.Nome,                            //  (cioè non si può fare "filtered include" o sorting sulle entità collegate)
                    Passeriforme = famiglia.Passeriforme,
                    Figli = famiglia.Figli.Select(sottofamiglia => new Sottofamiglie
                    {
                        Id = sottofamiglia.Id,
                        Nome = sottofamiglia.Nome,
                        FamigliaId = sottofamiglia.FamigliaId,
                        Figli = sottofamiglia.Figli.Select(tribu => new Tribu
                        {
                            Id = tribu.Id,
                            Nome = tribu.Nome,
                            SottofamigliaId = tribu.SottofamigliaId,
                            Figli = tribu.Figli.Select(genere => new Generi
                            {
                                Id = genere.Id,
                                Nome = genere.Nome,
                                TribuId = genere.TribuId,
                                Figli = genere.Figli.Select(specie => new Specie
                                {
                                    Id = specie.Id,
                                    Nome = specie.Nome,
                                    GenereId = specie.GenereId,
                                    Figli = specie.Figli.Select(sottospecie => new Sottospecie
                                    {
                                        Id = sottospecie.Id,
                                        Nome = sottospecie.Nome,
                                        SpecieId = sottospecie.SpecieId,
                                        StatoConservazioneId = sottospecie.StatoConservazioneId,
                                        NomeItaliano = sottospecie.NomeItaliano,
                                        NomeInglese = sottospecie.NomeInglese,
                                        AnnoClassificazione = sottospecie.AnnoClassificazione,
                                        ClassificazioneOriginale = sottospecie.ClassificazioneOriginale,
                                        ElencoAutori = sottospecie.ElencoAutori
                                    }).OrderBy(sottospecie => sottospecie.Nome).ToList()
                                }).OrderBy(specie => specie.Nome).ToList()
                            }).OrderBy(genere => genere.Nome).ToList()
                        }).OrderBy(tribu => tribu.Nome).ToList()
                    }).OrderBy(sottofamiglia => sottofamiglia.Nome).ToList()
                }).OrderBy(famiglia => famiglia.Nome).ToList();
        }

        public IEnumerable<Famiglie> LeggiFamiglie()
        {
            return _contesto.Famiglie
                .Include(famiglia => famiglia.Figli)
                .OrderBy(famiglia => famiglia.Nome)
                .ToList();
        }

        public IEnumerable<Famiglie> LeggiFamiglie(int idFamiglia)
        {
            return _contesto.Famiglie
                .Where(famiglia => famiglia.Id == idFamiglia)
                .Include(famiglia => famiglia.Figli)
                .OrderBy(famiglia => famiglia.Nome)
                .ToList();
        }

        public IEnumerable<Sottofamiglie> LeggiSottofamiglie()
        {
            return _contesto.Sottofamiglie
                .Include(sottofamiglia => sottofamiglia.Figli)
                .OrderBy(sottofamiglia => sottofamiglia.Nome)
                .ToList();
        }

        public IEnumerable<Sottofamiglie> LeggiSottofamiglie(int idSottofamiglia)
        {
            return _contesto.Sottofamiglie
                .Where(sottofamiglia => sottofamiglia.Id == idSottofamiglia)
                .Include(sottofamiglia => sottofamiglia.Figli)
                .OrderBy(sottofamiglia => sottofamiglia.Nome)
                .ToList();
        }

        public IEnumerable<Tribu> LeggiTribu()
        {
            return _contesto.Tribu
                .Include(tribu => tribu.Figli)
                .OrderBy(tribu => tribu.Nome)
                .ToList();
        }

        public IEnumerable<Tribu> LeggiTribu(int idTribu)
        {
            return _contesto.Tribu
                .Where(tribu => tribu.Id == idTribu)
                .Include(tribu => tribu.Figli)
                .OrderBy(tribu => tribu.Nome)
                .ToList();
        }

        public IEnumerable<Generi> LeggiGeneri()
        {
            return _contesto.Generi
                .Include(genere => genere.Figli)
                .OrderBy(genere => genere.Nome)
                .ToList();
        }

        public IEnumerable<Generi> LeggiGeneri(int idGenere)
        {
            return _contesto.Generi
                .Where(genere => genere.Id == idGenere)
                .Include(genere => genere.Figli)
                .OrderBy(genere => genere.Nome)
                .ToList();
        }

        public IEnumerable<Specie> LeggiSpecie()
        {
            return _contesto.Specie
                .Include(specie => specie.Figli)
                .OrderBy(specie => specie.Nome)
                .ToList();
        }

        public IEnumerable<Specie> LeggiSpecie(int idSpecie)
        {
            return _contesto.Specie
                .Where(specie => specie.Id == idSpecie)
                .Include(specie => specie.Figli)
                .OrderBy(specie => specie.Nome)
                .ToList();
        }

        public IEnumerable<Sottospecie> LeggiSottospecie()
        {
            return _contesto.Sottospecie
                .OrderBy(sottospecie => sottospecie.Nome)
                .ToList();
        }

        public IEnumerable<Sottospecie> LeggiSottospecie(int idSottospecie)
        {
            return _contesto.Sottospecie
                .Where(sottospecie => sottospecie.Id == idSottospecie)
                .OrderBy(specie => specie.Nome)
                .ToList();
        }

        //public IEnumerable<Classificatori> LeggiClassificatori()
        //{
        //    return _contesto.Classificatori
        //            .OrderBy(classificatore => classificatore.Classificatore)
        //            .ToList();
        //}

        //public IEnumerable<Classificatori> LeggiClassificatori(int idClassificatore)
        //{
        //    return _contesto.Classificatori
        //        .Where(classificatore => classificatore.Id == idClassificatore)
        //            .OrderBy(classificatore => classificatore.Classificatore)
        //            .ToList();
        //}

        //public void PostClassificatore(Classificatori classificatore)
        //{
        //    try
        //    {
        //        _contesto.Add(classificatore);
        //    }
        //    catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
        //    {
        //    }
        //}

        //public void PutClassificatore(Classificatori classificatore)
        //{
        //    try
        //    {
        //        _contesto.Update(classificatore);
        //    }
        //    catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
        //    {
        //    }
        //}

        //public void CancellaClassificatore(int idClassificatore)
        //{
        //    _contesto.Classificatori
        //        .RemoveRange(_contesto.Classificatori.Where(classificatore => classificatore.Id == idClassificatore));
        //}
    }
}
