using Papero.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.ViewModels
{
    public class AlberoLocalitaViewModel
    {
        public int IdLocalita { get; set; }
        public string Nome { get; set; }
        public string Latitudine { get; set; }
        public string Longitudine { get; set; }


    }
}
