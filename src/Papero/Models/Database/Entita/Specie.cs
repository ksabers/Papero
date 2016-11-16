using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Specie
    {
        public Specie()
        {
            Figli = new HashSet<Sottospecie>();
        }

        public int Id { get; set; }
        public int GenereId { get; set; }
        public string Nome { get; set; }

        public virtual ICollection<Sottospecie> Figli { get; set; }
        public virtual Generi Genere { get; set; }
    }
}
