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
using System.Security.Claims;
using System.Threading.Tasks;

namespace Papero.Models
{
    public class AuthRepository : IAuthRepository
    {
        private PaperoDBContext _contesto;
        private ILogger<AuthRepository> _log;
        private UserManager<UtentePapero> _gestoreUtenti;
        private RoleManager<IdentityRole> _gestoreRuoli;
        private SignInManager<UtentePapero> _gestoreLogin;

        public AuthRepository(PaperoDBContext contesto,
                                ILogger<AuthRepository> log,
                                UserManager<UtentePapero> gestoreUtenti,
                                RoleManager<IdentityRole> gestoreRuoli,
                                SignInManager<UtentePapero> gestoreLogin)
        {
            _contesto = contesto;
            _log = log;
            _gestoreUtenti = gestoreUtenti;
            _gestoreRuoli = gestoreRuoli;
            _gestoreLogin = gestoreLogin;
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

        public IEnumerable<IdentityRole> LeggiRuoli()
        {
            return _gestoreRuoli.Roles
                .Include(ruolo => ruolo.Users)
                .Include(ruolo => ruolo.Claims)
                .ToList();
        }

        public IEnumerable<IdentityRole> LeggiRuoli(string idRuolo)
        {
            return _gestoreRuoli.Roles
                .Where(ruolo => ruolo.Id == idRuolo)
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

        public async Task<bool> PostUtente(UtentePaperoConAutorizzazioni utente)
        {
            var utenteDaInserire = new UtentePapero();  // variabile temporanea perché passiamo un utente con i ruoli mentre CreateAsync si aspetta un utente senza ruoli

            utenteDaInserire.Nome = utente.Nome;  // riempiamo i campi della variabile temporanea
            utenteDaInserire.Cognome = utente.Cognome;
            utenteDaInserire.Email = utente.Email;
            utenteDaInserire.PhoneNumber = utente.PhoneNumber;
            utenteDaInserire.UserName = utente.UserName;

            var risultato = await _gestoreUtenti.CreateAsync(utenteDaInserire, utente.password);  // tentiamo di creare il nuovo utente

            if (risultato.Succeeded)  // se ci siamo riusciti...
            {
                for (int i = 0; i < utente.Ruoli.Length; i++)  // ...cicliamo sui ruoli da aggiungere...
                {
                    risultato = await _gestoreUtenti.AddToRoleAsync(utenteDaInserire, utente.Ruoli[i].Name);  // ...e li aggiungiamo tutti
                    if (!risultato.Succeeded) break;  // ma se si verifica un errore interrompiamo immediatamente
                }
            }
            return risultato.Succeeded;
        }

        public async Task PostRuolo(RuoloPapero ruolo)
        {
            var ruoloDaCreare = new IdentityRole();             // Istanzia il ruolo da creare...
            ruoloDaCreare.Name = ruolo.Ruolo;                   // ...e gli dà il nome corretto
            await _gestoreRuoli.CreateAsync(ruoloDaCreare);     // Crea il ruolo nel database
            ruolo.Id = ruoloDaCreare.Id;                        // Tiene traccia dell'ID appena creato così da poterlo restituire
            for (int i = 0; i < ruolo.Policies.Length; i++)     // Aggiunge al ruolo tutti i claim selezionati nella tabella
            {
                await _gestoreRuoli.AddClaimAsync(ruoloDaCreare, new Claim(ruolo.Policies[i].Policy, "true"));
            }
        }

        public async Task PutRuolo(RuoloPapero ruolo)
        {
            var ruoloDaAggiornare = await _gestoreRuoli.FindByIdAsync(ruolo.Id);  // Istanzia l'oggetto ruolo partendo dal suo Id
            var claimsDaEliminare = await _gestoreRuoli.GetClaimsAsync(ruoloDaAggiornare);  // Trova la lista dei claim del ruolo

            if (ruoloDaAggiornare.Name != "Amministratore")  // Precauzione in più per evitare di modificare il ruolo amministratore. In realtà la UI già blocca
                                                             // l'accesso nascondendo i pulsanti, ma così evitiamo hacking via client.
            {
                await _gestoreRuoli.SetRoleNameAsync(ruoloDaAggiornare, ruolo.Ruolo);  // Modifica il nome del ruolo. IMPORTANTE: la modifica non ha effetto fino all'UpdateAsync finale

                for (int i = 0; i < claimsDaEliminare.Count; i++)  // Elimina tutti i vecchi claim del ruolo
                {
                    await _gestoreRuoli.RemoveClaimAsync(ruoloDaAggiornare, claimsDaEliminare[i]);
                };

                for (int i = 0; i < ruolo.Policies.Length; i++)  // Inserisce i nuovi claim
                {
                    await _gestoreRuoli.AddClaimAsync(ruoloDaAggiornare, new Claim(ruolo.Policies[i].Policy, "true"));
                }

                await _gestoreRuoli.UpdateAsync(ruoloDaAggiornare);  // Esegue l'effettivo update del ruolo

                var utentiDaAggiornare = await _gestoreUtenti.GetUsersInRoleAsync(ruolo.Ruolo);  // Trova la lista degli utenti appartenenti al ruolo modificato

                for (int i = 0; i < utentiDaAggiornare.Count; i++)  // Per ciascun utente, rigenera il cookie (cioè in pratica applica le nuove policies appena modificate)
                {
                    await _gestoreLogin.RefreshSignInAsync(utentiDaAggiornare[i]);
                }
            }
        }

        public async Task DeleteRuolo(string idRuolo)
        {
            var ruoloDaCancellare = await _gestoreRuoli.FindByIdAsync(idRuolo);  // Istanzia l'oggetto ruolo partendo dal suo Id

            if (ruoloDaCancellare.Name != "Amministratore")  // Precauzione in più per evitare di cancellare il ruolo amministratore. In realtà la UI già blocca
                                                             // l'accesso nascondendo i pulsanti, ma così evitiamo hacking via client.
            {
                await _gestoreRuoli.DeleteAsync(ruoloDaCancellare);  // E' sufficiente così: i claim associati al ruolo vengono cancellati "gratis" dal delete
            }  
        }

        public async Task PutUtente(UtentePaperoConAutorizzazioni utente)
        {
            var utenteDaAggiornare = await _gestoreUtenti.FindByIdAsync(utente.Id);  // Istanzia l'oggetto utente partendo dal suo Id
            var ruoliDaEliminare = await _gestoreUtenti.GetRolesAsync(utenteDaAggiornare);

            utenteDaAggiornare.Nome = utente.Nome;
            utenteDaAggiornare.Cognome = utente.Cognome;
            utenteDaAggiornare.Email = utente.Email;
            utenteDaAggiornare.PhoneNumber = utente.PhoneNumber;

            await _gestoreUtenti.RemoveFromRolesAsync(utenteDaAggiornare, ruoliDaEliminare);

            for (int i = 0; i < utente.Ruoli.Length; i++)
            {
                await _gestoreUtenti.AddToRoleAsync(utenteDaAggiornare, utente.Ruoli[i].Name);
            }

            await _gestoreUtenti.UpdateAsync(utenteDaAggiornare);    
        }

        public async Task DeleteUtente(string idUtente)
        {
            var utenteDaCancellare = await _gestoreUtenti.FindByIdAsync(idUtente);  // Istanzia l'oggetto utente partendo dal suo Id

            if (utenteDaCancellare.UserName != "amministratore")  // Precauzione in più per evitare di cancellare l'amministratore. In realtà la UI già blocca
                                                                  // l'accesso nascondendo i pulsanti, ma così evitiamo hacking via client.
            {
                await _gestoreUtenti.DeleteAsync(utenteDaCancellare);  // E' sufficiente così: i ruoli associati all'utente vengono cancellati "gratis" dal delete
            }
        }
    }
}
