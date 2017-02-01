using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Preparati
    {
        //public int Id { get; set; }
        public int? EsemplareId { get; set; }
        public int? ParteId { get; set; }
        public int? VassoioId { get; set; }
        public int? Ordinamento { get; set; }

        public virtual Vassoi Vassoio { get; set; }
        public virtual Esemplari Esemplare { get; set; }
        public virtual PartiPreparate Parte { get; set; }
    }
}
