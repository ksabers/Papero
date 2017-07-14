using Papero.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.ViewModels
{
    public class AlberoNazioneViewModel
    {

        public int idNazione { get; set; }
        public string Nome { get; set; }
        public string Iso31661Alpha3 { get; set; }
        public string Iso31661Alpha2 { get; set; }
        public string Iso31661 { get; set; }

        public ICollection<AlberoRegioneViewModel> Figli { get; set; }

    }
}
