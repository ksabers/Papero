using Papero.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Papero.Funzioni
{
    public static class funzioni
    {
          public static int ritornaUno()
        {
            return 1;
        }

        public static string elencoAutori(ICollection<Classificazioni> classificazione, bool classificazioneOriginale, string annoClassificazione)
        {
            var elenco = "";
            var lunghezza = classificazione.Count;

            foreach (var classificatore in classificazione.OrderBy(ord => ord.Ordinamento))
            {
                if (classificatore.Ordinamento < lunghezza - 1)
                {
                    elenco = elenco + classificatore.Classificatore.Classificatore + ", ";
                    continue;
                }
                    
                if (classificatore.Ordinamento == lunghezza - 1)
                {
                    elenco = elenco + classificatore.Classificatore.Classificatore + " & ";
                    continue;
                }
                    
                if (classificatore.Ordinamento == lunghezza)
                {
                    elenco = elenco + classificatore.Classificatore.Classificatore;
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
    }
}
