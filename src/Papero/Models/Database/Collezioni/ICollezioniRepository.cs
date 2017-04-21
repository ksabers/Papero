// ICollezioniRepository.cs
//
// Interfaccia per CollezioniRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface ICollezioniRepository
    {
        /// <summary>
        /// Restituisce l'elenco delle Collezioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Collezioni> LeggiCollezioni();

        /// <summary>
        /// Restituisce una singola Collezione
        /// </summary>
        /// <param name="idCollezione"></param>
        /// <returns></returns>
        IEnumerable<Collezioni> LeggiCollezioni(int idCollezione);

        /// <summary>
        /// Inserisce una nuova Collezione nel database
        /// </summary>
        /// <param name="collezione"></param>
        void PostCollezione(Collezioni collezione);

        /// <summary>
        /// Aggiorna una Collezione nel database
        /// </summary>
        /// <param name="collezione"></param>
        void PutCollezione(Collezioni collezione);

        /// <summary>
        /// Cancella una Collezione dal database
        /// </summary>
        /// <param name="idCollezione"></param>
        void CancellaCollezione(int idCollezione);
    }
}