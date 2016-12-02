using System;
using System.Collections.Generic;

namespace Papero.Models
{
    public partial class ElencoSinteticoEsemplari
    {

        public int Id { get; set; }
        public int Msng { get; set; }
        public int FamigliaId { get; set; }
        public string Famiglia { get; set; }
        public int SottofamigliaId { get; set; }
        public string Sottofamiglia { get; set; }
        public int TribuId { get; set; }
        public string Tribu { get; set; }
        public int GenereId { get; set; }
        public string Genere { get; set; }
        public int SpecieId { get; set; }
        public string Specie { get; set; }
        public int SottospecieId { get; set; }
        public string Sottospecie { get; set; }

        public bool? ClassificazioneOriginale { get; set; }
        public string AnnoClassificazione { get; set; }
        public string ElencoAutori { get; set; }
        public int NumeroAutori { get; set; }

    }
}
