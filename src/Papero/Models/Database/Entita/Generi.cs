using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Generi
    {
        public Generi()
        {
            Figli = new HashSet<Specie>();
        }

        public int Id { get; set; }
        public int TribuId { get; set; }
        public string Nome { get; set; }

        public virtual ICollection<Specie> Figli { get; set; }
        public virtual Tribu Tribu { get; set; }
    }
}
