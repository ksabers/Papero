// IPaperoRepository.cs
//
// Interfaccia per PaperoRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface IPaperoRepository
    {
        /// <summary>
        /// Legge la struttura della tassonomia e la restituisce in formato albero
        /// </summary>
        /// <returns></returns>
        IEnumerable<Famiglie> LeggiAlbero();

        /// <summary>
        /// Restituisce l'elenco sintetico degli esemplari usato nella tabella di ricerca
        /// </summary>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplari();

        /// <summary>
        /// Restituisce tutti i dati di un singolo esemplare
        /// </summary>
        /// <param name="esemplareId"></param>
        /// <returns></returns>
        Esemplari LeggiEsemplare(int esemplareId);

        /// <summary>
        /// Restituisce l'ID di un esemplare di cui si conosce l'MSNG
        /// </summary>
        /// <param name="MSNG"></param>
        /// <returns></returns>
        int EsemplareIdDaMSNG(int MSNG);

        /// <summary>
        /// Restituisce l'elenco degli stati di conservazione
        /// </summary>
        /// <returns></returns>
        IEnumerable<StatiConservazione> LeggiStatiConservazione();
        IEnumerable<Classificatori> LeggiClassificazioni(int idSottospecie);
        IEnumerable<Classificatori> LeggiClassificatori();

        IEnumerable<Classificatori> LeggiClassificatori(int idClassificatore);
        IEnumerable<Sottospecie> LeggiSottospecie();

        IEnumerable<PartiPreparate> LeggiPartiPreparate();

        /// <summary>
        /// Restituisce l'elenco completo dei Preparati
        /// </summary>
        /// <returns></returns>
        IEnumerable<Preparati> LeggiPreparati();

        /// <summary>
        /// Restituisce l'elenco dei Preparati di uno specifico esemplare
        /// </summary>
        /// <param name="idEsemplare"></param>
        /// <returns></returns>
        IEnumerable<Preparati> LeggiPreparati(int idEsemplare);

        /// <summary>
        /// Restituisce l'elenco completo delle Sale
        /// </summary>
        /// <returns></returns>
        IEnumerable<Sale> LeggiSale();

        /// <summary>
        /// Restituisce l'elenco completo degli Armadi
        /// </summary>
        /// <returns></returns>
        IEnumerable<Armadi> LeggiArmadi();

        /// <summary>
        /// Restituisce l'elenco completo dei Cassetti
        /// </summary>
        /// <returns></returns>
        IEnumerable<Cassetti> LeggiCassetti();

        /// <summary>
        /// Restituisce l'elenco completo dei Vassoi
        /// </summary>
        /// <returns></returns>
        IEnumerable<Vassoi> LeggiVassoi();

        /// <summary>
        /// Restituisce l'elenco completo delle Vecchie Determinazioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<VecchieDeterminazioni> LeggiVecchieDeterminazioni();

        /// <summary>
        /// Restituisce l'elenco delle Vecchie Determinazioni filtrato per esemplare
        /// </summary>
        /// <param name="idEsemplare"></param>
        /// <returns></returns>
        IEnumerable<VecchieDeterminazioni> LeggiVecchieDeterminazioni(int idEsemplare);

        /// <summary>
        /// Restituisce l'elenco completo dei Vecchi Determinatori
        /// </summary>
        /// <returns></returns>
        IEnumerable<VecchiDeterminatori> LeggiVecchiDeterminatori();

        /// <summary>
        /// Restituisce l'elenco dei Vecchi Determinatori filtrato per esemplare
        /// </summary>
        /// <param name="idEsemplare"></param>
        /// <returns></returns>
        IEnumerable<VecchiDeterminatori> LeggiVecchiDeterminatori(int idEsemplare);

        /// <summary>
        /// Restituisce l'elenco completo dei Determinatori
        /// </summary>
        /// <returns></returns>
        IEnumerable<Determinatori> LeggiDeterminatori();

        /// <summary>
        /// Restituisce l'elenco dei Determinatori di un determinato esemplare
        /// </summary>
        /// <param name="idEsemplare"></param>
        /// <returns></returns>
        IEnumerable<Determinatori> LeggiDeterminatori(int idEsemplare);
        void CancellaClassificazioni(int idSottospecie);
        Sottospecie LeggiSottospecie(int idSottospecie);
        Task<bool> SalvaModifiche();
        void CancellaPreparati(int idEsemplare);
        void CancellaPreparazioni(int idEsemplare);
        void CancellaVecchiDeterminatori(int[] arrayIdVecchieDeterminazioni);
       
        /// <summary>
        /// Cancella dalla tabella Determinazioni tutte le determinazioni relative ad uno specifico esemplare
        /// </summary>
        /// <param name="idEsemplare">Id dell'esemplare per cui cancellare le determinazioni</param>
        void CancellaDeterminazioni(int idEsemplare);
        void CancellaVecchieDeterminazioni(int idEsemplare);
        void InserisciVecchiDeterminatori(VecchiDeterminatori determinatoreDaInserire);
        IEnumerable<ElencoSpecieViewModel> LeggiElencoSpecie();

        /// <summary>
        /// Restituisce l'ID del record "Indeterminato" della tabella Sessi
        /// </summary>
        /// <returns></returns>
        int LeggiIDSessoIndeterminato();

        /// <summary>
        /// Restituisce l'ID della località indeterminata nell'albero geografico
        /// (La località composta solo da trattini)
        /// </summary>
        /// <returns></returns>
        int LeggiIDLocalitaIndeterminata();

        /// <summary>
        /// Restituisce l'ID del raccoglitore "-" della tabella Raccoglitori
        /// </summary>
        /// <returns></returns>
        int LeggiIDRaccoglitoreIndeterminato();

        /// <summary>
        /// Restituisce l'ID della collezione "-" della tabella Collezioni
        /// </summary>
        /// <returns></returns>
        int LeggiIDCollezioneIndeterminata();

        /// <summary>
        /// Restituisce l'ID della spedizione "-" della tabella Spedizioni
        /// </summary>
        /// <returns></returns>
        int LeggiIDSpedizioneIndeterminata();

        /// <summary>
        /// Restituisce l'ID del tipo "-" della tabella Tipi
        /// </summary>
        /// <returns></returns>
        int LeggiIDTipoIndeterminato();

        /// <summary>
        /// Restituisce l'ID dell'aberrazione "-" della tabella Aberrazioni
        /// </summary>
        /// <returns></returns>
        int LeggiIDAberrazioneIndeterminata();

        /// <summary>
        /// Restituisce l'ID del Tipo Acquisizione "-" della tabella TipiAcquisizione
        /// </summary>
        /// <returns></returns>
        int LeggiIDTipoAcquisizioneIndeterminato();

        /// <summary>
        /// Aggiunge un Esemplare al database
        /// </summary>
        /// <param name="esemplareDaInserire"></param>
        void AggiungiEsemplare(Esemplari esemplareDaInserire);

        /// <summary>
        /// Restituisce l'elenco completo delle Nazioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Nazioni> LeggiNazioni();

        /// <summary>
        /// Restituisce l'elenco completo delle Regioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Regioni> LeggiRegioni();

        /// <summary>
        /// Restituisce l'elenco delle Regioni filtrato per nazione
        /// </summary>
        /// <param name="idNazione"></param>
        /// <returns></returns>
        IEnumerable<Regioni> LeggiRegioni(int idNazione);

        /// <summary>
        /// Restituisce l'elenco completo delle Province
        /// </summary>
        /// <returns></returns>
        IEnumerable<Province> LeggiProvince();

        /// <summary>
        /// Restituisce l'elenco delle Province filtrato per regione
        /// </summary>
        /// <param name="idRegione"></param>
        /// <returns></returns>
        IEnumerable<Province> LeggiProvince(int idRegione);

        /// <summary>
        /// Restituisce l'elenco completo delle Città
        /// </summary>
        /// <returns></returns>
        IEnumerable<Citta> LeggiCitta();

        /// <summary>
        /// Restituisce l'elenco delle Città filtrato per provincia
        /// </summary>
        /// <param name="idProvincia"></param>
        /// <returns></returns>
        IEnumerable<Citta> LeggiCitta(int idProvincia);

        /// <summary>
        /// Restituisce l'elenco completo delle Località
        /// </summary>
        /// <returns></returns>
        IEnumerable<Localita> LeggiLocalita();

        /// <summary>
        /// Restituisce l'elenco delle Località filtrato per città
        /// </summary>
        /// <param name="idCitta"></param>
        /// <returns></returns>
        IEnumerable<Localita> LeggiLocalita(int idCitta);

        /// <summary>
        /// Restituisce l'albero geografico
        /// </summary>
        /// <returns></returns>
        IEnumerable<Nazioni> LeggiGeografia();

        /// <summary>
        /// Restituisce l'elenco dei Tipi Acquisizione con un campo aggiuntivo localizzato in base alla lingua
        /// </summary>
        /// <returns></returns>
        IEnumerable<TipiAcquisizioneLocalizzatiViewModel> LeggiTipiAcquisizione();

        /// <summary>
        /// Restituisce l'elenco delle Collezioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Collezioni> LeggiCollezioni();

        /// <summary>
        /// Restituisce l'elenco delle Spedizioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Spedizioni> LeggiSpedizioni();

        /// <summary>
        /// Restituisce l'elenco dei Raccoglitori
        /// </summary>
        /// <returns></returns>
        IEnumerable<Raccoglitori> LeggiRaccoglitori();

        /// <summary>
        /// Restituisce l'elenco dei Sessi con un campo aggiuntivo localizzato in base alla lingua
        /// </summary>
        /// <returns></returns>
        IEnumerable<SessiLocalizzatiViewModel> LeggiSessi();

        /// <summary>
        /// Restituisce l'elenco dei Tipi con un campo aggiuntivo localizzato in base alla lingua
        /// (attualmente i Tipi sono in latino e non localizzati)
        /// </summary>
        /// <returns></returns>
        IEnumerable<TipiLocalizzatiViewModel> LeggiTipi();

        /// <summary>
        /// Restituisce l'elenco delle Aberrazioni con un campo aggiuntivo localizzato in base alla lingua
        /// </summary>
        /// <returns></returns>
        IEnumerable<AberrazioniLocalizzateViewModel> LeggiAberrazioni();

        /// <summary>
        /// Restituisce l'elenco completo dei Preparatori
        /// </summary>
        /// <returns></returns>
        IEnumerable<Preparatori> LeggiPreparatori();


        /// <summary>
        /// Restituisce l'elenco dei Preparatori di un determinato esemplare
        /// </summary>
        /// <param name="IdEsemplare"></param>
        /// <returns></returns>
        IEnumerable<Preparatori> LeggiPreparatori(int IdEsemplare);

        /// <summary>
        /// Restituisce l'elenco completo delle Preparazioni
        /// </summary>
        /// <returns></returns>
        IEnumerable<Preparazioni> LeggiPreparazioni();

        /// <summary>
        /// Restituisce l'elenco delle Preparazioni di un determinato esemplare 
        /// </summary>
        /// <param name="idEsemplare"></param>
        /// <returns></returns>
        IEnumerable<Preparazioni> LeggiPreparazioni(int idEsemplare);

        /// <summary>
        /// Restituisce l'elenco delle Località appartenenti ad una specifica nazione
        /// </summary>
        /// <param name="idNazione"></param>
        /// <returns></returns>
        IEnumerable<Localita> LeggiLocalitaDaNazione(int idNazione);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari provenienti da una specifica nazione
        /// </summary>
        /// <param name="idNazione"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaNazione(int idNazione);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari provenienti da una specifica regione
        /// </summary>
        /// <param name="idRegione"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaRegione(int idRegione);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari provenienti da una specifica provincia
        /// </summary>
        /// <param name="idProvincia"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaProvincia(int idProvincia);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari provenienti da una specifica città
        /// </summary>
        /// <param name="idCitta"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaCitta(int idCitta);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari provenienti da una specifica località
        /// </summary>
        /// <param name="idLocalita"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaLocalita(int idLocalita);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari raccolti da uno specifico Raccoglitore
        /// (indifferentemente come "avuto da", "legit" o "cedente")
        /// </summary>
        /// <param name="idRaccoglitore"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaRaccoglitore(int idRaccoglitore);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari di cui almeno una parte si trova in una specifica sala
        /// </summary>
        /// <param name="idSala"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaSala(int idSala);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari di cui almeno una parte si trova in uno specifico armadio
        /// </summary>
        /// <param name="idArmadio"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaArmadio(int idArmadio);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari di cui almeno una parte si trova in uno specifico cassetto
        /// </summary>
        /// <param name="idCassetto"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaCassetto(int idCassetto);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari di cui almeno una parte si trova in uno specifico vassoio
        /// </summary>
        /// <param name="idVassoio"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaVassoio(int idVassoio);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari provenienti da una specifica spedizione
        /// </summary>
        /// <param name="idSpedizione"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaSpedizione(int idSpedizione);

        /// <summary>
        /// Restituisce l'elenco degli Esemplari inclusi in una specifica collezione
        /// </summary>
        /// <param name="idCollezione"></param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaCollezione(int idCollezione);

        /// <summary>
        /// Restituisce l'elenco degli esemplari la cui data di cattura è maggiore o uguale ad una certa data
        /// </summary>
        /// <param name="dataDa">Data in formato interno</param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaDataDa(string dataDa);

        /// <summary>
        /// Restituisce l'elenco degli esemplari la cui data di cattura è minore o uguale ad una certa data
        /// </summary>
        /// <param name="dataA">Data in formato interno</param>
        /// <returns></returns>
        IEnumerable<ElencoEsemplariViewModel> LeggiElencoEsemplariDaDataA(string dataA);

        /// <summary>
        /// Cancella uno specifico Esemplare dal database
        /// </summary>
        /// <param name="idEsemplare"></param>
        void CancellaEsemplare(int idEsemplare);

        void PostClassificatore(Classificatori classificatore);

        void PutClassificatore(Classificatori classificatore);

        void PostCollezione(Collezioni collezione);

        void PutCollezione(Collezioni collezione);

        void CancellaClassificatore(int idClassificatore);

        void CancellaCollezione(int idCollezione);
    }
}