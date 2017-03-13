﻿using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface IPaperoRepository
    {
        IEnumerable<Famiglie> LeggiAlbero();
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplari();
        Esemplari LeggiEsemplare(int esemplareId);
        int EsemplareIdDaMSNG(int MSNG);
        IEnumerable<StatiConservazione> LeggiStatiConservazione();
        IEnumerable<ElencoClassificatoriViewModel> LeggiClassificazioni(int idSottospecie);
        IEnumerable<ElencoClassificatoriViewModel> LeggiClassificatori();
        IEnumerable<Sottospecie> LeggiSottospecie();

        IEnumerable<PartiPreparate> LeggiPartiPreparate();
        IEnumerable<Preparati> LeggiPreparati();
        IEnumerable<Preparati> LeggiPreparati(int idEsemplare);
        IEnumerable<Sale> LeggiSale();
        IEnumerable<Armadi> LeggiArmadi();
        IEnumerable<Cassetti> LeggiCassetti();
        IEnumerable<Vassoi> LeggiVassoi();
        IEnumerable<VecchieDeterminazioni> LeggiVecchieDeterminazioni();
        IEnumerable<VecchieDeterminazioni> LeggiVecchieDeterminazioni(int idEsemplare);
        IEnumerable<VecchiDeterminatori> LeggiVecchiDeterminatori();
        IEnumerable<VecchiDeterminatori> LeggiVecchiDeterminatori(int idEsemplare);
        IEnumerable<Determinatori> LeggiDeterminatori();
        void CancellaClassificazioni(int idSottospecie);
        Sottospecie LeggiSottospecie(int idSottospecie);
        Task<bool> SalvaModifiche();
        void CancellaPreparati(int idEsemplare);
        void CancellaPreparazioni(int idEsemplare);
        void CancellaVecchiDeterminatori(int[] arrayIdVecchieDeterminazioni);
       
        /// <summary>
        /// Cancella dalla tabella Determinazioni tutte le determinazioni relative ad uno specifico esemplare
        /// </summary>
        /// <param name="idEsemplare">Id dell'esemplare per cui cancellare le determinazioni</param>
        void CancellaDeterminazioni(int idEsemplare);
        void CancellaVecchieDeterminazioni(int idEsemplare);
        void InserisciVecchiDeterminatori(VecchiDeterminatori determinatoreDaInserire);
        IEnumerable<ElencoSpecieViewModel> LeggiElencoSpecie();
        int LeggiIDSessoIndeterminato();
        int LeggiIDLocalitaIndeterminata();
        int LeggiIDRaccoglitoreIndeterminato();
        int LeggiIDCollezioneIndeterminata();
        int LeggiIDSpedizioneIndeterminata();
        int LeggiIDTipoIndeterminato();
        int LeggiIDAberrazioneIndeterminata();
        int LeggiIDTipoAcquisizioneIndeterminato();
        void AggiungiEsemplare(Esemplari esemplareDaInserire);
        IEnumerable<Nazioni> LeggiNazioni();
        IEnumerable<Regioni> LeggiRegioni();
        IEnumerable<Regioni> LeggiRegioni(int idNazione);
        IEnumerable<Province> LeggiProvince();
        IEnumerable<Province> LeggiProvince(int idRegione);
        IEnumerable<Citta> LeggiCitta();
        IEnumerable<Citta> LeggiCitta(int idProvincia);
        IEnumerable<Localita> LeggiLocalita();
        IEnumerable<Localita> LeggiLocalita(int idCitta);
        IEnumerable<Nazioni> LeggiGeografia();
        IEnumerable<TipiAcquisizioneLocalizzatiViewModel> LeggiTipiAcquisizione();
        IEnumerable<Collezioni> LeggiCollezioni();
        IEnumerable<Spedizioni> LeggiSpedizioni();
        IEnumerable<Raccoglitori> LeggiRaccoglitori();
        IEnumerable<SessiLocalizzatiViewModel> LeggiSessi();
        IEnumerable<TipiLocalizzatiViewModel> LeggiTipi();
        IEnumerable<AberrazioniLocalizzateViewModel> LeggiAberrazioni();
        IEnumerable<Preparatori> LeggiPreparatori();
        IEnumerable<Preparazioni> LeggiPreparazioni();
        IEnumerable<Preparazioni> LeggiPreparazioni(int idEsemplare);
        IEnumerable<Determinatori> LeggiDeterminatori(int idEsemplare);
        void CancellaEsemplare(int idEsemplare);
    }
}