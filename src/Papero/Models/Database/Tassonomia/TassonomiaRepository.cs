﻿// TassonomiaRepository.cs
//
// Metodi che implementano le query relative alla tassonomia sul database
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

#region Get
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

        public SottospecieViewModel LeggiSottospecieConAutori(int idSottospecie)
        {
            return _contesto.Classificazioni
                           .Include(classificazione => classificazione.Sottospecie)
                           .Include(classificazione => classificazione.Classificatore)
                           .Where(classificazione => classificazione.SottospecieId == idSottospecie)
                           .Select(classificazione => new SottospecieViewModel
                           {
                               Id = classificazione.SottospecieId,
                               SpecieId = classificazione.Sottospecie.SpecieId,
                               Nome = classificazione.Sottospecie.Nome,
                               AnnoClassificazione = classificazione.Sottospecie.AnnoClassificazione,
                               ClassificazioneOriginale = classificazione.Sottospecie.ClassificazioneOriginale,
                               NomeItaliano = classificazione.Sottospecie.NomeItaliano,
                               NomeInglese = classificazione.Sottospecie.NomeInglese,
                               ElencoAutori = classificazione.Sottospecie.ElencoAutori,
                               StatoConservazioneId = classificazione.Sottospecie.StatoConservazioneId,
                               Classificatori = _contesto.Classificazioni
                                                .Where(classificazioneinterna => classificazioneinterna.SottospecieId == idSottospecie)
                                                .Select(classificazioneinterna => new ClassificatoreViewModel
                                                {
                                                    Id = classificazioneinterna.ClassificatoreId,
                                                    Classificatore = classificazioneinterna.Classificatore.Classificatore,
                                                    Ordinamento = classificazioneinterna.Ordinamento
                                                }).OrderBy(classificazioneinterna => classificazioneinterna.Ordinamento).ToList()
                           })
                           .FirstOrDefault();
        }

#endregion

#region Put

        public void PutFamiglia(Famiglie famiglia)
        {
            try
            {
                _contesto.Update(famiglia);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutSottofamiglia(Sottofamiglie sottofamiglia)
        {
            try
            {
                _contesto.Update(sottofamiglia);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutTribu(Tribu tribu)
        {
            try
            {
                _contesto.Update(tribu);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutGenere(Generi genere)
        {
            try
            {
                _contesto.Update(genere);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutSpecie(Specie specie)
        {
            try
            {
                _contesto.Update(specie);
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PutSottospecieConAutori(SottospecieViewModel sottospecieconautori)
        {
            try
            {
                // Identifichiamo l'elemento su cui lavorare
                var sottospecieDaModificare = _contesto.Sottospecie.Single(sottospecie => sottospecie.Id == sottospecieconautori.Id);

                // Togliamo tutte le classificazioni esistenti per la sottospecie corrente
                // (più semplice che cercare e modificare le pre-esistenti)
                _contesto.Classificazioni
                    .RemoveRange(_contesto.Classificazioni
                        .Where(classificazione => classificazione.SottospecieId == sottospecieconautori.Id));
                _contesto.SaveChanges();

                // Aggiungiamo una alla volta le nuove classificazioni
                foreach (var classificatore in sottospecieconautori.Classificatori)
                {
                    var classificazioneDaAggiungere = new Classificazioni();
                    classificazioneDaAggiungere.SottospecieId = sottospecieconautori.Id;
                    classificazioneDaAggiungere.ClassificatoreId = classificatore.Id;
                    classificazioneDaAggiungere.Ordinamento = classificatore.Ordinamento;
                    sottospecieDaModificare.Classificazioni.Add(classificazioneDaAggiungere);
                }

                // Aggiorniamo i campi della sottospecie
                sottospecieDaModificare.Nome = sottospecieconautori.Nome;
                sottospecieDaModificare.AnnoClassificazione = sottospecieconautori.AnnoClassificazione;
                sottospecieDaModificare.ClassificazioneOriginale = sottospecieconautori.ClassificazioneOriginale;
                sottospecieDaModificare.NomeItaliano = sottospecieconautori.NomeItaliano;
                sottospecieDaModificare.NomeInglese = sottospecieconautori.NomeInglese;
                sottospecieDaModificare.ElencoAutori = sottospecieconautori.ElencoAutori;
                sottospecieDaModificare.StatoConservazioneId = sottospecieconautori.StatoConservazioneId;

                // ...e infine salviamo nel database
                _contesto.Update(sottospecieDaModificare);

            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

#endregion

#region Post

        public void PostFamiglia(Famiglie famiglia)
        {
            try
            {
                _contesto.Add(famiglia);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostSottofamiglia(Sottofamiglie sottofamiglia)
        {
            try
            {
                _contesto.Add(sottofamiglia);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostTribu(Tribu tribu)
        {
            try
            {
                _contesto.Add(tribu);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostGenere(Generi genere)
        {
            try
            {
                _contesto.Add(genere);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostSpecie(Specie specie)
        {
            try
            {
                _contesto.Add(specie);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostSottospecie(Sottospecie sottospecie)
        {
            try
            {
                _contesto.Add(sottospecie);
            }
            catch (Exception)  // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        public void PostSottospecieConAutori(SottospecieViewModel sottospecieconautori)
        {
            try
            {
                // Creiamo l'entità da aggiungere
                var sottospecieDaAggiungere = new Sottospecie();

                // Aggiorniamo i campi della sottospecie
                sottospecieDaAggiungere.Nome = sottospecieconautori.Nome;
                sottospecieDaAggiungere.SpecieId = sottospecieconautori.SpecieId;
                sottospecieDaAggiungere.AnnoClassificazione = sottospecieconautori.AnnoClassificazione;
                sottospecieDaAggiungere.ClassificazioneOriginale = sottospecieconautori.ClassificazioneOriginale;
                sottospecieDaAggiungere.NomeItaliano = sottospecieconautori.NomeItaliano;
                sottospecieDaAggiungere.NomeInglese = sottospecieconautori.NomeInglese;
                sottospecieDaAggiungere.ElencoAutori = sottospecieconautori.ElencoAutori;
                sottospecieDaAggiungere.StatoConservazioneId = sottospecieconautori.StatoConservazioneId;

                // ...e infine salviamo nel database
                _contesto.Add(sottospecieDaAggiungere);
                _contesto.SaveChanges();

                sottospecieconautori.Id = sottospecieDaAggiungere.Id;       // IMPORTANTISSIMO perché abbiamo passato un viewmodel! Se non aggiornassimo a mano l'ID,
                                                                            // non verrebbe passato alla Created() nella API e verrebbe restituito zero
                // Aggiungiamo una alla volta le nuove classificazioni
                foreach (var classificatore in sottospecieconautori.Classificatori)
                {
                    var classificazioneDaAggiungere = new Classificazioni();
                    classificazioneDaAggiungere.SottospecieId = sottospecieDaAggiungere.Id;
                    classificazioneDaAggiungere.ClassificatoreId = classificatore.Id;
                    classificazioneDaAggiungere.Ordinamento = classificatore.Ordinamento;

                    _contesto.Add(classificazioneDaAggiungere);              
                }
            }
            catch (Exception) // TODO: verificare se serve o se è sufficiente il try/catch sulla SalvaModifiche
            {
            }
        }

        #endregion

#region Delete

        public void CancellaSottospecie(int idSottospecie)
        {
            _contesto.Classificazioni
                .RemoveRange(_contesto.Classificazioni.Where(classificazione => classificazione.SottospecieId == idSottospecie));

            _contesto.Sottospecie
                .RemoveRange(_contesto.Sottospecie.Where(sottospecie => sottospecie.Id == idSottospecie));
        }

        public void CancellaSpecie(int idSpecie)
        {
            _contesto.Specie
                .RemoveRange(_contesto.Specie.Where(specie => specie.Id == idSpecie));
        }

        public void CancellaGenere(int idGenere)
        {
            _contesto.Generi
                .RemoveRange(_contesto.Generi.Where(genere => genere.Id == idGenere));
        }

        public void CancellaTribu(int idTribu)
        {
            _contesto.Tribu
                .RemoveRange(_contesto.Tribu.Where(tribu => tribu.Id == idTribu));
        }

        public void CancellaSottofamiglia(int idSottofamiglia)
        {
            _contesto.Sottofamiglie
                .RemoveRange(_contesto.Sottofamiglie.Where(sottofamiglia => sottofamiglia.Id == idSottofamiglia));
        }

        public void CancellaFamiglia(int idFamiglia)
        {
            _contesto.Famiglie
                .RemoveRange(_contesto.Famiglie.Where(famiglia => famiglia.Id == idFamiglia));
        }

        #endregion

        #region Conteggio Esemplari

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaSottospecie(int idSottospecie)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.SottospecieId == idSottospecie)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome
                }
                ).ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaSpecie(int idSpecie)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.Sottospecie.SpecieId == idSpecie)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome
                }
                ).ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaGenere(int idGenere)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.Sottospecie.Specie.GenereId == idGenere)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome
                }
                ).ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaTribu(int idTribu)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.Sottospecie.Specie.Genere.TribuId == idTribu)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome
                }
                ).ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaSottofamiglia(int idSottofamiglia)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.Sottospecie.Specie.Genere.Tribu.SottofamigliaId == idSottofamiglia)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome
                }
                ).ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaFamiglia(int idFamiglia)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.Sottospecie.Specie.Genere.Tribu.Sottofamiglia.FamigliaId == idFamiglia)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome
                }
                ).ToList();
        }

        #endregion

        #region Navigazione Inversa

        public int IdSottospecieIndeterminataDaSpecie(int idSpecie)
        {
            return _contesto.Sottospecie
                .Single(sottospecie => sottospecie.Nome == "-" && sottospecie.SpecieId == idSpecie)
                .Id;
        }

        public int IdSottospecieIndeterminataDaGenere (int idGenere)
        {
            return _contesto.Sottospecie                                                                    // Questa funziona SOLO se:
                .Single(sottospecie => sottospecie.Nome == "-" && sottospecie.Specie.GenereId == idGenere)  // 1) il genere ha una specie sola
                .Id;                                                                                        // 2) la specie ha solo la sottospecie indeterminata                  
        }                                                                                                   // (si usa per la cancellazione di un ramo)                  

        public int IdSottospecieIndeterminataDaTribu(int idTribu)
        {
            return _contesto.Sottospecie                                                                         // Questa funziona SOLO se:
                .Single(sottospecie => sottospecie.Nome == "-" && sottospecie.Specie.Genere.TribuId == idTribu)  // 1) il genere ha una specie sola
                .Id;                                                                                             // 2) la specie ha solo la sottospecie indeterminata                  
        }                                                                                                        // 3) la tribù ha una specie sola        

        public int IdSottospecieIndeterminataDaSottofamiglia(int idSottofamiglia)
        {
            return _contesto.Sottospecie                                                                                               // Questa funziona SOLO se:
                .Single(sottospecie => sottospecie.Nome == "-" && sottospecie.Specie.Genere.Tribu.SottofamigliaId == idSottofamiglia)  // 1) il genere ha una specie sola
                .Id;                                                                                                                   // 2) la specie ha solo la sottospecie indeterminata                  
        }                                                                                                                              // 3) sottofamiglia e tribù hanno un figlio solo

        public int IdSottospecieIndeterminataDaFamiglia(int idFamiglia)
        {
            return _contesto.Sottospecie                                                                                                   // Questa funziona SOLO se:
                .Single(sottospecie => sottospecie.Nome == "-" && sottospecie.Specie.Genere.Tribu.Sottofamiglia.FamigliaId == idFamiglia)  // 1) il genere ha una specie sola
                .Id;                                                                                                                       // 2) la specie ha solo la sottospecie indeterminata                  
        }
        public int IdUnicaSpecieDaGenere(int idGenere)
        {
            return _contesto.Specie
                .Single(specie => specie.GenereId == idGenere)  // Questa funziona SOLO se il genere ha una specie sola (si usa per la cancellazione di un ramo)
                .Id;
        }

        public int IdUnicaSpecieDaTribu(int idTribu)
        {
            return _contesto.Specie
                .Single(specie => specie.Genere.TribuId == idTribu)  // Questa funziona SOLO se la tribu ha un genere solo e il genere ha una specie sola (si usa per la cancellazione di un ramo)
                .Id;
        }

        public int IdUnicaSpecieDaSottofamiglia(int idSottofamiglia)
        {
            return _contesto.Specie
                .Single(specie => specie.Genere.Tribu.SottofamigliaId == idSottofamiglia)
                .Id;
        }

        public int IdUnicaSpecieDaFamiglia(int idFamiglia)
        {
            return _contesto.Specie
                .Single(specie => specie.Genere.Tribu.Sottofamiglia.FamigliaId == idFamiglia)
                .Id;
        }

        public int IdUnicoGenereDaTribu(int idTribu)
        {
            return _contesto.Generi
                .Single(genere => genere.TribuId == idTribu)  // Questa funziona SOLO se la tribu ha un genere solo (si usa per la cancellazione di un ramo)
                .Id;
        }

        public int IdUnicoGenereDaSottofamiglia(int idSottofamiglia)
        {
            return _contesto.Generi
                .Single(genere => genere.Tribu.SottofamigliaId == idSottofamiglia)  // Questa funziona SOLO se la sottofamiglia ha una tribù sola con un solo genere
                .Id;
        }

        public int IdUnicoGenereDaFamiglia(int idFamiglia)
        {
            return _contesto.Generi
                .Single(genere => genere.Tribu.Sottofamiglia.FamigliaId == idFamiglia)  // Questa funziona SOLO se la sottofamiglia ha una tribù sola con un solo genere
                .Id;
        }

        public int IdUnicaTribuDaSottofamiglia(int idSottofamiglia)
        {
            return _contesto.Tribu
                .Single(tribu => tribu.SottofamigliaId == idSottofamiglia)  // Questa funziona SOLO se la sottofamiglia ha una tribù sola (si usa per la cancellazione di un ramo)
                .Id;
        }

        public int IdUnicaTribuDaFamiglia(int idFamiglia)
        {
            return _contesto.Tribu
                .Single(tribu => tribu.Sottofamiglia.FamigliaId == idFamiglia)  // Questa funziona SOLO se la sottofamiglia ha una tribù sola (si usa per la cancellazione di un ramo)
                .Id;
        }

        public int IdUnicaSottofamigliaDaFamiglia(int idFamiglia)
        {
            return _contesto.Sottofamiglie
                .Single(sottofamiglia => sottofamiglia.FamigliaId == idFamiglia)  // Questa funziona SOLO se la sottofamiglia ha una tribù sola (si usa per la cancellazione di un ramo)
                .Id;
        }

        #endregion

    }
}
