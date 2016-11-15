using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Tribu
    {
        public Tribu()
        {
            Generi = new HashSet<Generi>();
        }

        public int Id { get; set; }
        public int SottofamigliaId { get; set; }
        public string NomeTribu { get; set; }

        public virtual ICollection<Generi> Generi { get; set; }
        public virtual Sottofamiglie Sottofamiglia { get; set; }
    }
}
