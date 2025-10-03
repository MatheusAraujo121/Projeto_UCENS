using Microsoft.EntityFrameworkCore;
using Domain;

namespace Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Associado> Associados { get; set; } = null!;
        public DbSet<Dependente> Dependentes { get; set; } = null!;
        public DbSet<Evento> Eventos { get; set; } = null!;
        public DbSet<Atividade> Atividades { get; set; } = null!;
        public DbSet<Turma> Turmas { get; set; } = null!;
        public DbSet<MatriculaAssociado> MatriculasAssociados { get; set; } = null!;
        public DbSet<MatriculaDependente> MatriculasDependentes { get; set; } = null!;
         public DbSet<Boleto> Boletos { get; set; } = null!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.UserName)
                    .IsRequired()
                    .HasMaxLength(150);
                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(200);
            });
            modelBuilder.Entity<Associado>(entity =>
               {
                   entity.HasKey(a => a.Id);

                   entity.Property(a => a.Nome)
                       .IsRequired()
                       .HasMaxLength(150);

                   entity.Property(a => a.Email)
                       .IsRequired()
                       .HasMaxLength(100);

                   entity.Property(a => a.Cognome)
                       .IsRequired()
                       .HasMaxLength(100);

                   entity.Property(a => a.CPF)
                       .IsRequired()
                       .HasMaxLength(30);

                   entity.Property(a => a.Rg)
                       .HasMaxLength(30);

                   entity.Property(a => a.Sexo)
                       .HasMaxLength(10);

                   entity.Property(a => a.EstadoCivil)
                       .HasMaxLength(30);

                   entity.Property(a => a.NomePai)
                       .HasMaxLength(100);

                   entity.Property(a => a.NomeMae)
                       .HasMaxLength(100);

                   entity.Property(a => a.Cep)
                       .HasMaxLength(100);

                   entity.Property(a => a.Endereco)
                       .HasMaxLength(100);

                   entity.Property(a => a.Numero)
                       .HasMaxLength(10);

                   entity.Property(a => a.Complemento)
                       .HasMaxLength(50);

                   entity.Property(a => a.Telefone)
                       .HasMaxLength(15);

                   entity.Property(a => a.LocalNascimento)
                       .HasMaxLength(100);

                   entity.Property(a => a.Nacionalidade)
                       .HasMaxLength(100);

                   entity.Property(a => a.Profissao)
                       .HasMaxLength(100);

                   entity.Property(a => a.Situacao)
                       .HasMaxLength(30);

                   entity.Property(a => a.GrauInstrucao)
                      .HasMaxLength(30);

                   entity.HasMany(a => a.Dependentes)
                       .WithOne(d => d.Associado)
                       .HasForeignKey(d => d.AssociadoId)
                       .IsRequired()
                       .OnDelete(DeleteBehavior.Cascade);
               });

            modelBuilder.Entity<Dependente>(entity =>
            {
                entity.HasKey(d => d.Id);

                entity.Property(d => d.Nome)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(d => d.DataNascimento)
                    .IsRequired();
            });

            modelBuilder.Entity<Atividade>()
                .HasMany(a => a.Turmas)
                .WithOne(t => t.Atividade)
                .HasForeignKey(t => t.AtividadeId)
                .IsRequired();

            modelBuilder.Entity<MatriculaAssociado>()
                .HasKey(ma => new { ma.AssociadoId, ma.TurmaId });

            modelBuilder.Entity<MatriculaAssociado>()
                .HasOne(ma => ma.Associado)
                .WithMany(a => a.Matriculas)
                .HasForeignKey(ma => ma.AssociadoId);

            modelBuilder.Entity<MatriculaAssociado>()
                .HasOne(ma => ma.Turma)
                .WithMany(t => t.MatriculasAssociados)
                .HasForeignKey(ma => ma.TurmaId);

            modelBuilder.Entity<MatriculaDependente>()
                .HasKey(md => new { md.DependenteId, md.TurmaId });

            modelBuilder.Entity<MatriculaDependente>()
                .HasOne(md => md.Dependente)
                .WithMany(d => d.Matriculas)
                .HasForeignKey(md => md.DependenteId);

            modelBuilder.Entity<MatriculaDependente>()
                .HasOne(md => md.Turma)
                .WithMany(t => t.MatriculasDependentes)
                .HasForeignKey(md => md.TurmaId);

            modelBuilder.Entity<Boleto>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Valor).HasColumnType("decimal(18, 2)");
                entity.Property(b => b.ValorPago).HasColumnType("decimal(18, 2)");
                entity.Property(b => b.JurosMora).HasColumnType("decimal(18, 2)");
                entity.Property(b => b.PercentualMulta).HasColumnType("decimal(18, 2)");
                entity.HasOne(b => b.Associado)
                      .WithMany()
                      .HasForeignKey(b => b.AssociadoId);
            });
        }
    }
}