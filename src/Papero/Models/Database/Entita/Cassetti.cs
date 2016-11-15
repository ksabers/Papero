using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Cassetti
    {
        public Cassetti()
        {
            Preparati = new HashSet<Preparati>();
        }

        public int Id { get; set; }
        public int ArmadioId { get; set; }
        public string Cassetto { get; set; }

        public virtual ICollection<Preparati> Preparati { get; set; }
        public virtual Armadi Armadio { get; set; }
    }
}
