// IImmaginiRepository.cs
//
// Interfaccia per ImmaginiRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface IImmaginiRepository
    {
        /// <summary>
        /// Restituisce le referenze di tutte le immagini degli esemplari
        /// </summary>
        /// <returns></returns>
        IEnumerable<Immagini> LeggiImmagini();

        /// <summary>
        /// Restituisce i dati di una singola immagine
        /// </summary>
        /// <param name="idImmagine"></param>
        /// <returns></returns>
        IEnumerable<Immagini> LeggiImmagini(int idImmagine);

        /// <summary>
        /// Inserisce nel database le referenze di un'immagine (ma non il file fisico)
        /// </summary>
        /// <param name="immagine"></param>
        void PostImmagine(Immagini immagine);

        /// <summary>
        /// Cancella dal database le referenze di un'immagine e anche il file fisico relativo
        /// </summary>
        /// <param name="idImmagine"></param>
        void CancellaImmagine(int idImmagine);
    }
}