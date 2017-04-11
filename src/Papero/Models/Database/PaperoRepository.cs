// PaperoRepository.cs
//
// Metodi che implementano le query sul database
//
// La documentazione di ciascun metodo è nell'interfaccia IPaperoRepository

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Papero.Controllers;
using Papero.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class PaperoRepository : IPaperoRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<PaperoRepository> _log;
        private IStringLocalizer<PaperoRepository> _localizzatore;

        public PaperoRepository(PaperoDBContext contesto,
                                ILogger<PaperoRepository> log,
                                IStringLocalizer<PaperoRepository> localizzatore)
        {
            _contesto = contesto;
            _log = log;
            _localizzatore = localizzatore;
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplari()
        {
            _log.LogInformation("Chiamata di _contesto.Esemplari.ToList()");

            return _contesto.Esemplari
                .Include(esemplare => esemplare.Sottospecie)
                        .ThenInclude(sottospecie => sottospecie.Specie)
                            .ThenInclude(specie => specie.Genere)
                .Select(es => new ElencoEsemplariViewModel
                {
                    Id = es.Id,
                    Msng = es.Msng,
                    SottospecieId = es.SottospecieId,
                    Genere = es.Sottospecie.Specie.Genere.Nome,
                    Specie = es.Sottospecie.Specie.Nome,
                    Sottospecie = es.Sottospecie.Nome,
                    ElencoAutori = es.Sottospecie.ElencoAutori
                });
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
                .ToList();
        }

        public Esemplari LeggiEsemplare(int idEsemplare)
        {
            try
            {
                return _contesto.Esemplari
                    .Where(esemplare => esemplare.Id == idEsemplare)
                    .Include(esemplare => esemplare.Sottospecie)
                        .ThenInclude(sottospecie => sottospecie.Specie)
                            .ThenInclude(specie => specie.Genere)
                                .ThenInclude(genere => genere.Tribu)
                                    .ThenInclude(tribu => tribu.Sottofamiglia)
                                        .ThenInclude(sottofamiglia => sottofamiglia.Famiglia)
                    .Include(esemplare => esemplare.Sottospecie)
                        .ThenInclude(sottospecie => sottospecie.StatoConservazione)
                    .Include(esemplare => esemplare.Sesso)
                    .Include(esemplare => esemplare.Tipo)
                    .Include(esemplare => esemplare.Aberrazione)
                    .Include(esemplare => esemplare.Preparazioni)
                        .ThenInclude(preparazione => preparazione.Preparatore)
                    .Include(esemplare => esemplare.AvutoDa)
                    .Include(esemplare => esemplare.Legit)
                    .Include(esemplare => esemplare.Cedente)
                    .Include(esemplare => esemplare.TipoAcquisizione)
                    .Include(esemplare => esemplare.Collezione)
                    .Include(esemplare => esemplare.Spedizione)
                    .Include(esemplare => esemplare.LocalitaCattura)
                        .ThenInclude(localita => localita.Citta)
                            .ThenInclude(citta => citta.Provincia)
                                .ThenInclude(provincia => provincia.Regione)
                                    .ThenInclude(regione => regione.Nazione)
                    .Include(esemplare => esemplare.Determinazioni)
                        .ThenInclude(determinazione => determinazione.Determinatore)
                    .Include(esemplare => esemplare.VecchieDeterminazioni)
                        .ThenInclude(vecchiaDeterminazione => vecchiaDeterminazione.VecchiDeterminatori)
                            .ThenInclude(vecchioDeterminatore => vecchioDeterminatore.Determinatore)
                    .Include(esemplare => esemplare.Sottospecie.Classificazioni)
                        .ThenInclude(classificazione => classificazione.Classificatore)
                    .Include(esemplare => esemplare.Preparati)
                        .ThenInclude(preparato => preparato.Parte)
                    .Include(esemplare => esemplare.Preparati)
                        .ThenInclude(preparato => preparato.Vassoio)
                            .ThenInclude(vassoio => vassoio.Cassetto)
                                .ThenInclude(cassetto => cassetto.Armadio)
                                    .ThenInclude(armadio => armadio.Sala)
                    .FirstOrDefault();
            }
            catch (Exception)
            {
                return new Esemplari { Id = -1 };
            }
        }

        public int EsemplareIdDaMSNG(int MSNG)
        {
            try
            {
                return _contesto.Esemplari
                    .Single(esemplare => esemplare.Msng == MSNG)
                    .Id;
            }
            catch (Exception)
            {
                return -1;
            }
        }

        public IEnumerable<StatiConservazione> LeggiStatiConservazione()
        {
            return _contesto.StatiConservazione
                .OrderBy(statoConservazione => statoConservazione.StatoConservazione)
                .ToList();
        }

        public IEnumerable<Classificatori> LeggiClassificazioni(int idSottospecie)
        {
            return _contesto.Classificazioni
                .Where(classificazione => classificazione.SottospecieId == idSottospecie)
                .Include(classificazione => classificazione.Classificatore)
                .OrderBy(classificazione => classificazione.Ordinamento)
                .Select(cl => new Classificatori
                {
                    Id = cl.ClassificatoreId,
                    Classificatore = cl.Classificatore.Classificatore
                })
                .ToList();
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

        public IEnumerable<Sottospecie> LeggiSottospecie()
        {
            return _contesto.Sottospecie
                .ToList();
        }

        public Sottospecie LeggiSottospecie(int idSottospecie)
        {
            return _contesto.Sottospecie
                .Include(sottospecie => sottospecie.Classificazioni)
                .Single(sottospecie => sottospecie.Id == idSottospecie);
        }

        public void CancellaClassificazioni(int idSottospecie)
        {
            _contesto.Classificazioni
               .RemoveRange(_contesto.Classificazioni.Where(classificazione => classificazione.SottospecieId == idSottospecie));
            _contesto.SaveChanges();
        }

        public void CancellaPreparati(int idEsemplare)
        {
            _contesto.Preparati
                .RemoveRange(_contesto.Preparati.Where(preparato => preparato.EsemplareId == idEsemplare));
            _contesto.SaveChanges();
        }

        public void CancellaPreparazioni(int idEsemplare)
        {
            _contesto.Preparazioni
                .RemoveRange(_contesto.Preparazioni.Where(preparazione => preparazione.EsemplareId == idEsemplare));
            _contesto.SaveChanges();
        }

        public IEnumerable<PartiPreparate> LeggiPartiPreparate()
        {
            return _contesto.PartiPreparate
                .OrderBy(parte => parte.Parte)
                .ToList();
        }

        public IEnumerable<Preparati> LeggiPreparati()
        {
            return _contesto.Preparati
                .Include(preparato => preparato.Parte)
                .Include(preparato => preparato.Vassoio)
                    .ThenInclude(vassoio => vassoio.Cassetto)
                        .ThenInclude(cassetto => cassetto.Armadio)
                            .ThenInclude(armadio => armadio.Sala)
                .OrderBy(preparato => preparato.Ordinamento)
                .ToList();
        }

        public IEnumerable<Preparati> LeggiPreparati(int idEsemplare)
        {
            return _contesto.Preparati
                .Where(preparato => preparato.EsemplareId == idEsemplare)
                    .Include(preparato => preparato.Parte)
                    .Include(preparato => preparato.Vassoio)
                        .ThenInclude(vassoio => vassoio.Cassetto)
                            .ThenInclude(cassetto => cassetto.Armadio)
                                .ThenInclude(armadio => armadio.Sala)
                .OrderBy(preparato => preparato.Ordinamento)
                .ToList();
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

        public IEnumerable<Armadi> LeggiArmadi()
        {
            return _contesto.Armadi
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

        public IEnumerable<Vassoi> LeggiVassoi()
        {
            return _contesto.Vassoi
                .OrderBy(vassoio => vassoio.Vassoio)
                .ToList();
        }

        public IEnumerable<VecchieDeterminazioni> LeggiVecchieDeterminazioni()
        {
            return _contesto.VecchieDeterminazioni
                .Include(vecchiaDeterminazione => vecchiaDeterminazione.VecchiDeterminatori)
                    .ThenInclude(vecchioDeterminatore => vecchioDeterminatore.Determinatore)
                .OrderBy(vecchiaDeterminazione => vecchiaDeterminazione.Ordinamento)
                .ToList();
        }
        public IEnumerable<VecchieDeterminazioni> LeggiVecchieDeterminazioni(int idEsemplare)
        {
            return _contesto.VecchieDeterminazioni
                .Where(vecchiaDeterminazione => vecchiaDeterminazione.EsemplareId == idEsemplare)
                .Include(vecchiaDeterminazione => vecchiaDeterminazione.VecchiDeterminatori)
                    .ThenInclude(vecchioDeterminatore => vecchioDeterminatore.Determinatore)
                .OrderBy(vecchiaDeterminazione => vecchiaDeterminazione.Ordinamento)
                .ToList();
        }

        public IEnumerable<VecchiDeterminatori> LeggiVecchiDeterminatori()
        {
            return _contesto.VecchiDeterminatori
                .Include(vecchioDeterminatore => vecchioDeterminatore.Determinatore)
                .OrderBy(vecchioDeterminatore => vecchioDeterminatore.Ordinamento)
                .ToList();
        }

        public IEnumerable<VecchiDeterminatori> LeggiVecchiDeterminatori(int idVecchiaDeterminazione)
        {
            return _contesto.VecchiDeterminatori
                .Where(vecchioDeterminatore => vecchioDeterminatore.VecchiaDeterminazione.Id == idVecchiaDeterminazione)
                .Include(vecchioDeterminatore => vecchioDeterminatore.Determinatore)
                .OrderBy(vecchioDeterminatore => vecchioDeterminatore.Ordinamento)
                .ToList();
        }

        public IEnumerable<Determinatori> LeggiDeterminatori()
        {
            return _contesto.Determinatori
                .OrderBy(determinatore => determinatore.Cognome)
                    .ThenBy(determinatore => determinatore.Nome)
                .ToList();
        }

        public IEnumerable<Determinatori> LeggiDeterminatori(int idEsemplare)
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

        public void CancellaVecchiDeterminatori(int[] arrayIdVecchieDeterminazioni)
        {
            _contesto.VecchiDeterminatori
                .RemoveRange(_contesto.VecchiDeterminatori.Where(determinatore => arrayIdVecchieDeterminazioni.Contains((int)determinatore.VecchiaDeterminazioneId)));
            _contesto.SaveChanges();
        }

        public void CancellaDeterminazioni(int idEsemplare)
        {
            _contesto.Determinazioni
                .RemoveRange(_contesto.Determinazioni.Where(determinazione => determinazione.EsemplareId == idEsemplare));
            _contesto.SaveChanges();
        }
        public void CancellaVecchieDeterminazioni(int idEsemplare)
        {
            _contesto.VecchieDeterminazioni
                .RemoveRange(_contesto.VecchieDeterminazioni.Where(determinazione => determinazione.EsemplareId == idEsemplare));
            _contesto.SaveChanges();
        }

        public void InserisciVecchiDeterminatori(VecchiDeterminatori determinatoreDaInserire)
        {
            _contesto.VecchiDeterminatori.Add(determinatoreDaInserire);
            _contesto.SaveChanges();
        }

        public void AggiungiEsemplare(Esemplari esemplareDaInserire)
        {
            _contesto.Esemplari.Add(esemplareDaInserire);
        }

        public IEnumerable<ElencoSpecieViewModel> LeggiElencoSpecie()
        {
            return _contesto.Sottospecie
                .Select(sottospecie => new ElencoSpecieViewModel
                {
                    Nome = sottospecie.Specie.Genere.Nome + ' ' + sottospecie.Specie.Nome + (sottospecie.Nome == "-" ? "" : " " + sottospecie.Nome) + (string.IsNullOrWhiteSpace(sottospecie.ElencoAutori) ? "" : " " + sottospecie.ElencoAutori),
                    SpecieId = sottospecie.Specie.Id,
                    Id = sottospecie.Id,
                    Genere = sottospecie.Specie.Genere.Nome,
                    Specie = sottospecie.Specie.Nome,
                    Sottospecie = sottospecie.Nome,
                    ElencoAutori = sottospecie.ElencoAutori
                })
                .OrderBy(sottospecie => sottospecie.Nome)
                .ToList();
        }

        public int LeggiIDSessoIndeterminato()
        {
            return _contesto.Sessi
                .Single(sesso => sesso.Sesso == "Indeterminato")
                .Id;
        }

        public int LeggiIDLocalitaIndeterminata()
        {
            return _contesto.Localita
                .Single(localita =>
                        localita.NomeLocalita == "-" &&
                        localita.Citta.NomeCitta == "-" &&
                        localita.Citta.Provincia.Provincia == "-" &&
                        localita.Citta.Provincia.Regione.Regione == "-" &&
                        localita.Citta.Provincia.Regione.Nazione.Nazione == "-")
                .Id;
        }

        public int LeggiIDRaccoglitoreIndeterminato()
        {
            return _contesto.Raccoglitori
                .Single(raccoglitore => raccoglitore.Raccoglitore == "-")
                .Id;
        }

        public int LeggiIDCollezioneIndeterminata()
        {
            return _contesto.Collezioni
                .Single(collezione => collezione.Collezione == "-")
                .Id;
        }

        public int LeggiIDSpedizioneIndeterminata()
        {
            return _contesto.Spedizioni
                .Single(spedizione => spedizione.Spedizione == "-")
                .Id;
        }

        public int LeggiIDTipoIndeterminato()
        {
            return _contesto.Tipi
                .Single(tipo => tipo.Tipo == "-")
                .Id;
        }

        public int LeggiIDAberrazioneIndeterminata()
        {
            return _contesto.Aberrazioni
                .Single(aberrazione => aberrazione.Aberrazione == "-")
                .Id;
        }

        public int LeggiIDTipoAcquisizioneIndeterminato()
        {
            return _contesto.TipiAcquisizione
                .Single(tipo => tipo.TipoAcquisizione == "-")
                .Id;
        }

        public IEnumerable<Nazioni> LeggiNazioni()
        {
            return _contesto.Nazioni
                .OrderBy(nazione => nazione.Nazione)
                .ToList();
        }

        public IEnumerable<Regioni> LeggiRegioni()
        {
            return _contesto.Regioni
                .OrderBy(regione => regione.Regione)
                .ToList();
        }

        public IEnumerable<Regioni> LeggiRegioni(int idNazione)
        {
            return _contesto.Regioni
                .Where(regione => regione.NazioneId == idNazione)
                .OrderBy(regione => regione.Regione)
                .ToList();
        }

        public IEnumerable<Province> LeggiProvince()
        {
            return _contesto.Province
                .OrderBy(provincia => provincia.Provincia)
                .ToList();
        }

        public IEnumerable<Province> LeggiProvince(int idRegione)
        {
            return _contesto.Province
                .Where(provincia => provincia.RegioneId == idRegione)
                .OrderBy(provincia => provincia.Provincia)
                .ToList();
        }

        public IEnumerable<Citta> LeggiCitta()
        {
            return _contesto.Citta
                .OrderBy(citta => citta.NomeCitta)
                .ToList();
        }

        public IEnumerable<Citta> LeggiCitta(int idProvincia)
        {
            return _contesto.Citta
                .Where(citta => citta.ProvinciaId == idProvincia)
                .OrderBy(citta => citta.NomeCitta)
                .ToList();
        }

        public IEnumerable<Localita> LeggiLocalita()
        {
            return _contesto.Localita
                .OrderBy(localita => localita.NomeLocalita)
                .ToList();
        }

        public IEnumerable<Localita> LeggiLocalita(int idCitta)
        {
            return _contesto.Localita
                .Where(localita => localita.CittaId == idCitta)
                .OrderBy(localita => localita.NomeLocalita)
                .ToList();
        }

        public IEnumerable<Nazioni> LeggiGeografia()
        {
            return _contesto.Nazioni
                .Include(nazione => nazione.Regioni)
                    .ThenInclude(regione => regione.Province)
                        .ThenInclude(provincia => provincia.Citta)
                            .ThenInclude(citta => citta.Localita)
                .ToList();
        }

        public IEnumerable<Localita> LeggiLocalitaDaNazione(int idNazione)
        {
            return _contesto.Localita
                .Where(localita => localita.Citta.Provincia.Regione.NazioneId == idNazione)
            .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaNazione(int idNazione)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.LocalitaCattura.Citta.Provincia.Regione.NazioneId == idNazione)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori
                })
            .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaRegione(int idRegione)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.LocalitaCattura.Citta.Provincia.RegioneId == idRegione)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori
                })
            .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaProvincia(int idProvincia)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.LocalitaCattura.Citta.ProvinciaId == idProvincia)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori
                })
            .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaCitta(int idCitta)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.LocalitaCattura.CittaId == idCitta)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori
                })
            .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaLocalita(int idLocalita)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.LocalitaCatturaId == idLocalita)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori
                })
            .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaRaccoglitore(int idRaccoglitore)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.AvutoDaId == idRaccoglitore || esemplare.CedenteId == idRaccoglitore || esemplare.LegitId == idRaccoglitore)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori
                })
                .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaSpedizione(int idSpedizione)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.SpedizioneId == idSpedizione)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori
                })
                .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaCollezione(int idCollezione)
        {
            return _contesto.Esemplari
                .Where(esemplare => esemplare.CollezioneId == idCollezione)
                .Select(esemplare => new ElencoEsemplariViewModel
                {
                    Id = esemplare.Id,
                    Msng = esemplare.Msng,
                    Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                    Specie = esemplare.Sottospecie.Specie.Nome,
                    Sottospecie = esemplare.Sottospecie.Nome,
                    SottospecieId = esemplare.SottospecieId,
                    ElencoAutori = esemplare.Sottospecie.ElencoAutori
                })
                .ToList();
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaDataDa(string dataDa)
        {

            //return _contesto.Esemplari
            //    .Where(esemplare =>  Int32.Parse(dataDa) >= (String.IsNullOrEmpty(esemplare.DataCattura) ? (int?)null : (int)Int32.Parse(esemplare.DataCattura)))
            //    .Select(esemplare => new ElencoEsemplariViewModel
            //    {
            //        Id = esemplare.Id,
            //        Msng = esemplare.Msng,
            //        Genere = esemplare.Sottospecie.Specie.Genere.Nome,
            //        Specie = esemplare.Sottospecie.Specie.Nome,
            //        Sottospecie = esemplare.Sottospecie.Nome,
            //        SottospecieId = esemplare.SottospecieId,
            //        ElencoAutori = esemplare.Sottospecie.ElencoAutori
            //    })
            //    .ToList();

            return (from esemplare in _contesto.Esemplari
                    where (!(String.IsNullOrEmpty(esemplare.DataCattura)) &&
                    Int32.Parse(esemplare.DataCattura) != 0 &&
                    Int32.Parse(esemplare.DataCattura) >= Int32.Parse(dataDa))
                    select new ElencoEsemplariViewModel
                    {
                        Id = esemplare.Id,
                        Msng = esemplare.Msng,
                        Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                        Specie = esemplare.Sottospecie.Specie.Nome,
                        Sottospecie = esemplare.Sottospecie.Nome,
                        SottospecieId = esemplare.SottospecieId,
                        ElencoAutori = esemplare.Sottospecie.ElencoAutori
                    }).GroupBy(esemplare => esemplare.Id).Select(esemplare => esemplare.FirstOrDefault());
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaDataA(string dataA)
        {
            //return _contesto.Esemplari
            //    .Where(esemplare => (String.IsNullOrEmpty(esemplare.DataCattura) ? (int?)null : (int)Int32.Parse(esemplare.DataCattura)) <= Int32.Parse(dataA))
            //    .Select(esemplare => new ElencoEsemplariViewModel
            //    {
            //        Id = esemplare.Id,
            //        Msng = esemplare.Msng,
            //        Genere = esemplare.Sottospecie.Specie.Genere.Nome,
            //        Specie = esemplare.Sottospecie.Specie.Nome,
            //        Sottospecie = esemplare.Sottospecie.Nome,
            //        SottospecieId = esemplare.SottospecieId,
            //        ElencoAutori = esemplare.Sottospecie.ElencoAutori
            //    })
            //    .ToList();
            return (from esemplare in _contesto.Esemplari
                    where (!(String.IsNullOrEmpty(esemplare.DataCattura)) &&
                    Int32.Parse(esemplare.DataCattura) != 0 &&
                    Int32.Parse(esemplare.DataCattura) <= Int32.Parse(dataA))
                    select new ElencoEsemplariViewModel
                    {
                        Id = esemplare.Id,
                        Msng = esemplare.Msng,
                        Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                        Specie = esemplare.Sottospecie.Specie.Nome,
                        Sottospecie = esemplare.Sottospecie.Nome,
                        SottospecieId = esemplare.SottospecieId,
                        ElencoAutori = esemplare.Sottospecie.ElencoAutori
                    }).GroupBy(esemplare => esemplare.Id).Select(esemplare => esemplare.FirstOrDefault());
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaSala (int idSala)
        {
            return (from esemplare in _contesto.Esemplari
                    join preparato in _contesto.Preparati on esemplare.Id equals preparato.EsemplareId
                    where preparato.Vassoio.Cassetto.Armadio.SalaId == idSala
                    select new ElencoEsemplariViewModel
                    {
                        Id = esemplare.Id,
                        Msng = esemplare.Msng,
                        Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                        Specie = esemplare.Sottospecie.Specie.Nome,
                        Sottospecie = esemplare.Sottospecie.Nome,
                        SottospecieId = esemplare.SottospecieId,
                        ElencoAutori = esemplare.Sottospecie.ElencoAutori
                    }).GroupBy(esemplare => esemplare.Id).Select(esemplare => esemplare.FirstOrDefault());
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaArmadio(int idArmadio)
        {
            return (from esemplare in _contesto.Esemplari
                    join preparato in _contesto.Preparati on esemplare.Id equals preparato.EsemplareId
                    where preparato.Vassoio.Cassetto.ArmadioId == idArmadio
                    select new ElencoEsemplariViewModel
                    {
                        Id = esemplare.Id,
                        Msng = esemplare.Msng,
                        Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                        Specie = esemplare.Sottospecie.Specie.Nome,
                        Sottospecie = esemplare.Sottospecie.Nome,
                        SottospecieId = esemplare.SottospecieId,
                        ElencoAutori = esemplare.Sottospecie.ElencoAutori
                    }).GroupBy(esemplare => esemplare.Id).Select(esemplare => esemplare.FirstOrDefault());
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaCassetto(int idCassetto)
        {
            return (from esemplare in _contesto.Esemplari
                    join preparato in _contesto.Preparati on esemplare.Id equals preparato.EsemplareId
                    where preparato.Vassoio.CassettoId == idCassetto
                    select new ElencoEsemplariViewModel
                    {
                        Id = esemplare.Id,
                        Msng = esemplare.Msng,
                        Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                        Specie = esemplare.Sottospecie.Specie.Nome,
                        Sottospecie = esemplare.Sottospecie.Nome,
                        SottospecieId = esemplare.SottospecieId,
                        ElencoAutori = esemplare.Sottospecie.ElencoAutori
                    }).GroupBy(esemplare => esemplare.Id).Select(esemplare => esemplare.FirstOrDefault());
        }

        public IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaVassoio(int idVassoio)
        {
            return (from esemplare in _contesto.Esemplari
                    join preparato in _contesto.Preparati on esemplare.Id equals preparato.EsemplareId
                    where preparato.VassoioId == idVassoio
                    select new ElencoEsemplariViewModel
                    {
                        Id = esemplare.Id,
                        Msng = esemplare.Msng,
                        Genere = esemplare.Sottospecie.Specie.Genere.Nome,
                        Specie = esemplare.Sottospecie.Specie.Nome,
                        Sottospecie = esemplare.Sottospecie.Nome,
                        SottospecieId = esemplare.SottospecieId,
                        ElencoAutori = esemplare.Sottospecie.ElencoAutori
                    }).GroupBy(esemplare => esemplare.Id).Select(esemplare => esemplare.FirstOrDefault());
        }

        public IEnumerable<TipiAcquisizioneLocalizzatiViewModel> LeggiTipiAcquisizione()
        {
            return _contesto.TipiAcquisizione
                .OrderBy(tipoAcquisizione => tipoAcquisizione.TipoAcquisizione)
                .Select(tipoAcquisizione => new TipiAcquisizioneLocalizzatiViewModel
                {
                    Id = tipoAcquisizione.Id,
                    TipoAcquisizione = tipoAcquisizione.TipoAcquisizione,
                    TipoAcquisizioneLocalizzato = _localizzatore[tipoAcquisizione.TipoAcquisizione]
                })
                .ToList();
        }

        public IEnumerable<Collezioni> LeggiCollezioni()
        {
            return _contesto.Collezioni
                .OrderBy(collezione => collezione.Collezione)
                .ToList();
        }

        public IEnumerable<Spedizioni> LeggiSpedizioni()
        {
            return _contesto.Spedizioni
                .OrderBy(spedizione => spedizione.Spedizione)
                .ToList();
        }

        public IEnumerable<Raccoglitori> LeggiRaccoglitori()
        {
            return _contesto.Raccoglitori
                .OrderBy(raccoglitore => raccoglitore.Raccoglitore)
                .ToList();
        }

        public IEnumerable<SessiLocalizzatiViewModel> LeggiSessi()
        {   
            return _contesto.Sessi
                .OrderBy(sesso => sesso.Sesso)
                .Select(sesso => new SessiLocalizzatiViewModel
                {
                    Id = sesso.Id,
                    Sesso = sesso.Sesso,
                    SessoLocalizzato = _localizzatore[sesso.Sesso]
                })
                .ToList();
        }

        public IEnumerable<TipiLocalizzatiViewModel> LeggiTipi()
        {
            return _contesto.Tipi
                .OrderBy(tipo => tipo.Tipo)
                .Select(tipo => new TipiLocalizzatiViewModel
                {
                    Id = tipo.Id,
                    Tipo = tipo.Tipo,
                    TipoLocalizzato = _localizzatore[tipo.Tipo]
                })
                .ToList();
        }

        public IEnumerable<AberrazioniLocalizzateViewModel> LeggiAberrazioni()
        {
            return _contesto.Aberrazioni
                .OrderBy(aberrazione => aberrazione.Aberrazione)
                .Select(aberrazione => new AberrazioniLocalizzateViewModel
                {
                    Id = aberrazione.Id,
                    Aberrazione = aberrazione.Aberrazione,
                    AberrazioneLocalizzata = _localizzatore[aberrazione.Aberrazione]
                })
                .ToList();
        }

        public IEnumerable<Preparatori> LeggiPreparatori()
        {
            return _contesto.Preparatori
                .OrderBy(preparatore => preparatore.Cognome)
                    .ThenBy(preparatore => preparatore.Nome)
                .ToList();
        }

        public IEnumerable<Preparatori> LeggiPreparatori(int IdEsemplare)
        {
            return _contesto.Preparazioni
                .Where(preparazione => preparazione.EsemplareId == IdEsemplare)
                .OrderBy(preparazione => preparazione.Ordinamento)
                .Select(preparazione => new Preparatori
                {
                    Id = preparazione.Preparatore.Id,
                    Nome = preparazione.Preparatore.Nome,
                    Cognome = preparazione.Preparatore.Cognome
                })
                .ToList();
        }

        public IEnumerable<Preparazioni> LeggiPreparazioni()
        {
            return _contesto.Preparazioni
                .ToList();
        }
        public IEnumerable<Preparazioni> LeggiPreparazioni(int idEsemplare)
        {
            return _contesto.Preparazioni
                .Where(preparazione => preparazione.EsemplareId == idEsemplare)
                .ToList();
        }

        public void CancellaEsemplare(int idEsemplare)
        {
            CancellaPreparati(idEsemplare);
            CancellaPreparazioni(idEsemplare);
            CancellaDeterminazioni(idEsemplare);

            var arrayIdVecchieDeterminazioni = LeggiVecchieDeterminazioni(idEsemplare).Select(determinazione => determinazione.Id).ToArray();
            CancellaVecchiDeterminatori(arrayIdVecchieDeterminazioni);
            CancellaVecchieDeterminazioni(idEsemplare);

            _contesto.Esemplari
                .Remove(_contesto.Esemplari.Single(esemplare => esemplare.Id == idEsemplare));
        }

        public void PostClassificatore(Classificatori classificatore)
        {
            _contesto.Add(classificatore);
        }
        public async Task<bool> SalvaModifiche()
        {
            return (await _contesto.SaveChangesAsync()) > 0;
        }
    }
}
