using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Tipi
    {
        public Tipi()
        {
            Esemplari = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public string Tipo { get; set; }

        public virtual ICollection<Esemplari> Esemplari { get; set; }
    }
}
