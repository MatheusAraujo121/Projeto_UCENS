using Microsoft.EntityFrameworkCore;
using userApi.Domain.Entities;

namespace userApi.Infrastructure.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
    }
}
