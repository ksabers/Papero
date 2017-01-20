using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class ElencoClassificatoriViewModel
    {
        public ElencoClassificatoriViewModel()
        {
            Classificazioni = new HashSet<Classificazioni>();
        }

        public int Id { get; set; }
        public string Classificatore { get; set; }

        public virtual ICollection<Classificazioni> Classificazioni { get; set; }
    }
}
