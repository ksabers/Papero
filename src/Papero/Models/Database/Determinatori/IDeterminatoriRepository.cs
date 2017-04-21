// IDeterminatoriRepository.cs
//
// Interfaccia per DeterminatoriRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface IDeterminatoriRepository
    {
        /// <summary>
        /// Restituisce l'elenco completo dei Determinatori
        /// </summary>
        /// <returns></returns>
        IEnumerable<Determinatori> LeggiDeterminatori();

        /// <summary>
        /// Restituisce un singolo Determinatore
        /// </summary>
        /// <param name="idDeterminatore"></param>
        /// <returns></returns>
        IEnumerable<Determinatori> LeggiDeterminatori(int idDeterminatore);

        /// <summary>
        /// Restituisce l'elenco dei Determinatori di un determinato esemplare
        /// </summary>
        /// <param name="idEsemplare"></param>
        /// <returns></returns>
        IEnumerable<Determinatori> LeggiDeterminatoriDaEsemplare(int idEsemplare);

        /// <summary>
        /// Inserisce un Determinatore nel database
        /// </summary>
        /// <param name="determinatore"></param>
        void PostDeterminatore(Determinatori determinatore);

        /// <summary>
        /// Aggiorna un Determinatore nel database
        /// </summary>
        /// <param name="determinatore"></param>
        void PutDeterminatore(Determinatori determinatore);

        /// <summary>
        /// Cancella un Determinatore dal database
        /// </summary>
        /// <param name="idDeterminatore"></param>
        void CancellaDeterminatore(int idDeterminatore);
    }
}