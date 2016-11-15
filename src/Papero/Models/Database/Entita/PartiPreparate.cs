using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class PartiPreparate
    {
        public PartiPreparate()
        {
            Preparati = new HashSet<Preparati>();
        }

        public int Id { get; set; }
        public string Parte { get; set; }

        public virtual ICollection<Preparati> Preparati { get; set; }
    }
}
