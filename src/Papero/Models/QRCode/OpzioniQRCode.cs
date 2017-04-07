using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class OpzioniQRCode
    {
        public OpzioniQRCode()
        {

        }

        public string URLScheda { get; set; }
        public string URLLink { get; set; }
        public int CaratteriMassimi { get; set; }
        public List<FormatoQRCode> Formati { get; set; }
        
    }
}
