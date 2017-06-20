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
        public async Task<IActionResult> Test()
        {
            await _gestoreUtenti.AddClaimAsync(await _gestoreUtenti.FindByNameAsync(User.Identity.Name), new Claim("CancellazioneEsemplare", "true"));
            await _gestoreLogin.RefreshSignInAsync(await _gestoreUtenti.FindByNameAsync(User.Identity.Name));
            return RedirectToAction("ElencoEsemplari", "Papero");
        }

        [Authorize]
        public async Task<IActionResult> Test2()
        {
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("InserimentoEsemplare", "true"));

            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("CancellazioneEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaElencoAutori", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaNomiSottospecie", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaPresenzaEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaDatiGeneraliEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaDatiGeografiaEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaDatiDeterminazioniEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaDatiVecchieDeterminazioniEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaModiPreparazioneEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaPreparazioneEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaMorfologiaEsemplare", "true"));
            await _gestoreRuoli.AddClaimAsync(await _gestoreRuoli.FindByNameAsync("Amministratore"), new Claim("ModificaBibliografiaNoteEsemplare", "true"));
            await _gestoreLogin.RefreshSignInAsync(await _gestoreUtenti.FindByNameAsync(User.Identity.Name));
            return RedirectToAction("ElencoEsemplari", "Papero");
        }

    }
}
