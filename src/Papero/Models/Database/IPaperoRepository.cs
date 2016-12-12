using System.Collections.Generic;

namespace Papero.Models
{
    public interface IPaperoRepository
    {
        IEnumerable<Famiglie> LeggiAlbero();
        IEnumerable<ElencoSinteticoEsemplari> LeggiElencoSinteticoEsemplari();
        IEnumerable<ElencoSinteticoEsemplari> LeggiElencoSinteticoEsemplari(int idEsemplare);
        IEnumerable<Esemplari> LeggiEsemplare(int esemplareId);
    }
}