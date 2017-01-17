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

        public static string leggiData(string dataIngresso)
        {
            if (string.IsNullOrWhiteSpace(dataIngresso))
            {
                return "-";
            }
            else
            {
                return dataIngresso;
            }
        }
    }
}
