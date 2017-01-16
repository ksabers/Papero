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
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoSinteticoEsemplari();
        ElencoSinteticoEsemplari LeggiSingoloEsemplareDaElencoSintetico(int idEsemplare);
        Esemplari LeggiEsemplare(int esemplareId);
        int EsemplareIdDaMSNG(int MSNG);
        IEnumerable<StatiConservazione> LeggiStatiConservazione();

        void AggiornaNomeItaliano(int idSottospecie, string putNomeItaliano);
        Task<bool> SalvaModifiche();

    }
}