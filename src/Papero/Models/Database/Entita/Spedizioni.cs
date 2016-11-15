using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Spedizioni
    {
        public Spedizioni()
        {
            Esemplari = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public string Spedizione { get; set; }

        public virtual ICollection<Esemplari> Esemplari { get; set; }
    }
}
