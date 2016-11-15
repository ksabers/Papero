using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Aberrazioni
    {
        public Aberrazioni()
        {
            Esemplari = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public string Aberrazione { get; set; }

        public virtual ICollection<Esemplari> Esemplari { get; set; }
    }
}
