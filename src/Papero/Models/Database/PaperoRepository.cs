﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Papero.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class PaperoRepository : IPaperoRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<PaperoRepository> _log;

        public PaperoRepository(PaperoDBContext contesto,
                                ILogger<PaperoRepository> log)
        {
            _contesto = contesto;
            _log = log;
        }

        public IEnumerable<Famiglie> LeggiFamiglie()
        {
            _log.LogInformation("Chiamata di _contesto.Famiglie.OrderBy(f  => f.Famiglia).ToList()");
            return _contesto.Famiglie
                .Include(famiglia => famiglia.Sottofamiglie)
                .ThenInclude(sottofamiglia => sottofamiglia.Tribu)
                .ThenInclude(tribu => tribu.Generi)
                .ThenInclude(genere => genere.Specie)
                .ThenInclude(specie => specie.Sottospecie)
                .ToList();
        }
    }
}
