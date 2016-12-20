using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Papero.Models;

namespace Papero.ViewModels
{
    public class DettaglioEsemplareViewModel
    {
        private IEnumerable<Esemplari> _data;

        public DettaglioEsemplareViewModel(IEnumerable<Esemplari> data)
        {
            _data = data;
        }

        public int Id { get; set; }
        public int SottospecieId { get; set; }
        public int Msng { get; set; }
        public int? Ncu { get; set; }
        public string Sesso { get; set; }

    }
}
