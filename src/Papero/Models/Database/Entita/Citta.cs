using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Citta
    {
        public Citta()
        {
            Localita = new HashSet<Localita>();
        }

        public int Id { get; set; }
        public int? ProvinciaId { get; set; }
        public string NomeCitta { get; set; }
        public string CodiceIstat { get; set; }
        public string CodiceCatastale { get; set; }

        public virtual ICollection<Localita> Localita { get; set; }
        public virtual Province Provincia { get; set; }
    }
}
