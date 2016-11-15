using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Nazioni
    {
        public Nazioni()
        {
            Regioni = new HashSet<Regioni>();
        }

        public int Id { get; set; }
        public string Nazione { get; set; }
        public string Iso31661Alpha3 { get; set; }
        public string Iso31661Alpha2 { get; set; }
        public string Iso31661 { get; set; }

        public virtual ICollection<Regioni> Regioni { get; set; }
    }
}
