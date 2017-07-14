using Papero.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.ViewModels
{
    public class AlberoProvinciaViewModel
    {

        public int IdProvincia { get; set; }
        public string Nome { get; set; }
        public string SiglaProvincia { get; set; }
        public ICollection<AlberoCittaViewModel> Figli { get; set; }

    }
}
