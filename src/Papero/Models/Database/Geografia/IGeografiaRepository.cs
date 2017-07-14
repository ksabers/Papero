// IGeografiaRepository.cs
//
// Interfaccia per GeografiaRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface IGeografiaRepository
    {

        #region Get

        IEnumerable<AlberoNazioneViewModel> LeggiGeografia();

        /// <summary>
        /// Restituisce l'elenco completo delle Nazioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Nazioni> LeggiNazioni();

        /// <summary>
        /// Restituisce una singola Nazione
        /// </summary>
        /// <param name="idNazione"></param>
        /// <returns></returns>
        IEnumerable<Nazioni> LeggiNazioni(int idNazione);

        /// <summary>
        /// Restituisce l'elenco completo delle Regioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Regioni> LeggiRegioni();

        /// <summary>
        /// Restituisce una singola Regione
        /// </summary>
        /// <param name="idRegione"></param>
        /// <returns></returns>
        IEnumerable<Regioni> LeggiRegioni(int idRegione);

        /// <summary>
        /// Restituisce l'elenco completo delle Province
        /// </summary>
        /// <returns></returns>
        IEnumerable<Province> LeggiProvince();

        /// <summary>
        /// Restituisce una singola Provincia
        /// </summary>
        /// <returns></returns>
        IEnumerable<Province> LeggiProvince(int idProvincia);

        /// <summary>
        /// Restituisce l'elenco completo delle Città
        /// </summary>
        /// <returns></returns>
        IEnumerable<Citta> LeggiCitta();

        /// <summary>
        /// Restituisce una singola Città
        /// </summary>
        /// <returns></returns>
        IEnumerable<Citta> LeggiCitta(int idCitta);

        /// <summary>
        /// Restituisce l'elenco completo delle Località
        /// </summary>
        /// <returns></returns>
        IEnumerable<Localita> LeggiLocalita();

        /// <summary>
        /// Restituisce una singola Località
        /// </summary>
        /// <returns></returns>
        IEnumerable<Localita> LeggiLocalita(int idLocalita);

        #endregion

        #region Post

        void PostNazione(Nazioni nazione);

        void PostRegione(Regioni regione);

        void PostProvincia(Province provincia);

        void PostCitta(Citta citta);

        void PostLocalita(Localita localita);

        #endregion

        #region Put

        void PutNazione(Nazioni nazione);

        void PutRegione(Regioni regione);

        void PutProvincia(Province provincia);

        void PutCitta(Citta citta);

        void PutLocalita(Localita localita);

        #endregion

        #region Delete

        void CancellaNazione(int idNazione);

        void CancellaRegione(int idRegione);

        void CancellaProvincia(int idProvincia);

        void CancellaCitta(int idCitta);

        void CancellaLocalita(int idLocalita);

        #endregion

        #region Navigazione Inversa

        int IdLocalitaIndeterminataDaNazione(int idNazione);

        int IdLocalitaIndeterminataDaRegione(int idRegione);

        int IdLocalitaIndeterminataDaProvincia(int idProvincia);

        int IdLocalitaIndeterminataDaCitta(int idCitta);

        int IdCittaIndeterminataDaNazione(int idNazione);

        int IdCittaIndeterminataDaRegione(int idRegione);

        int IdCittaIndeterminataDaProvincia(int idProvincia);

        int IdProvinciaIndeterminataDaNazione(int idNazione);

        int IdProvinciaIndeterminataDaRegione(int idRegione);

        int IdRegioneIndeterminataDaNazione(int idNazione);

        #endregion

    }
}