using Papero.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.ViewModels
{
    public class AlberoCittaViewModel
    {

        public int IdCitta { get; set; }
        public string Nome { get; set; }
        public string CodiceIstat { get; set; }
        public string CodiceCatastale { get; set; }

        public ICollection<AlberoLocalitaViewModel> Figli { get; set; }

    }
}
