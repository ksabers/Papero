using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Papero.Models;

namespace Papero.ViewModels
{
    public class DettaglioEsemplareViewModel
    {
        public int Id { get; set; }
        public int SottospecieId { get; set; }
        public int Msng { get; set; }
        public int? Ncu { get; set; }
        public int? SessoId { get; set; }
        public string LetteraEsemplare { get; set; }
        public string NumeroEsemplare { get; set; }
        public string DataDeterminazione { get; set; }
        public string DataPreparazione { get; set; }
        public string NotePreparazione { get; set; }
        public int? LocalitaCatturaId { get; set; }
        public string DataCattura { get; set; }
        public string DataCatturaCorretta { get; set; }
        public int? AvutoDaId { get; set; }
        public int? LegitId { get; set; }
        public int? TipoAcquisizioneId { get; set; }
        public string DataAcquisizione { get; set; }
        public int? CedenteId { get; set; }
        public int? CollezioneId { get; set; }
        public int? SpedizioneId { get; set; }
        public bool? Presenza { get; set; }
        public int TipoId { get; set; }
        public int AberrazioneId { get; set; }
        public string ContenutoStomaco { get; set; }
        public string ContenutoIngluvie { get; set; }
        public bool? Inanellato { get; set; }
        public string DatiAnello { get; set; }
        public double? FormulaAlareE { get; set; }
        public double? FormulaAlareWp { get; set; }
        public double? FormulaAlare2 { get; set; }
        public double? TimoniereEsterne { get; set; }
        public double? TimoniereCentrali { get; set; }
        public string ColoreZampe { get; set; }
        public double? Tarso { get; set; }
        public double? Remigante3 { get; set; }
        public double? Ala { get; set; }
        public string ColoreBecco { get; set; }
        public double? Culmine { get; set; }
        public double? BeccoCranio { get; set; }
        public string ColoreIride { get; set; }
        public double? DimensioneOcchio { get; set; }
        public double? AperturaAlare { get; set; }
        public double? LunghezzaTotale { get; set; }
        public double? Peso { get; set; }
        public string Bibliografia { get; set; }
        public string Note { get; set; }

        public virtual ICollection<Determinazioni> Determinazioni { get; set; }
        public virtual ICollection<Preparati> Preparati { get; set; }
        public virtual ICollection<Preparazioni> Preparazioni { get; set; }
        public virtual ICollection<VecchieDeterminazioni> VecchieDeterminazioni { get; set; }
        public virtual Aberrazioni Aberrazione { get; set; }
        public virtual Raccoglitori AvutoDa { get; set; }
        public virtual Raccoglitori Cedente { get; set; }
        public virtual Collezioni Collezione { get; set; }
        public virtual Raccoglitori Legit { get; set; }
        public virtual Localita LocalitaCattura { get; set; }
        public virtual Sessi Sesso { get; set; }
        public virtual Sottospecie Sottospecie { get; set; }
        public virtual Spedizioni Spedizione { get; set; }
        public virtual TipiAcquisizione TipoAcquisizione { get; set; }
        public virtual Tipi Tipo { get; set; }

    }
}
