using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Preparatori
    {
        public Preparatori()
        {
            Preparazioni = new HashSet<Preparazioni>();
        }

        public int Id { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }

        public virtual ICollection<Preparazioni> Preparazioni { get; set; }
    }
}
