using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Papero.Models;
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

        public IEnumerable<ElencoSinteticoEsemplari> LeggiElencoSinteticoEsemplari()
        {
            _log.LogInformation("Chiamata di _contesto.Esemplari.ToList()");

            return _contesto.ElencoSinteticoEsemplari.ToList();
        }

        public ElencoSinteticoEsemplari LeggiSingoloEsemplareDaElencoSintetico (int idEsemplare)
        {
            return _contesto.ElencoSinteticoEsemplari
                .Single(esemplare => esemplare.Id == idEsemplare);
        }

        //public IEnumerable<Esemplari> ElencoEsemplari()
        //{
        //    return _contesto.Esemplari
        //        .Include(esemplare => esemplare.Sottospecie)
        //                .ThenInclude(sottospecie => sottospecie.Specie)
        //                    .ThenInclude(specie => specie.Genere);
        //}


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
                return _contesto.ElencoSinteticoEsemplari
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
            return _contesto.StatiConservazione.ToList();
        }
    }
}
