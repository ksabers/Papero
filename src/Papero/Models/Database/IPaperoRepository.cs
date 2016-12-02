using System.Collections.Generic;

namespace Papero.Models
{
    public interface IPaperoRepository
    {
        IEnumerable<Famiglie> LeggiAlbero();
        IEnumerable<ElencoSinteticoEsemplari> LeggiElencoSinteticoEsemplari();

        //IEnumerable<Tassonomia> LeggiTassonomia();
    }
}