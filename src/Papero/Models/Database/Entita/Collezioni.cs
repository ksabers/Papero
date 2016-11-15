using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Collezioni
    {
        public Collezioni()
        {
            Esemplari = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public string Collezione { get; set; }

        public virtual ICollection<Esemplari> Esemplari { get; set; }
    }
}
