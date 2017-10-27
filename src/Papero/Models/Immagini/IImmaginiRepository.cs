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
        IEnumerable<Immagini> LeggiImmagini();
        IEnumerable<Immagini> LeggiImmagini(int idImmagine);
        void PostImmagine(Immagini immagine);
        void CancellaImmagine(int idImmagine);
    }
}