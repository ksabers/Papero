using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Armadi
    {
        public Armadi()
        {
            Cassetti = new HashSet<Cassetti>();
        }

        public int Id { get; set; }
        public int SalaId { get; set; }
        public string Armadio { get; set; }

        public virtual ICollection<Cassetti> Cassetti { get; set; }
        public virtual Sale Sala { get; set; }
    }
}
