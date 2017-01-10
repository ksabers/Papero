using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Cassetti
    {
        public Cassetti()
        {
            Vassoi = new HashSet<Vassoi>();
        }

        public int Id { get; set; }
        public int ArmadioId { get; set; }
        public string Cassetto { get; set; }

        public virtual ICollection<Vassoi> Vassoi { get; set; }
        public virtual Armadi Armadio { get; set; }
    }
}
