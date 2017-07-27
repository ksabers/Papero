using Papero.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Papero.ViewModels
{
    public class SottospecieViewModel
    {
        public int Id { get; set; }
        public int SpecieId { get; set; }
        public string Nome { get; set; }
        public string AnnoClassificazione { get; set; }
        public bool? ClassificazioneOriginale { get; set; }
        public string NomeItaliano { get; set; }
        public string NomeInglese { get; set; }
        public string ElencoAutori { get; set; }
        public int? StatoConservazioneId { get; set; }
        public ICollection<ClassificatoreViewModel> Classificatori { get; set; }
    }
}
