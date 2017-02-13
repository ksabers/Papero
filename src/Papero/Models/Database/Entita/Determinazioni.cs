using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Determinazioni
    {
        public int? EsemplareId { get; set; }
        public int? DeterminatoreId { get; set; }
        public int Ordinamento { get; set; }

        public virtual Determinatori Determinatore { get; set; }
        public virtual Esemplari Esemplare { get; set; }
    }
}
