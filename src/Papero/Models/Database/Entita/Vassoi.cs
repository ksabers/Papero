using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Vassoi
    {
        public Vassoi()
        {
            Preparati = new HashSet<Preparati>();
        }

        public int Id { get; set; }
        public int CassettoId { get; set; }
        public string Vassoio { get; set; }

        public virtual ICollection<Preparati> Preparati { get; set; }
        public virtual Cassetti Cassetto { get; set; }
    }
}
