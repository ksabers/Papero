// Classe di startup in cui configurare i servizi dell'applicazione

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.Razor;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Papero.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Papero.ViewModels;

namespace Papero
{
    public class Startup
    {
        private IHostingEnvironment _ambiente;      // oggetto che rappresenta l'ambiente in cui gira l'applicazione
        private IConfigurationRoot _configurazione; // oggetto che contiene tutte le informazioni di configurazione

        public Startup(IHostingEnvironment ambiente)  // Costruttore dello startup, in cui si passano i parametri necessari per la configurazione, come il tipo di ambiente (test, produzione, ecc.)
        {                                             // Si passano qui perché ConfigureServices non accetta altre dependency injections visto che le gestisce lei.

            _ambiente = ambiente;

            var costruttoreConfigurazione = new ConfigurationBuilder()  // Questa è la "configurazione della configurazione"
                .SetBasePath(_ambiente.ContentRootPath)  // Il file di configurazione è nella root dell'applicazione
                .AddJsonFile("appsettings.json")  // Nome del file di configurazione
                .AddEnvironmentVariables();       // Oltre al file JSON importiamo anche le variabili di ambiente 

            if (_ambiente.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                costruttoreConfigurazione.AddUserSecrets();
            }

            _configurazione = costruttoreConfigurazione.Build();  // Creiamo l'effettivo oggetto di configurazione
        }


        // Elenco e configurazione dei servizi dell'applicazione
        public void ConfigureServices(IServiceCollection servizi)
        {

            servizi.AddSingleton(_configurazione);  // Registrazione della configurazione, in modo da poterla iniettare dove serve
                                                    // Si usa AddSingleton perché la configurazione è unica per tutta l'applicazione, non serve rigenerarla ad ogni richiesta

            servizi.AddDbContext<PaperoDBContext>(opzioni =>                                      //Registrazione del contesto del database
            {
                opzioni.UseSqlServer(_configurazione["StringheConnessione:ConnessioneDefault"]);  // Impostazione del database fisico e connessione presa dalla configurazione
            });  

            servizi.AddScoped<IPaperoRepository, PaperoRepository>();  // Registrazione del repository delle query e della sua interfaccia astratta.
                                                                       // Si usa AddScoped perché è costoso crearle e quindi lo facciamo solo una volta per richiesta.

            servizi.AddIdentity<UtentePapero, IdentityRole>(configurazione =>  // Registrazione del servizio di autenticazione e configurazione dei suoi parametri.
            {  
                configurazione.User.RequireUniqueEmail = false;
                configurazione.Password.RequiredLength = 1;
                configurazione.Password.RequireDigit = false;
                configurazione.Password.RequireNonAlphanumeric = false;
                configurazione.Password.RequireUppercase = false;
                configurazione.Cookies.ApplicationCookie.LoginPath = "/Auth/Login";  // Percorso della pagina di login
            })
                .AddEntityFrameworkStores<PaperoDBContext>();   // IMPORTANTE!!! Questa riga dice quale database fisico verrà usato per contenere le tabelle usate da Identity

            servizi.AddLogging(); // Aggiunta del supporto per i log

            servizi.AddMvc(opzioni =>                                  // Aggiunta del framework MVC lato server e sua configurazione
            {
                if (_ambiente.IsProduction())                          // Se siamo in ambiente di produzione...
                {
                    opzioni.Filters.Add(new RequireHttpsAttribute());   // ...forziamo tutto il sito ad andare via HTTPS per motivi di sicurezza (in sviluppo va bene HTTP)
                }
            })                                                     
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)  // Aggiunta del supporto per la localizzazione delle viste
                .AddDataAnnotationsLocalization()                                // Aggiunta del supporto per la localizzazione delle annotazioni
                .AddJsonOptions(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);  // IMPORTANTE!!!!  Senza questa riga i JSON non vengono
                                                                                                                                  // generati correttamente perché esistono dei riferimenti
                                                                                                                                  // circolari (che in realtà sono innocui ma causerebbero
                                                                                                                                  // "Self referencing loop detected")

            servizi.AddLocalization(opzioni =>         // Aggiunta del supporto globale per la localizzazione e sua configurazione
            {
                opzioni.ResourcesPath = "Resources";   // Impostazione del path per i file di risorse
            });   

            servizi.Configure<RequestLocalizationOptions>(opzioni =>  // Configurazione della localizzazione
            {
                var lingueSupportate = new[]  // Elenco delle lingue supportate. Per aggiungere una lingua, aggiungere un new CultureInfo("") con il codice della lingua (es. "de")
                {                             // e poi ovviamente aggiungere tutti i file di risorse. Va aggiornata anche la dropdown in _Layout.cshtml
                    new CultureInfo("it"),
                    new CultureInfo("en-US"),
                    new CultureInfo("fr")
                };

                opzioni.DefaultRequestCulture = new RequestCulture(culture: "it", uiCulture: "it");  // Lingua di default dell'applicazione. Deve ovviamente essere una di quelle
                                                                                                     // specificate sopra.

                opzioni.SupportedCultures = lingueSupportate;   // L'elenco delle lingue viene passato alla configurazione. Vengono accettati solo i codici aggiunti qui.
                opzioni.SupportedUICultures = lingueSupportate; // SupportedCultures serve per i formati (date, decimali, ecc.). SupportedUICultures per le lingue dell'interfaccia.

            });
        }


// Configurazione della pipeline HTTP. Qui si decide come l'applicazione risponde alle richieste.
        public void Configure(IApplicationBuilder applicazione, IHostingEnvironment ambiente, ILoggerFactory gestoreLogs)
        {

            // Le opzioni di localizzazione vengono utilizzate ad ogni richiesta dell'applicazione. Questo consente di variare la lingua "al volo" con la dropdown in _Layout.cshtml
            var opzioniLocalizzazione = applicazione.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            applicazione.UseRequestLocalization(opzioniLocalizzazione.Value);

            Mapper.Initialize(config => 
            {
                config.CreateMap<Esemplari, DettaglioEsemplareViewModel>();
            });

            if (ambiente.IsDevelopment())                       // Se siamo in ambiente di sviluppo...
            {
                applicazione.UseDeveloperExceptionPage();       // ...mostra gli errori dettagliati (altrimenti li nasconde)
                gestoreLogs.AddDebug(LogLevel.Information);     // ...e logga tutti gli eventi da Information in su
            }
            else                                                // Se invece siamo in ambiente di produzione...
            {
                gestoreLogs.AddDebug(LogLevel.Error);           // ...logga solo gli errori veri e propri.
            }

            applicazione.UseStaticFiles();  // Configurazione che permette di servire i file statici (come le immagini)

            applicazione.UseIdentity();  // Attivazione del sistema di autenticazione

            applicazione.UseMvc(configurazione =>  // Configurazione del routing MVC
            {
                configurazione.MapRoute(  // Il routing è quello standard di tutte le applicazioni MVC
                  name: "Default",
                  template: "{controller}/{action}/{id?}",
                  defaults: new { controller = "Papero", action = "Index" }
                  );
            });
        }
    }
}
