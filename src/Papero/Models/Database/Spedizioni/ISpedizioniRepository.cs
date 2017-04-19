// ISpedizioniRepository.cs
//
// Interfaccia per SpedizioniRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface ISpedizioniRepository
    {
        /// <summary>
        /// Restituisce l'elenco delle Spedizioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Spedizioni> LeggiSpedizioni();

        /// <summary>
        /// Inserisce una Spedizione nel database
        /// </summary>
        /// <param name="spedizione"></param>
        void PostSpedizione(Spedizioni spedizione);

        /// <summary>
        /// Aggiorna una Spedizione nel database
        /// </summary>
        /// <param name="spedizione"></param>
        void PutSpedizione(Spedizioni spedizione);

        /// <summary>
        /// Cancella una Spedizione dal database
        /// </summary>
        /// <param name="idSpedizione"></param>
        void CancellaSpedizione(int idSpedizione);
    }
}