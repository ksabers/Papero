using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Classificazioni
    {
        public int Id { get; set; }
        public int SottospecieId { get; set; }
        public int ClassificatoreId { get; set; }
        public int Ordinamento { get; set; }

        public virtual Classificatori Classificatore { get; set; }
        public virtual Sottospecie Sottospecie { get; set; }
    }
}
