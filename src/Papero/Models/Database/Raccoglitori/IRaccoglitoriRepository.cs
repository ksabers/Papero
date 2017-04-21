// IRaccoglitoriRepository.cs
//
// Interfaccia per RaccoglitoriRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface IRaccoglitoriRepository
    {
        /// <summary>
        /// Restituisce l'elenco dei Raccoglitori
        /// </summary>
        /// <returns></returns>
        IEnumerable<Raccoglitori> LeggiRaccoglitori();

        /// <summary>
        /// Restituisce un singolo Raccoglitore
        /// </summary>
        /// <param name="idRaccoglitore"></param>
        /// <returns></returns>
        IEnumerable<Raccoglitori> LeggiRaccoglitori(int idRaccoglitore);

        /// <summary>
        /// Inserisce un Raccoglitore nel database
        /// </summary>
        /// <param name="raccoglitore"></param>
        void PostRaccoglitore(Raccoglitori raccoglitore);

        /// <summary>
        /// Aggiorna un Raccoglitore nel database
        /// </summary>
        /// <param name="raccoglitore"></param>
        void PutRaccoglitore(Raccoglitori raccoglitore);

        /// <summary>
        /// Cancella un Raccoglitore dal database
        /// </summary>
        /// <param name="idRaccoglitore"></param>
        void CancellaRaccoglitore(int idRaccoglitore);
    }
}