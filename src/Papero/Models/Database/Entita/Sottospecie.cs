using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class Sottospecie
    {
        public Sottospecie()
        {
            Classificazioni = new HashSet<Classificazioni>();
            Esemplari = new HashSet<Esemplari>();
        }

        public int Id { get; set; }
        public int SpecieId { get; set; }
        public string Nome { get; set; }
        public string AnnoClassificazione { get; set; }
        public bool? ClassificazioneOriginale { get; set; }
        public string NomeItaliano { get; set; }
        public string NomeInglese { get; set; }
        public string ElencoAutori { get; set; }
        public int? StatoConservazioneId { get; set; }
        public virtual ICollection<Classificazioni> Classificazioni { get; set; }

        public virtual ICollection<Esemplari> Esemplari { get; set; }
        public virtual Specie Specie { get; set; }
        public virtual StatiConservazione StatoConservazione { get; set; }
    }
}
