using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Papero.Funzioni;
using Papero.Models;
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

        public PaperoRepository(PaperoDBContext contesto,
                                ILogger<PaperoRepository> log)
        {
            _contesto = contesto;
            _log = log;
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
                return new Esemplari { Id = -1 } ;
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

        public IEnumerable<ElencoClassificatoriViewModel> LeggiClassificazioni(int idSottospecie)
        {
            return _contesto.Classificazioni
                .Where(classificazione => classificazione.SottospecieId == idSottospecie)
                .Include(classificazione => classificazione.Classificatore)
                .OrderBy(classificazione => classificazione.Ordinamento)
                .Select(cl => new ElencoClassificatoriViewModel
                {
                    Id = cl.ClassificatoreId,
                    Classificatore = cl.Classificatore.Classificatore
                })
                .ToList();
        }

        public IEnumerable<ElencoClassificatoriViewModel> LeggiClassificatori()
        {
            return _contesto.Classificatori
                    .OrderBy(classificatore => classificatore.Classificatore)
                    .Select(cl => new ElencoClassificatoriViewModel
                    {
                        Id = cl.Id,
                        Classificatore = cl.Classificatore
                    })
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
                .RemoveRange(_contesto.Classificazioni.Where(cl => cl.SottospecieId == idSottospecie));
             _contesto.SaveChanges();
        }
        public async Task<bool> SalvaModifiche()
        {
            return (await _contesto.SaveChangesAsync()) > 0;
        }
    }
}
