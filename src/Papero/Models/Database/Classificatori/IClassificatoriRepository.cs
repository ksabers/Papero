// IClassificatoriRepository.cs
//
// Interfaccia per ClassificatoriRepository

using Papero.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Papero.Models
{
    public interface IClassificatoriRepository
    {
        IEnumerable<Classificatori> LeggiClassificatori();
        IEnumerable<Classificatori> LeggiClassificatori(int idClassificatore);
        void PostClassificatore(Classificatori classificatore);
        void PutClassificatore(Classificatori classificatore);
        void CancellaClassificatore(int idClassificatore);
    }
}