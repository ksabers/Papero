using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Province
    {
        public Province()
        {
            Citta = new HashSet<Citta>();
        }

        public int Id { get; set; }
        public int? RegioneId { get; set; }
        public string Provincia { get; set; }
        public string SiglaProvincia { get; set; }

        public virtual ICollection<Citta> Citta { get; set; }
        public virtual Regioni Regione { get; set; }
    }
}
