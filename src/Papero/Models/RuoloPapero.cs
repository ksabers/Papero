using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class RuoloPapero
    {
        public string Id { get; set; }
        public string Ruolo { get; set; }
        public PolicyPapero[] Policies { get; set; }
    }
}
