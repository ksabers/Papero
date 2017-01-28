using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Papero.Models
{
    public partial class PaperoDBContext : IdentityDbContext<UtentePapero>
    {
        public PaperoDBContext(DbContextOptions<PaperoDBContext> options)  // Qui si dovrebbe definire quale database fisico viene effettivamente utilizzato dall'applicazione
            : base(options)                                                // ma in realtà diciamo: prendi le impostazioni che sono definite in startup.cs
        { }                                                                // così svincoliamo il contesto dal database

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<ElencoSinteticoEsemplari>(entity => {
            //    entity.ToTable("V_ElencoSinteticoEsemplari");
            //    entity.HasKey(e => e.Id);
            //});

            modelBuilder.Entity<Aberrazioni>(entity =>
            {
                entity.HasIndex(e => e.Aberrazione)
                    .HasName("Aberrazioni$Aberrazione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Aberrazione)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Armadi>(entity =>
            {
                entity.HasIndex(e => e.Armadio)
                    .HasName("Armadi$Armadio");

                entity.HasIndex(e => e.SalaId)
                    .HasName("Armadi$SaleArmadi");

                entity.HasIndex(e => new { e.SalaId, e.Armadio })
                    .HasName("Armadi$USalaArmadio")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Armadio)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SalaId).HasColumnName("SalaID");

                entity.HasOne(d => d.Sala)
                    .WithMany(p => p.Armadi)
                    .HasForeignKey(d => d.SalaId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Armadi$SaleArmadi");
            });

            modelBuilder.Entity<Cassetti>(entity =>
            {
                entity.HasIndex(e => e.ArmadioId)
                    .HasName("Cassetti$ArmadioID");

                entity.HasIndex(e => e.Cassetto)
                    .HasName("Cassetti$Cassetto");

                entity.HasIndex(e => new { e.ArmadioId, e.Cassetto })
                    .HasName("Cassetti$UArmadioCassetto")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ArmadioId).HasColumnName("ArmadioID");

                entity.Property(e => e.Cassetto)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasOne(d => d.Armadio)
                    .WithMany(p => p.Cassetti)
                    .HasForeignKey(d => d.ArmadioId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Cassetti$ArmadiCassetti");
            });



            modelBuilder.Entity<Vassoi>(entity =>
            {
                entity.HasIndex(e => e.CassettoId)
                    .HasName("Vassoi$CassettoID");

                entity.HasIndex(e => e.Vassoio)
                    .HasName("Vassoi$Vassoio");

                entity.HasIndex(e => new { e.CassettoId, e.Vassoio })
                    .HasName("Vassoi$UCassettoVassoio")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CassettoId).HasColumnName("CassettoID");

                entity.Property(e => e.Vassoio)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasOne(d => d.Cassetto)
                    .WithMany(p => p.Vassoi)
                    .HasForeignKey(d => d.CassettoId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Vassoi$CassettiVassoi");
            });



            modelBuilder.Entity<Citta>(entity =>
            {
                entity.HasIndex(e => e.CodiceIstat)
                    .HasName("Citta$CodiceIstat");

                entity.HasIndex(e => e.NomeCitta)
                    .HasName("Citta$Comune");

                entity.HasIndex(e => e.ProvinciaId)
                    .HasName("Citta$ProvinciaID");

                entity.HasIndex(e => new { e.ProvinciaId, e.NomeCitta })
                    .HasName("Citta$UProvinciaComune")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CodiceCatastale).HasMaxLength(50);

                entity.Property(e => e.CodiceIstat).HasMaxLength(255);

                entity.Property(e => e.NomeCitta)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.ProvinciaId)
                    .IsRequired()
                    .HasColumnName("ProvinciaID");

                entity.HasOne(d => d.Provincia)
                    .WithMany(p => p.Citta)
                    .HasForeignKey(d => d.ProvinciaId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Citta$ProvinceComuniItalia");
            });

            modelBuilder.Entity<ElencoClassificatoriViewModel>(entity =>
            {
                entity.HasIndex(e => e.Classificatore)
                    .HasName("Classificatori$Classificatore")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Classificatore)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Classificazioni>(entity =>
            {
                entity.HasIndex(e => e.ClassificatoreId)
                    .HasName("Classificazioni$ClassificatoriClassificazioni");

                entity.HasIndex(e => e.Ordinamento)
                    .HasName("Classificazioni$Ordinamento");

                entity.HasIndex(e => e.SottospecieId)
                    .HasName("Classificazioni$SottospecieID");

                entity.HasKey(e => new { e.SottospecieId, e.ClassificatoreId, e.Ordinamento });  // Aggiunta manualmente perché questa tabella non ha una chiave primaria. Senza
                                                                                                 // questa riga l'Entity Framework non parte nemmeno. Nelle altre tabelle è implicita
                                                                                                 // perché tutte hanno una colonna che si chiama "ID"

                entity.HasIndex(e => new { e.SottospecieId, e.ClassificatoreId, e.Ordinamento })
                    .HasName("Classificazioni$USottospecieClassificatore")
                    .IsUnique();

                //entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ClassificatoreId).HasColumnName("ClassificatoreID");

                entity.Property(e => e.SottospecieId).HasColumnName("SottospecieID");

                entity.HasOne(d => d.Classificatore)
                    .WithMany(p => p.Classificazioni)
                    .HasForeignKey(d => d.ClassificatoreId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Classificazioni$ClassificatoriClassificazioni");

                entity.HasOne(d => d.Sottospecie)
                    .WithMany(p => p.Classificazioni)
                    .HasForeignKey(d => d.SottospecieId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Classificazioni$SottospecieClassificazioni");
            });

            modelBuilder.Entity<Collezioni>(entity =>
            {
                entity.HasIndex(e => e.Collezione)
                    .HasName("Collezioni$Collezione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Collezione)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Determinatori>(entity =>
            {
                entity.HasIndex(e => e.Cognome)
                    .HasName("Determinatori$Cognome");

                entity.HasIndex(e => new { e.Cognome, e.Nome })
                    .HasName("Determinatori$UNomeCognome")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Cognome)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Determinazioni>(entity =>
            {
                entity.HasIndex(e => e.DeterminatoreId)
                    .HasName("Determinazioni$DeterminatoriDeterminazioni");

                entity.HasIndex(e => e.EsemplareId)
                    .HasName("Determinazioni$EsemplariDeterminazioni");

                entity.HasIndex(e => e.Ordinamento)
                    .HasName("Determinazioni$Ordinamento");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.DeterminatoreId).HasColumnName("DeterminatoreID");

                entity.Property(e => e.EsemplareId).HasColumnName("EsemplareID");

                entity.HasOne(d => d.Determinatore)
                    .WithMany(p => p.Determinazioni)
                    .HasForeignKey(d => d.DeterminatoreId)
                    .HasConstraintName("Determinazioni$DeterminatoriDeterminazioni");

                entity.HasOne(d => d.Esemplare)
                    .WithMany(p => p.Determinazioni)
                    .HasForeignKey(d => d.EsemplareId)
                    .HasConstraintName("Determinazioni$EsemplariDeterminazioni");
            });

            modelBuilder.Entity<Donatori>(entity =>
            {
                entity.HasIndex(e => e.Donatore)
                    .HasName("Donatori$Donatore")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Cognome)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Donatore)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Esemplari>(entity =>
            {
                entity.HasIndex(e => e.AberrazioneId)
                    .HasName("Esemplari$AberrazioniEsemplari");

                entity.HasIndex(e => e.AvutoDaId)
                    .HasName("Esemplari$RaccoglitoriEsemplari");

                entity.HasIndex(e => e.CedenteId)
                    .HasName("Esemplari$ScambianteID");

                entity.HasIndex(e => e.CollezioneId)
                    .HasName("Esemplari$CollezioniEsemplari");

                entity.HasIndex(e => e.LegitId)
                    .HasName("Esemplari$RaccoglitoriEsemplari1");

                entity.HasIndex(e => e.LocalitaCatturaId)
                    .HasName("Esemplari$LocalitaEsemplari");

                entity.HasIndex(e => e.Msng)
                    .HasName("Esemplari$MSNG")
                    .IsUnique();

                entity.HasIndex(e => e.SessoId)
                    .HasName("Esemplari$SessoID");

                entity.HasIndex(e => e.SottospecieId)
                    .HasName("Esemplari$SottospecieID");

                entity.HasIndex(e => e.SpedizioneId)
                    .HasName("Esemplari$ViaggioID");

                entity.HasIndex(e => e.TipoAcquisizioneId)
                    .HasName("Esemplari$TipoAcquisizioneID");

                entity.HasIndex(e => e.TipoId)
                    .HasName("Esemplari$TipiEsemplari");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AberrazioneId).HasColumnName("AberrazioneID");

                entity.Property(e => e.AvutoDaId).HasColumnName("AvutoDaID");

                entity.Property(e => e.Bibliografia).HasMaxLength(255);

                entity.Property(e => e.CedenteId).HasColumnName("CedenteID");

                entity.Property(e => e.CollezioneId).HasColumnName("CollezioneID");

                entity.Property(e => e.ColoreBecco).HasMaxLength(255);

                entity.Property(e => e.ColoreIride).HasMaxLength(255);

                entity.Property(e => e.ColoreZampe).HasMaxLength(255);

                entity.Property(e => e.ContenutoIngluvie).HasMaxLength(255);

                entity.Property(e => e.ContenutoStomaco).HasMaxLength(255);

                entity.Property(e => e.DataAcquisizione).HasMaxLength(255);

                entity.Property(e => e.DataCattura).HasMaxLength(255);

                entity.Property(e => e.DataCatturaCorretta).HasMaxLength(255);

                entity.Property(e => e.DataDeterminazione).HasMaxLength(255);

                entity.Property(e => e.DataPreparazione).HasMaxLength(255);

                entity.Property(e => e.DatiAnello).HasMaxLength(255);

                entity.Property(e => e.FormulaAlareWp).HasColumnName("FormulaAlareWP");

                entity.Property(e => e.Inanellato).HasDefaultValueSql("0");

                entity.Property(e => e.LegitId).HasColumnName("LegitID");

                entity.Property(e => e.LetteraEsemplare).HasMaxLength(255);

                entity.Property(e => e.LocalitaCatturaId).HasColumnName("LocalitaCatturaID");

                entity.Property(e => e.Msng).HasColumnName("MSNG");

                entity.Property(e => e.Ncu).HasColumnName("NCU");

                entity.Property(e => e.NumeroEsemplare).HasMaxLength(255);

                entity.Property(e => e.Presenza).HasDefaultValueSql("1");

                entity.Property(e => e.SessoId).HasColumnName("SessoID");

                entity.Property(e => e.Scheda).HasColumnName("Scheda");

                entity.Property(e => e.SottospecieId).HasColumnName("SottospecieID");

                entity.Property(e => e.SpedizioneId).HasColumnName("SpedizioneID");


                entity.Property(e => e.TipoAcquisizioneId).HasColumnName("TipoAcquisizioneID");

                entity.Property(e => e.TipoId).HasColumnName("TipoID");

                entity.HasOne(d => d.Aberrazione)
                    .WithMany(p => p.Esemplari)
                    .HasForeignKey(d => d.AberrazioneId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Esemplari$AberrazioniEsemplari");

                entity.HasOne(d => d.AvutoDa)
                    .WithMany(p => p.EsemplariAvutoDa)
                    .HasForeignKey(d => d.AvutoDaId)
                    .HasConstraintName("Esemplari$RaccoglitoriEsemplari");

                entity.HasOne(d => d.Cedente)
                    .WithMany(p => p.EsemplariCedente)
                    .HasForeignKey(d => d.CedenteId)
                    .HasConstraintName("Esemplari$RaccoglitoriEsemplari2");

                entity.HasOne(d => d.Collezione)
                    .WithMany(p => p.Esemplari)
                    .HasForeignKey(d => d.CollezioneId)
                    .HasConstraintName("Esemplari$CollezioniEsemplari");

                entity.HasOne(d => d.Legit)
                    .WithMany(p => p.EsemplariLegit)
                    .HasForeignKey(d => d.LegitId)
                    .HasConstraintName("Esemplari$RaccoglitoriEsemplari1");

                entity.HasOne(d => d.LocalitaCattura)
                    .WithMany(p => p.Esemplari)
                    .HasForeignKey(d => d.LocalitaCatturaId)
                    .HasConstraintName("Esemplari$LocalitaEsemplari");

                entity.HasOne(d => d.Sesso)
                    .WithMany(p => p.Esemplari)
                    .HasForeignKey(d => d.SessoId)
                    .HasConstraintName("Esemplari$SessiEsemplari");

                entity.HasOne(d => d.Sottospecie)
                    .WithMany(p => p.Esemplari)
                    .HasForeignKey(d => d.SottospecieId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Esemplari$SottospecieEsemplari");

                entity.HasOne(d => d.Spedizione)
                    .WithMany(p => p.Esemplari)
                    .HasForeignKey(d => d.SpedizioneId)
                    .HasConstraintName("Esemplari$SpedizioniEsemplari");

                entity.HasOne(d => d.TipoAcquisizione)
                    .WithMany(p => p.Esemplari)
                    .HasForeignKey(d => d.TipoAcquisizioneId)
                    .HasConstraintName("Esemplari$TipiAcquisizioneEsemplari");

                entity.HasOne(d => d.Tipo)
                    .WithMany(p => p.Esemplari)
                    .HasForeignKey(d => d.TipoId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Esemplari$TipiEsemplari");
            });

            modelBuilder.Entity<Famiglie>(entity =>
            {
                entity.HasIndex(e => e.Nome)
                    .HasName("Famiglie$Famiglia")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Nome).HasColumnName("Famiglia");
                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Passeriforme).HasDefaultValueSql("1");

            });

            modelBuilder.Entity<Generi>(entity =>
            {
                entity.HasIndex(e => e.Nome)
                    .HasName("Generi$Genere")
                    .IsUnique();

                entity.HasIndex(e => e.TribuId)
                    .HasName("Generi$TribuGeneri");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Genere");

                entity.Property(e => e.TribuId).HasColumnName("TribuID");

                entity.HasOne(d => d.Tribu)
                    .WithMany(p => p.Figli)
                    .HasForeignKey(d => d.TribuId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Generi$TribuGeneri");
            });

            modelBuilder.Entity<Localita>(entity =>
            {
                entity.HasIndex(e => e.CittaId)
                    .HasName("Localita$CittaLocalita");

                entity.HasIndex(e => e.NomeLocalita)
                    .HasName("Localita$Localita");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CittaId).HasColumnName("CittaID");

                entity.Property(e => e.Latitudine).HasMaxLength(255);

                entity.Property(e => e.Longitudine).HasMaxLength(255);

                entity.Property(e => e.NomeLocalita)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasOne(d => d.Citta)
                    .WithMany(p => p.Localita)
                    .HasForeignKey(d => d.CittaId)
                    .HasConstraintName("Localita$CittaLocalita");
            });

            modelBuilder.Entity<Nazioni>(entity =>
            {
                entity.HasIndex(e => e.Nazione)
                    .HasName("Nazioni$Nazione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Iso31661)
                    .HasColumnName("ISO_3166_1")
                    .HasMaxLength(255);

                entity.Property(e => e.Iso31661Alpha2)
                    .HasColumnName("ISO_3166_1_alpha_2")
                    .HasMaxLength(255);

                entity.Property(e => e.Iso31661Alpha3)
                    .HasColumnName("ISO_3166_1_alpha_3")
                    .HasMaxLength(255);

                entity.Property(e => e.Nazione)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<PartiPreparate>(entity =>
            {
                entity.HasIndex(e => e.Parte)
                    .HasName("PartiPreparate$ModoPreparazione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Parte)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Preparati>(entity =>
            {
                entity.HasIndex(e => e.VassoioId)
                    .HasName("Preparati$PosizioneID");

                entity.HasIndex(e => e.EsemplareId)
                    .HasName("Preparati$EsemplariPreparati");

                entity.HasIndex(e => e.ParteId)
                    .HasName("Preparati$PreparazioneID");

                entity.HasIndex(e => new { e.EsemplareId, e.Ordinamento })
                    .HasName("Preparati$UEsemplareOrdinamento")
                    .IsUnique();

                entity.HasIndex(e => new { e.EsemplareId, e.ParteId })
                    .HasName("Preparati$UEsemplarePreparazione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.VassoioId).HasColumnName("VassoioID");

                entity.Property(e => e.EsemplareId)
                    .IsRequired()
                    .HasColumnName("EsemplareID");

                entity.Property(e => e.Ordinamento).IsRequired();

                entity.Property(e => e.ParteId)
                    .IsRequired()
                    .HasColumnName("ParteID");

                entity.HasOne(d => d.Vassoio)
                    .WithMany(p => p.Preparati)
                    .HasForeignKey(d => d.VassoioId)
                    .HasConstraintName("Preparati$VassoiPreparati");

                entity.HasOne(d => d.Esemplare)
                    .WithMany(p => p.Preparati)
                    .HasForeignKey(d => d.EsemplareId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Preparati$EsemplariPreparati");

                entity.HasOne(d => d.Parte)
                    .WithMany(p => p.Preparati)
                    .HasForeignKey(d => d.ParteId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Preparati$ModiPreparazionePreparati");
            });

            modelBuilder.Entity<Preparatori>(entity =>
            {
                entity.HasIndex(e => e.Cognome)
                    .HasName("Preparatori$Cognome");

                entity.HasIndex(e => new { e.Cognome, e.Nome })
                    .HasName("Preparatori$UNomeCognome")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Cognome)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Preparazioni>(entity =>
            {
                entity.HasIndex(e => e.EsemplareId)
                    .HasName("Preparazioni$EsemplariPreparazioni");

                entity.HasIndex(e => e.Ordinamento)
                    .HasName("Preparazioni$Ordinamento");

                entity.HasIndex(e => e.PreparatoreId)
                    .HasName("Preparazioni$PreparatoreID");

                entity.HasIndex(e => new { e.EsemplareId, e.PreparatoreId, e.Ordinamento })
                    .HasName("Preparazioni$UEsemplareIDPreparatoreIDOrdinamento")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.EsemplareId)
                    .IsRequired()
                    .HasColumnName("EsemplareID");

                entity.Property(e => e.Ordinamento).IsRequired();

                entity.Property(e => e.PreparatoreId)
                    .IsRequired()
                    .HasColumnName("PreparatoreID");

                entity.HasOne(d => d.Esemplare)
                    .WithMany(p => p.Preparazioni)
                    .HasForeignKey(d => d.EsemplareId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Preparazioni$EsemplariPreparazioni");

                entity.HasOne(d => d.Preparatore)
                    .WithMany(p => p.Preparazioni)
                    .HasForeignKey(d => d.PreparatoreId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Preparazioni$PersonePreparazioni");
            });

            modelBuilder.Entity<Province>(entity =>
            {
                entity.HasIndex(e => e.Provincia)
                    .HasName("Province$Provincia");

                entity.HasIndex(e => e.RegioneId)
                    .HasName("Province$RegioniItaliaProvinceItalia");

                entity.HasIndex(e => new { e.RegioneId, e.Provincia })
                    .HasName("Province$URegioneProvincia")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Provincia)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.RegioneId)
                    .IsRequired()
                    .HasColumnName("RegioneID");

                entity.Property(e => e.SiglaProvincia).HasMaxLength(255);

                entity.HasOne(d => d.Regione)
                    .WithMany(p => p.Province)
                    .HasForeignKey(d => d.RegioneId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Province$RegioniItaliaProvinceItalia");
            });

            modelBuilder.Entity<Raccoglitori>(entity =>
            {
                entity.HasIndex(e => e.Raccoglitore)
                    .HasName("Raccoglitori$Raccoglitore")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Raccoglitore)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Regioni>(entity =>
            {
                entity.HasIndex(e => e.NazioneId)
                    .HasName("Regioni$NazioniRegioni");

                entity.HasIndex(e => e.Regione)
                    .HasName("Regioni$Regione");

                entity.HasIndex(e => new { e.NazioneId, e.Regione })
                    .HasName("Regioni$UNazioneRegione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.NazioneId)
                    .IsRequired()
                    .HasColumnName("NazioneID");

                entity.Property(e => e.Regione)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasOne(d => d.Nazione)
                    .WithMany(p => p.Regioni)
                    .HasForeignKey(d => d.NazioneId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Regioni$NazioniRegioni");
            });

            modelBuilder.Entity<Sale>(entity =>
            {
                entity.HasIndex(e => e.Sala)
                    .HasName("Sale$Sala")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Sala)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Sessi>(entity =>
            {
                entity.HasIndex(e => e.Sesso)
                    .HasName("Sessi$Sesso")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Sesso)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Sottofamiglie>(entity =>
            {
                entity.HasIndex(e => e.FamigliaId)
                    .HasName("Sottofamiglie$FamiglieSottofamiglie");

                entity.HasIndex(e => e.Nome)
                    .HasName("Sottofamiglie$Sottofamiglia");

                entity.HasIndex(e => new { e.FamigliaId, e.Nome })
                    .HasName("Sottofamiglie$UFamigliaSottofamiglia")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FamigliaId).HasColumnName("FamigliaID");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Sottofamiglia"); ;

                entity.HasOne(d => d.Famiglia)
                    .WithMany(p => p.Figli)
                    .HasForeignKey(d => d.FamigliaId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Sottofamiglie$FamiglieSottofamiglie");
            });

            modelBuilder.Entity<Sottospecie>(entity =>
            {
                entity.Property(e => e.Nome)
                    .HasColumnName("Sottospecie");

                entity.HasIndex(e => e.Nome)
                    .HasName("Sottospecie$Sottospecie");

                entity.HasIndex(e => e.SpecieId)
                    .HasName("Sottospecie$SpecieSottospecie");

                entity.HasIndex(e => e.StatoConservazioneId)
                    .HasName("Sottospecie$StatiConservazioneSottospecie");

                entity.HasIndex(e => new { e.SpecieId, e.Nome })
                    .HasName("Sottospecie$USpecieSottospecie")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AnnoClassificazione)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.ClassificazioneOriginale).HasDefaultValueSql("0");

                entity.Property(e => e.NomeInglese).HasMaxLength(255);

                entity.Property(e => e.ElencoAutori).HasMaxLength(255);

                entity.Property(e => e.NomeItaliano).HasMaxLength(255);

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasColumnName("Sottospecie")
                    .HasMaxLength(255);

                entity.Property(e => e.SpecieId).HasColumnName("SpecieID");


                entity.Property(e => e.StatoConservazioneId).HasColumnName("StatoConservazioneID");

                entity.HasOne(d => d.Specie)
                    .WithMany(p => p.Figli)
                    .HasForeignKey(d => d.SpecieId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Sottospecie$SpecieSottospecie");

                entity.HasOne(d => d.StatoConservazione)
                    .WithMany(p => p.Sottospecie)
                    .HasForeignKey(d => d.StatoConservazioneId)
                    .HasConstraintName("Sottospecie$StatiConservazioneSottospecie");
            });

            modelBuilder.Entity<Specie>(entity =>
            {
                entity.HasIndex(e => e.GenereId)
                    .HasName("Specie$GeneriSpecie");

                entity.HasIndex(e => e.Nome)
                    .HasName("Specie$Specie");

                entity.HasIndex(e => new { e.GenereId, e.Nome })
                    .HasName("Specie$UGenereSpecie")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.GenereId).HasColumnName("GenereID");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("NomeSpecie");

                entity.HasOne(d => d.Genere)
                    .WithMany(p => p.Figli)
                    .HasForeignKey(d => d.GenereId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Specie$GeneriSpecie");
            });

            modelBuilder.Entity<Spedizioni>(entity =>
            {
                entity.HasIndex(e => e.Spedizione)
                    .HasName("Spedizioni$Viaggio")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Spedizione)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<StatiConservazione>(entity =>
            {
                entity.HasIndex(e => e.Sigla)
                    .HasName("StatiConservazione$Sigla")
                    .IsUnique();

                entity.HasIndex(e => e.StatoConservazione)
                    .HasName("StatiConservazione$StatoConservazione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Sigla)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.StatoConservazione)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Tipi>(entity =>
            {
                entity.HasIndex(e => e.Tipo)
                    .HasName("Tipi$Tipo")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Tipo)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<TipiAcquisizione>(entity =>
            {
                entity.HasIndex(e => e.TipoAcquisizione)
                    .HasName("TipiAcquisizione$Acquisizione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.TipoAcquisizione)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Tribu>(entity =>
            {
                entity.HasIndex(e => e.Nome)
                    .HasName("Tribu$Tribu");

                entity.HasIndex(e => e.SottofamigliaId)
                    .HasName("Tribu$SottofamiglieTribu");

                entity.HasIndex(e => new { e.SottofamigliaId, e.Nome })
                    .HasName("Tribu$USottofamigliaTribu")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("NomeTribu");

                entity.Property(e => e.SottofamigliaId).HasColumnName("SottofamigliaID");

                entity.HasOne(d => d.Sottofamiglia)
                    .WithMany(p => p.Figli)
                    .HasForeignKey(d => d.SottofamigliaId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("Tribu$SottofamiglieTribu");
            });

            modelBuilder.Entity<VecchiDeterminatori>(entity =>
            {
                entity.HasIndex(e => e.DeterminatoreId)
                    .HasName("VecchiDeterminatori$DeterminatoriVecchiDeterminatori");

                entity.HasIndex(e => e.VecchiaDeterminazioneId)
                    .HasName("VecchiDeterminatori$VecchieDeterminazioniVecchiDeterminatori");

                entity.HasIndex(e => new { e.VecchiaDeterminazioneId, e.DeterminatoreId })
                    .HasName("VecchiDeterminatori$UVecchiaDeterminazioneDeterminatore")
                    .IsUnique();

                entity.HasIndex(e => new { e.VecchiaDeterminazioneId, e.Ordinamento })
                    .HasName("VecchiDeterminatori$UOrdinamento")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.DeterminatoreId)
                    .IsRequired()
                    .HasColumnName("DeterminatoreID");

                entity.Property(e => e.Ordinamento).IsRequired();

                entity.Property(e => e.VecchiaDeterminazioneId)
                    .IsRequired()
                    .HasColumnName("VecchiaDeterminazioneID");

                entity.HasOne(d => d.Determinatore)
                    .WithMany(p => p.VecchiDeterminatori)
                    .HasForeignKey(d => d.DeterminatoreId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("VecchiDeterminatori$DeterminatoriVecchiDeterminatori");

                entity.HasOne(d => d.VecchiaDeterminazione)
                    .WithMany(p => p.VecchiDeterminatori)
                    .HasForeignKey(d => d.VecchiaDeterminazioneId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("VecchiDeterminatori$VecchieDeterminazioniVecchiDeterminatori");
            });

            modelBuilder.Entity<VecchieDeterminazioni>(entity =>
            {
                entity.HasIndex(e => e.EsemplareId)
                    .HasName("VecchieDeterminazioni$EsemplariVecchieDeterminazioni");

                entity.HasIndex(e => e.VecchiaDeterminazione)
                    .HasName("VecchieDeterminazioni$VecchiaDeterminazione");

                entity.HasIndex(e => new { e.EsemplareId, e.Ordinamento })
                    .HasName("VecchieDeterminazioni$UEsemplareOrdinamento")
                    .IsUnique();

                entity.HasIndex(e => new { e.EsemplareId, e.VecchiaDeterminazione })
                    .HasName("VecchieDeterminazioni$UEsemplareDeterminazione")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.EsemplareId)
                    .IsRequired()
                    .HasColumnName("EsemplareID");

                entity.Property(e => e.Ordinamento).IsRequired();

                entity.Property(e => e.VecchiaDeterminazione)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasOne(d => d.Esemplare)
                    .WithMany(p => p.VecchieDeterminazioni)
                    .HasForeignKey(d => d.EsemplareId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("VecchieDeterminazioni$EsemplariVecchieDeterminazioni");
            });
        }

        //public virtual DbSet<ElencoSinteticoEsemplari> ElencoSinteticoEsemplari { get; set; }
        public virtual DbSet<Aberrazioni> Aberrazioni { get; set; }
        public virtual DbSet<Armadi> Armadi { get; set; }
        public virtual DbSet<Cassetti> Cassetti { get; set; }
        public virtual DbSet<Citta> Citta { get; set; }
        public virtual DbSet<ElencoClassificatoriViewModel> Classificatori { get; set; }
        public virtual DbSet<Classificazioni> Classificazioni { get; set; }
        public virtual DbSet<Collezioni> Collezioni { get; set; }
        public virtual DbSet<Determinatori> Determinatori { get; set; }
        public virtual DbSet<Determinazioni> Determinazioni { get; set; }
        public virtual DbSet<Donatori> Donatori { get; set; }
        public virtual DbSet<Esemplari> Esemplari { get; set; }
        public virtual DbSet<Famiglie> Famiglie { get; set; }
        public virtual DbSet<Generi> Generi { get; set; }
        public virtual DbSet<Localita> Localita { get; set; }
        public virtual DbSet<Nazioni> Nazioni { get; set; }
        public virtual DbSet<PartiPreparate> PartiPreparate { get; set; }
        public virtual DbSet<Preparati> Preparati { get; set; }
        public virtual DbSet<Preparatori> Preparatori { get; set; }
        public virtual DbSet<Preparazioni> Preparazioni { get; set; }
        public virtual DbSet<Province> Province { get; set; }
        public virtual DbSet<Raccoglitori> Raccoglitori { get; set; }
        public virtual DbSet<Regioni> Regioni { get; set; }
        public virtual DbSet<Sale> Sale { get; set; }
        public virtual DbSet<Sessi> Sessi { get; set; }
        public virtual DbSet<Sottofamiglie> Sottofamiglie { get; set; }
        public virtual DbSet<Sottospecie> Sottospecie { get; set; }
        public virtual DbSet<Specie> Specie { get; set; }
        public virtual DbSet<Spedizioni> Spedizioni { get; set; }
        public virtual DbSet<StatiConservazione> StatiConservazione { get; set; }
        public virtual DbSet<Tipi> Tipi { get; set; }
        public virtual DbSet<TipiAcquisizione> TipiAcquisizione { get; set; }
        public virtual DbSet<Tribu> Tribu { get; set; }
        public virtual DbSet<VecchiDeterminatori> VecchiDeterminatori { get; set; }
        public virtual DbSet<VecchieDeterminazioni> VecchieDeterminazioni { get; set; }
    }
}