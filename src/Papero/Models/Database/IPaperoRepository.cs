using System.Collections.Generic;

namespace Papero.Models
{
    public interface IPaperoRepository
    {
        IEnumerable<Famiglie> LeggiFamiglie();
        IEnumerable<Esemplari> LeggiEsemplari();
    }
}