using Papero.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.ViewModels
{
    public class AlberoSalaViewModel
    {

        public int idSala { get; set; }
        public string Nome { get; set; }

        public ICollection<AlberoArmadioViewModel> Figli { get; set; }

    }
}
