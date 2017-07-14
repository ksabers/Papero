using Papero.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.ViewModels
{
    public class AlberoRegioneViewModel
    {

        public int idRegione { get; set; }
        public string Nome { get; set; }

        public ICollection<AlberoProvinciaViewModel> Figli { get; set; }

    }
}
