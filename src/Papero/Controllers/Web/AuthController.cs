using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Papero.Models;
using Papero.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class AuthController : Controller
    {
        private SignInManager<UtentePapero> _gestoreLogin;
        private IStringLocalizer<AuthController> _localizzatore;
        private UserManager<UtentePapero> _gestoreUtenti;
        private RoleManager<IdentityRole> _gestoreRuoli;

        public AuthController(SignInManager<UtentePapero> gestoreLogin,
                              IStringLocalizer<AuthController> localizzatore,
                              UserManager<UtentePapero> gestoreUtenti,
                              RoleManager<IdentityRole> gestoreRuoli)

        {
            _gestoreLogin = gestoreLogin;
            _localizzatore = localizzatore;
            _gestoreUtenti = gestoreUtenti;
            _gestoreRuoli = gestoreRuoli;
        }
        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("ElencoEsemplari", "Papero");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel vm, string URLdiRitorno)
        {
            if (ModelState.IsValid)
            {
                var risultatoLogin = await _gestoreLogin.PasswordSignInAsync(vm.Username, vm.Password, vm.Persistente, false);

                if (risultatoLogin.Succeeded)
                {
                    if (string.IsNullOrWhiteSpace(URLdiRitorno))
                    {
                        return RedirectToAction("ElencoEsemplari", "Papero");
                    }
                    else
                    {
                        return RedirectToAction(URLdiRitorno);
                    }
                }
                else
                {
                    ModelState.AddModelError("", _localizzatore["errorelogin"]);
                }
            }

            return View();
        }

        public async Task<IActionResult> Logout()
        {
            if (User.Identity.IsAuthenticated)
            {
                await _gestoreLogin.SignOutAsync();
            }

            return RedirectToAction("Login", "Auth");
        }

        [Authorize(Policy = "GestioneUtenti")]
        public  IActionResult Utenti()
        {
            return View();
        }

        [Authorize(Policy = "GestioneUtenti")]
        public IActionResult Ruoli()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> Profilo()
        {
            return View(await _gestoreUtenti.FindByNameAsync(User.Identity.Name));
        }

        [Authorize]
        public async Task<IActionResult> AggiornaProfilo(string inputInsertNome, 
                                                         string inputInsertCognome,
                                                         string inputInsertEmail,
                                                         string inputInsertTelefono,
                                                         string inputInsertPassword)
        {

            var utenteAttuale = await _gestoreUtenti.FindByNameAsync(User.Identity.Name);                       // troviamo l'utente corrente dal suo username

            utenteAttuale.Nome = string.IsNullOrEmpty(inputInsertNome) ? "" : inputInsertNome.Trim();           // aggiorniamo i suoi campi
            utenteAttuale.Cognome = string.IsNullOrEmpty(inputInsertCognome)? "" : inputInsertCognome.Trim();
            utenteAttuale.Email = string.IsNullOrEmpty(inputInsertEmail) ? "" : inputInsertEmail.Trim();
            utenteAttuale.PhoneNumber = string.IsNullOrEmpty(inputInsertTelefono) ? "" : inputInsertTelefono.Trim();

            if ((string.IsNullOrEmpty(inputInsertPassword) ? "" : inputInsertPassword.Trim()) != "")            // eventualmente aggiorniamo anche la sua password
            {                                                                                                   // (cancellando la vecchia e mettendone una nuova)
                await _gestoreUtenti.RemovePasswordAsync(utenteAttuale);
                await _gestoreUtenti.AddPasswordAsync(utenteAttuale, inputInsertPassword.Trim());
            }

            await _gestoreUtenti.UpdateAsync(utenteAttuale);                                                    // aggiorniamo l'utente corrente
            await _gestoreLogin.RefreshSignInAsync(await _gestoreUtenti.FindByNameAsync(User.Identity.Name));   // e ne rigeneriamo i token

            return RedirectToAction("Profilo");
        }
    }
}
