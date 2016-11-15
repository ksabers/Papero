using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class VecchieDeterminazioni
    {
        public VecchieDeterminazioni()
        {
            VecchiDeterminatori = new HashSet<VecchiDeterminatori>();
        }

        public int Id { get; set; }
        public int? EsemplareId { get; set; }
        public string VecchiaDeterminazione { get; set; }
        public int? Ordinamento { get; set; }

        public virtual ICollection<VecchiDeterminatori> VecchiDeterminatori { get; set; }
        public virtual Esemplari Esemplare { get; set; }
    }
}
