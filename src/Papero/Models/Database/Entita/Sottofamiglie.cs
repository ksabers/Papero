using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Sottofamiglie
    {
        public Sottofamiglie()
        {
            Figli = new HashSet<Tribu>();
        }

        public int Id { get; set; }
        public int FamigliaId { get; set; }
        public string Nome { get; set; }

        public virtual ICollection<Tribu> Figli { get; set; }
        public virtual Famiglie Famiglia { get; set; }
    }
}
