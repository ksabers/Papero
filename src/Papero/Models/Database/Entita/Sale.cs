using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Sale
    {
        public Sale()
        {
            Armadi = new HashSet<Armadi>();
        }

        public int Id { get; set; }
        public string Sala { get; set; }

        public virtual ICollection<Armadi> Armadi { get; set; }
    }
}
