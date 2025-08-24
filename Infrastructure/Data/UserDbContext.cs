using Microsoft.EntityFrameworkCore;
using userApi.Domain.Entities;

namespace userApi.Infrastructure.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Associados> Associados { get; set; } = null!;
        public DbSet<Dependentes> Dependentes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relacionamento 1:N
            modelBuilder.Entity<Associados>()
                .HasMany(a => a.Dependentes)
                .WithOne(d => d.Associado!)
                .HasForeignKey(d => d.AssociadoId);
        }
    }
}
