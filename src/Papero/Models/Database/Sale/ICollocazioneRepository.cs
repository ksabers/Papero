// ICollocazioneRepository.cs
//
// Interfaccia per CollocazioneRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface ICollocazioneRepository
    {
        /// <summary>
        /// Restituisce l'elenco delle Sale
        /// </summary>
        /// <returns></returns>
        IEnumerable<Sale> LeggiSale();

        /// <summary>
        /// Restituisce una singola Sala
        /// </summary>
        /// <param name="idSala"></param>
        /// <returns></returns>
        IEnumerable<Sale> LeggiSale(int idSala);

        /// <summary>
        /// Inserisce una nuova Sala nel database
        /// </summary>
        /// <param name="sala"></param>
        void PostSala(Sale sala);

        /// <summary>
        /// Aggiorna una Sala nel database
        /// </summary>
        /// <param name="sala"></param>
        void PutSala(Sale sala);

        /// <summary>
        /// Cancella una Sala dal database
        /// </summary>
        /// <param name="idSala"></param>
        void CancellaSala(int idSala);
    }
}