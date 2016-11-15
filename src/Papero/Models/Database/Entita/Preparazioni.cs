using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Preparazioni
    {
        public int Id { get; set; }
        public int? EsemplareId { get; set; }
        public int? PreparatoreId { get; set; }
        public int? Ordinamento { get; set; }

        public virtual Esemplari Esemplare { get; set; }
        public virtual Preparatori Preparatore { get; set; }
    }
}
