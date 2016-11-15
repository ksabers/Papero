using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Sessi
    {
        public Sessi()
        {
            Esemplari = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public string Sesso { get; set; }

        public virtual ICollection<Esemplari> Esemplari { get; set; }
    }
}
