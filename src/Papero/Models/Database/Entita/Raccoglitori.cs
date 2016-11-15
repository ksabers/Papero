using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Raccoglitori
    {
        public Raccoglitori()
        {
            EsemplariAvutoDa = new HashSet<Esemplari>();
            EsemplariCedente = new HashSet<Esemplari>();
            EsemplariLegit = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public string Raccoglitore { get; set; }

        public virtual ICollection<Esemplari> EsemplariAvutoDa { get; set; }
        public virtual ICollection<Esemplari> EsemplariCedente { get; set; }
        public virtual ICollection<Esemplari> EsemplariLegit { get; set; }
    }
}
