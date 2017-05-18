// IAuthRepository.cs
//
// Interfaccia per AuthRepository

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Papero.Models
{
    public interface IAuthRepository
    {
        IEnumerable<UtentePapero> LeggiUtenti();
        IEnumerable<UtentePapero> LeggiUtenti(string idUtente);
        void PostUtente(UtentePapero utente, string password);
        IEnumerable<IdentityRole> LeggiRuoli();
        IEnumerable<IdentityRole> LeggiRuoli(string idRuolo);
        Task<IEnumerable<PolicyPapero>> LeggiPolicies();



        Task PostRuolo(RuoloPapero ruolo);

        Task PutRuolo(RuoloPapero ruolo);


        ///// <summary>
        ///// Restituisce l'elenco delle Spedizioni
        ///// </summary>
        ///// <returns></returns>
        //IEnumerable<Spedizioni> LeggiSpedizioni();

        ///// <summary>
        ///// Restituisce una singola Spedizione
        ///// </summary>
        ///// <param name="idSpedizione"></param>
        ///// <returns></returns>
        //IEnumerable<Spedizioni> LeggiSpedizioni(int idSpedizione);

        ///// <summary>
        ///// Inserisce una Spedizione nel database
        ///// </summary>
        ///// <param name="spedizione"></param>
        //void PostSpedizione(Spedizioni spedizione);

        ///// <summary>
        ///// Aggiorna una Spedizione nel database
        ///// </summary>
        ///// <param name="spedizione"></param>
        //void PutSpedizione(Spedizioni spedizione);

        ///// <summary>
        ///// Cancella una Spedizione dal database
        ///// </summary>
        ///// <param name="idSpedizione"></param>
        //void CancellaSpedizione(int idSpedizione);
    }
}