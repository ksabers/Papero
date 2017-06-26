using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Papero.Models;
using System.ComponentModel.DataAnnotations;

namespace Papero.ViewModels
{
    public class QRCodeListaViewModel
    {
        public int Id { get; set; }

        public string formato { get; set; }

        public string urlQRCode { get; set; }

        public int MSNG { get; set; }

        public string testoQRCode { get; set; }

    }
}
