using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class UtentePaperoConAutorizzazioni : UtentePapero
    {
        public string password { get; set; }
        public AutorizzazionePapero[] Ruoli { get; set; }
    }
}
