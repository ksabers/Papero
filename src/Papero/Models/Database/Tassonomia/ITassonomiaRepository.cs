﻿// ITassonomiaRepository.cs
//
// Interfaccia per TassonomiaRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface ITassonomiaRepository
    {

        #region Get

        /// <summary>
        /// Legge la struttura della tassonomia e la restituisce in formato albero
        /// </summary>
        /// <returns></returns>
        IEnumerable<Famiglie> LeggiAlbero();
        IEnumerable<Famiglie> LeggiFamiglie();
        IEnumerable<Famiglie> LeggiFamiglie(int idFamiglia);

        IEnumerable<Sottofamiglie> LeggiSottofamiglie();
        IEnumerable<Sottofamiglie> LeggiSottofamiglie(int idSottofamiglia);

        IEnumerable<Tribu> LeggiTribu();
        IEnumerable<Tribu> LeggiTribu(int idTribu);

        IEnumerable<Generi> LeggiGeneri();
        IEnumerable<Generi> LeggiGeneri(int idGenere);

        IEnumerable<Specie> LeggiSpecie();
        IEnumerable<Specie> LeggiSpecie(int idSpecie);

        IEnumerable<Sottospecie> LeggiSottospecie();
        IEnumerable<Sottospecie> LeggiSottospecie(int idSottospecie);
        SottospecieViewModel LeggiSottospecieConAutori(int idSottospecie);

        #endregion

        #region Put

        void PutFamiglia(Famiglie famiglia);
        void PutSottofamiglia(Sottofamiglie sottofamiglia);
        void PutTribu(Tribu tribu);
        void PutGenere(Generi genere);
        void PutSpecie(Specie specie);
        void PutSottospecieConAutori(SottospecieViewModel sottospecie);

        #endregion

        #region Post

        void PostFamiglia(Famiglie famiglia);
        void PostSottofamiglia(Sottofamiglie sottofamiglia);
        void PostTribu(Tribu tribu);
        void PostGenere(Generi genere);
        void PostSpecie(Specie specie);
        void PostSottospecie(Sottospecie sottospecie);

        #endregion
    }
}