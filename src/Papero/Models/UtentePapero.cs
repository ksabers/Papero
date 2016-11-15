using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class UtentePapero : IdentityUser
    {
        public string Nome { get; set; }
        public string Cognome { get; set; }
    }
}
