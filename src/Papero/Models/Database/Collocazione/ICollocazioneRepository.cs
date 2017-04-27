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

        #region Get

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
        /// Restituisce l'elenco completo degli Armadi
        /// </summary>
        /// <returns></returns>
        IEnumerable<Armadi> LeggiArmadi();

        /// <summary>
        /// Restituisce un singolo Armadio
        /// </summary>
        /// <param name="idArmadio"></param>
        /// <returns></returns>
        IEnumerable<Armadi> LeggiArmadi(int idArmadio);

        /// <summary>
        /// Restituisce l'elenco completo dei Cassetti
        /// </summary>
        /// <returns></returns>
        IEnumerable<Cassetti> LeggiCassetti();

        /// <summary>
        /// Restituisce un singolo Cassetto
        /// </summary>
        /// <param name="idCassetto"></param>
        /// <returns></returns>
        IEnumerable<Cassetti> LeggiCassetti(int idCassetto);

        /// <summary>
        /// Restituisce l'elenco completo dei Vassoi
        /// </summary>
        /// <returns></returns>
        IEnumerable<Vassoi> LeggiVassoi();

        /// <summary>
        /// Restituisce un singolo Vassoio
        /// </summary>
        /// <param name="idVassoio"></param>
        /// <returns></returns>
        IEnumerable<Vassoi> LeggiVassoi(int idVassoio);

        #endregion

        #region Post

        /// <summary>
        /// Inserisce una nuova Sala nel database
        /// </summary>
        /// <param name="sala"></param>
        void PostSala(Sale sala);

        /// <summary>
        /// Inserisce un nuovo Armadio nel database
        /// </summary>
        /// <param name="armadio"></param>
        void PostArmadio(Armadi armadio);

        /// <summary>
        /// Inserisce un nuovo Cassetto nel database
        /// </summary>
        /// <param name="cassetto"></param>
        void PostCassetto(Cassetti cassetto);

        /// <summary>
        /// Inserisce un nuovo Vassoio nel database
        /// </summary>
        /// <param name="vassoio"></param>
        void PostVassoio(Vassoi vassoio);

        #endregion

        #region Put

        /// <summary>
        /// Aggiorna una Sala nel database
        /// </summary>
        /// <param name="sala"></param>
        void PutSala(Sale sala);

        /// <summary>
        /// Aggiorna un Armadio nel database
        /// </summary>
        /// <param name="armadio"></param>
        void PutArmadio(Armadi armadio);

        /// <summary>
        /// Aggiorna un Cassetto nel database
        /// </summary>
        /// <param name="cassetto"></param>
        void PutCassetto(Cassetti cassetto);

        /// <summary>
        /// Aggiorna un Vassoio nel database
        /// </summary>
        /// <param name="vassoio"></param>
        void PutVassoio(Vassoi vassoio);

        #endregion

        #region Delete

        /// <summary>
        /// Cancella una Sala dal database
        /// </summary>
        /// <param name="idSala"></param>
        void CancellaSala(int idSala);

        #endregion

    }
}