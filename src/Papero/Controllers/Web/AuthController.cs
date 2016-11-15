using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Papero.Models;
using Papero.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Papero.Controllers
{
    public class AuthController : Controller
    {
        private SignInManager<UtentePapero> _gestoreLogin;
        private IStringLocalizer<AuthController> _localizzatore;

        public AuthController(SignInManager<UtentePapero> gestoreLogin,
                              IStringLocalizer<AuthController> localizzatore)
        {
            _gestoreLogin = gestoreLogin;
            _localizzatore = localizzatore;
        }
        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Famiglie", "Papero");
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
                        return RedirectToAction("Famiglie", "Papero");
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
    }
}
