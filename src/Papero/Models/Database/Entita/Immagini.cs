using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Immagini
    {
        public int Id { get; set; }
        public int EsemplareId { get; set; }
        public string URL { get; set; }
        public string Didascalia { get; set; }

        public virtual Esemplari Esemplare { get; set; }
    }
}
