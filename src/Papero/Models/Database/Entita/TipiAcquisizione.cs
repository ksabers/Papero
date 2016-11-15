using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class TipiAcquisizione
    {
        public TipiAcquisizione()
        {
            Esemplari = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public string TipoAcquisizione { get; set; }

        public virtual ICollection<Esemplari> Esemplari { get; set; }
    }
}
