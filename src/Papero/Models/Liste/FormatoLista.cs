using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class FormatoLista
    {
        public FormatoLista()
        {

        }

        public string Nome { get; set; }
        public string Intestazione { get; set; }
        public List<string> Campi { get; set; }
        
    }
}
