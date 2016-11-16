using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Tribu
    {
        public Tribu()
        {
            Figli = new HashSet<Generi>();
        }

        public int Id { get; set; }
        public int SottofamigliaId { get; set; }
        public string Nome { get; set; }

        public virtual ICollection<Generi> Figli { get; set; }
        public virtual Sottofamiglie Sottofamiglia { get; set; }
    }
}
