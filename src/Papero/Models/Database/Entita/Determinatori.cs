using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Determinatori
    {
        public Determinatori()
        {
            Determinazioni = new HashSet<Determinazioni>();
            VecchiDeterminatori = new HashSet<VecchiDeterminatori>();
        }

        public int Id { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }

        public virtual ICollection<Determinazioni> Determinazioni { get; set; }
        public virtual ICollection<VecchiDeterminatori> VecchiDeterminatori { get; set; }
    }
}
