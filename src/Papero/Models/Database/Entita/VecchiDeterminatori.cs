using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class VecchiDeterminatori
    {
        public int Id { get; set; }
        public int? VecchiaDeterminazioneId { get; set; }
        public int? DeterminatoreId { get; set; }
        public int? Ordinamento { get; set; }

        public virtual Determinatori Determinatore { get; set; }
        public virtual VecchieDeterminazioni VecchiaDeterminazione { get; set; }
    }
}
