using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class StatiConservazione
    {
        public StatiConservazione()
        {
            Sottospecie = new HashSet<Sottospecie>();
        }

        public int Id { get; set; }
        public string StatoConservazione { get; set; }
        public string Sigla { get; set; }

        public virtual ICollection<Sottospecie> Sottospecie { get; set; }
    }
}
