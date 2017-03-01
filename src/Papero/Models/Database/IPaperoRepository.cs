using Papero.ViewModels;
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
        void CancellaVecchiDeterminatori(int[] arrayIdVecchieDeterminazioni);
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
    }
}