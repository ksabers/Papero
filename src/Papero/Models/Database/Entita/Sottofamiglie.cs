using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Sottofamiglie
    {
        public Sottofamiglie()
        {
            Tribu = new HashSet<Tribu>();
        }

        public int Id { get; set; }
        public int FamigliaId { get; set; }
        public string Sottofamiglia { get; set; }

        public virtual ICollection<Tribu> Tribu { get; set; }
        public virtual Famiglie Famiglia { get; set; }
    }
}
