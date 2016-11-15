using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Preparati
    {
        public int Id { get; set; }
        public int? EsemplareId { get; set; }
        public int? ParteId { get; set; }
        public int? CassettoId { get; set; }
        public int? Ordinamento { get; set; }

        public virtual Cassetti Cassetto { get; set; }
        public virtual Esemplari Esemplare { get; set; }
        public virtual PartiPreparate Parte { get; set; }
    }
}
