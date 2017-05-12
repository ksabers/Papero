// AuthRepository.cs
//
// Metodi che implementano le query relative alla gestione degli utenti e della sicurezza
//
// La documentazione di ciascun metodo è nell'interfaccia corrispondente

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Papero.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class AuthRepository : IAuthRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<AuthRepository> _log;
        private UserManager<UtentePapero> _gestoreUtenti;
        private RoleManager<IdentityRole> _gestoreRuoli;

        public AuthRepository(PaperoDBContext contesto,
                                ILogger<AuthRepository> log,
                                UserManager<UtentePapero> gestoreUtenti,
                                RoleManager<IdentityRole> gestoreRuoli)
        {
            _contesto = contesto;
            _log = log;
            _gestoreUtenti = gestoreUtenti;
            _gestoreRuoli = gestoreRuoli;
        }

        public IEnumerable<UtentePapero> LeggiUtenti()
        {
            return _gestoreUtenti.Users
                .Include(utente => utente.Roles)
                .Include(utente => utente.Claims)
                .ToList(); 
        }

        public IEnumerable<UtentePapero> LeggiUtenti(string idUtente)
        {
            return _gestoreUtenti.Users
                .Where(utente => utente.Id == idUtente)
                .Include(utente => utente.Roles)
                .Include(utente => utente.Claims)
                .ToList();
        }

        public void PostUtente(UtentePapero utente, string password)
        {
            _gestoreUtenti.CreateAsync(utente, password);
        }

        public IEnumerable<IdentityRole> LeggiRuoli()
        {
            return _gestoreRuoli.Roles
                .Include(ruolo => ruolo.Users)
                .Include(ruolo => ruolo.Claims)
                .ToList();
        }

        public async Task<IEnumerable<PolicyPapero>> LeggiPolicies()
        {
            return _gestoreRuoli.GetClaimsAsync(await _gestoreRuoli.FindByNameAsync("Amministratore")).Result
                .Select(claim => new PolicyPapero
                {
                    Policy = claim.Type
                }
                ).ToList();
        }

 
    }
}
