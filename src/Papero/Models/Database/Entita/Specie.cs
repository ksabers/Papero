using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Specie
    {
        public Specie()
        {
            Sottospecie = new HashSet<Sottospecie>();
        }

        public int Id { get; set; }
        public int GenereId { get; set; }
        public string NomeSpecie { get; set; }

        public virtual ICollection<Sottospecie> Sottospecie { get; set; }
        public virtual Generi Genere { get; set; }
    }
}
