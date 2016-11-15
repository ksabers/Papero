using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Generi
    {
        public Generi()
        {
            Specie = new HashSet<Specie>();
        }

        public int Id { get; set; }
        public int TribuId { get; set; }
        public string Genere { get; set; }

        public virtual ICollection<Specie> Specie { get; set; }
        public virtual Tribu Tribu { get; set; }
    }
}
