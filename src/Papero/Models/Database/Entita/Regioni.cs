using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Regioni
    {
        public Regioni()
        {
            Province = new HashSet<Province>();
        }

        public int Id { get; set; }
        public int? NazioneId { get; set; }
        public string Regione { get; set; }

        public virtual ICollection<Province> Province { get; set; }
        public virtual Nazioni Nazione { get; set; }
    }
}
