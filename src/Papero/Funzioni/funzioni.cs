using Papero.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Papero.Funzioni
{
    public static class funzioni
    {

        public static string elencoAutori(ICollection<Classificazioni> classificazione, bool classificazioneOriginale, string annoClassificazione)
        {
            var elenco = "";
            var lunghezza = classificazione.Count;
            var sequenza = 1;

            foreach (var classificatore in classificazione.OrderBy(ord => ord.Ordinamento))
            {
                if (sequenza < lunghezza - 1)
                {
                    elenco = elenco + classificatore.Classificatore.Classificatore + ", ";
                    sequenza += 1;
                    continue;
                }
                    
                if (sequenza == lunghezza - 1)
                {
                    elenco = elenco + classificatore.Classificatore.Classificatore + " & ";
                    sequenza += 1;
                    continue;
                }
                    
                if (sequenza == lunghezza)
                {
                    elenco = elenco + classificatore.Classificatore.Classificatore;
                    sequenza += 1;
                    break;
                }
                    
            };

            elenco = elenco + ", " + annoClassificazione;

            if (!classificazioneOriginale)
            {
                elenco = "(" + elenco + ")";
            }
            return elenco;
        }

        public static string leggiData(string dataIngresso)  // Legge una data parziale e la restituisce nel formato di visualizzazione
        {
            if (string.IsNullOrEmpty(dataIngresso) || string.IsNullOrWhiteSpace(dataIngresso))  // Se la stringa è nulla o vuota, la data non è valida
            {
                return "-";
            }

            if (dataIngresso.Trim().Length != 8 && dataIngresso.Trim().Length !=10)  // Internamente le date devono sempre essere in formato "YYYYMMDD" oppure "YYYY-MM-DD", altrimenti non sono valide
            {
                return "-";
            }

            var annoNumerico = 0;
            var meseNumerico = 0;
            var giornoNumerico = 0;
            var annoStringa = "";
            var meseStringa = "";
            var giornoStringa = "";

            if (dataIngresso.Trim().Length == 8)
            {
                annoStringa = dataIngresso.Trim().Substring(0, 4);
                meseStringa = dataIngresso.Trim().Substring(4, 2);
                giornoStringa = dataIngresso.Trim().Substring(6, 2);
            }
            else
            {
                annoStringa = dataIngresso.Trim().Substring(0, 4);
                meseStringa = dataIngresso.Trim().Substring(5, 2);
                giornoStringa = dataIngresso.Trim().Substring(8, 2);
            };

            string[] mesiRomani = { "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII" };
            
            if (!Int32.TryParse(annoStringa, out annoNumerico))  //  Se l'anno non è un numero la data non è valida
            {
                return "-";
            };

            if (!Int32.TryParse(meseStringa, out meseNumerico))  //  Se il mese non è un numero la data non è valida
            {
                return "-";
            };

            if (meseNumerico > 12 || meseNumerico < 0)  // Se il mese non è compreso tra 0 e 12 la data non è valida
            {
                return "-";
            };

            if (!Int32.TryParse(giornoStringa, out giornoNumerico))  //  Se il giorno non è un numero la data non è valida
            {
                return "-";
            };

            if ((meseNumerico != 0) && (giornoNumerico != 0))  //  Se la data è completa, deve essere valida (questo verifica contemporaneamente i giorni tra 0 e 31
            {                                                  //  e la validità generale della data (bisestili, mesi con 30 giorni, ecc.))
                try
                {
                    var date = new DateTime(annoNumerico, meseNumerico, giornoNumerico);
                }
                catch (Exception)
                {
                    return "-";
                }
            }

            // A questo punto siamo sicuri che la stringa rappresentava una data valida e la restituiamo in uscita nel formato corretto

            return (giornoStringa == "00" ? "" : (giornoStringa + ".")) + (meseStringa == "00" ? "" : (mesiRomani[meseNumerico - 1] + ".")) + annoStringa;

        }


        public static string scriviData(string dataIngresso, string tipoData)
        {
            if (string.IsNullOrEmpty(dataIngresso) || string.IsNullOrWhiteSpace(dataIngresso))
            {
                return null;
            };

            var annoStringa = "";
            var meseStringa = "";
            var giornoStringa = "";

            if (dataIngresso.Trim().Length == 8)
            {
                annoStringa = dataIngresso.Trim().Substring(0, 4);
                meseStringa = dataIngresso.Trim().Substring(4, 2);
                giornoStringa = dataIngresso.Trim().Substring(6, 2);
            }
            else
            {
                annoStringa = dataIngresso.Trim().Substring(0, 4);
                meseStringa = dataIngresso.Trim().Substring(5, 2);
                giornoStringa = dataIngresso.Trim().Substring(8, 2);
            };

            switch (tipoData)
            {
                case "Data completa":
                    return annoStringa + "-" + meseStringa + "-" + giornoStringa;

                case "Ignora mese/giorno":
                    return annoStringa + "-00-00";

                case "Ignora giorno":
                    return annoStringa + "-" + meseStringa + "-00";

                default:
                    return null;
            }
        }

        public static string convertiNumero(double? numero)
        {
            return numero.ToString().Replace(',', '.');
        }

        public static double troncaDecimali(double numero)
        {
            return Math.Truncate(10 * numero) / 10;
        }
    }
}
