using Papero.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.ViewModels
{
    public class ElencoSpecieViewModel
    {
        public int Id { get; set; }
        public int SpecieId { get; set; }
        public string Nome{ get; set; }
        public string Genere { get; set; }
        public string Specie { get; set; }
        public string Sottospecie { get; set; }
        public string ElencoAutori { get; set; }
    }
}
