using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Localita
    {
        public Localita()
        {
            Esemplari = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public int? CittaId { get; set; }
        public string NomeLocalita { get; set; }
        public string Latitudine { get; set; }
        public string Longitudine { get; set; }

        public virtual ICollection<Esemplari> Esemplari { get; set; }
        public virtual Citta Citta { get; set; }
    }
}
