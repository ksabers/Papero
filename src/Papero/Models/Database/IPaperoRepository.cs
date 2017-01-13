using System.Collections.Generic;

namespace Papero.Models
{
    public interface IPaperoRepository
    {
        IEnumerable<Famiglie> LeggiAlbero();
        IEnumerable<ElencoSinteticoEsemplari> LeggiElencoSinteticoEsemplari();
        ElencoSinteticoEsemplari LeggiSingoloEsemplareDaElencoSintetico(int idEsemplare);
        Esemplari LeggiEsemplare(int esemplareId);
        int EsemplareIdDaMSNG(int MSNG);
        IEnumerable<StatiConservazione> LeggiStatiConservazione();
    }
}