// IPreparatoriRepository.cs
//
// Interfaccia per PreparatoriRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface IPreparatoriRepository
    {
        /// <summary>
        /// Restituisce l'elenco completo dei Preparatori
        /// </summary>
        /// <returns></returns>
        IEnumerable<Preparatori> LeggiPreparatori();

        /// <summary>
        /// Restituisce un singolo Preparatore
        /// </summary>
        /// <param name="idPreparatore"></param>
        /// <returns></returns>
        IEnumerable<Preparatori> LeggiPreparatori(int idPreparatore);

        /// <summary>
        /// Restituisce l'elenco dei Preparatori di un determinato esemplare
        /// </summary>
        /// <param name="idEsemplare"></param>
        /// <returns></returns>
        IEnumerable<Preparatori> LeggiPreparatoriDaEsemplare(int idEsemplare);

        /// <summary>
        /// Inserisce un Preparatore nel database
        /// </summary>
        /// <param name="preparatore"></param>
        void PostPreparatore(Preparatori preparatore);

        /// <summary>
        /// Aggiorna un Preparatore nel database
        /// </summary>
        /// <param name="preparatore"></param>
        void PutPreparatore(Preparatori preparatore);

        /// <summary>
        /// Cancella un Preparatore dal database
        /// </summary>
        /// <param name="idPreparatore"></param>
        void CancellaPreparatore(int idPreparatore);
    }
}