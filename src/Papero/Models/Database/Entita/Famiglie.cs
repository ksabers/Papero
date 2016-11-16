using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Famiglie
    {
        public Famiglie()
        {
            Figli = new HashSet<Sottofamiglie>();
        }

        public int Id { get; set; }
        public string Nome { get; set; }
        public bool? Passeriforme { get; set; }

        public virtual ICollection<Sottofamiglie> Figli { get; set; }
    }
}
