using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Famiglie
    {
        public Famiglie()
        {
            Sottofamiglie = new HashSet<Sottofamiglie>();
        }

        public int Id { get; set; }
        public string Famiglia { get; set; }
        public bool? Passeriforme { get; set; }

        public virtual ICollection<Sottofamiglie> Sottofamiglie { get; set; }
    }
}
