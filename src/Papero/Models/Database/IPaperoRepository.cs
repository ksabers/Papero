using System.Collections.Generic;

namespace Papero.Models
{
    public interface IPaperoRepository
    {
        IEnumerable<Famiglie> LeggiAlbero();
        IEnumerable<ElencoSinteticoEsemplari> LeggiElencoSinteticoEsemplari();

        IEnumerable<Esemplari> ElencoEsemplari();

        ElencoSinteticoEsemplari LeggiSingoloEsemplareDaElencoSintetico(int idEsemplare);
        Esemplari LeggiEsemplare(int esemplareId);
        int EsemplareIdDaMSNG(int MSNG);
    }
}