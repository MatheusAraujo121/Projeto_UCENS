using Microsoft.EntityFrameworkCore;
using userApi.Domain.Interfaces;
using userApi.Infrastructure.Data;

namespace userApi.Infrastructure.Repositories
{
    public class EfRepository<T> : IRepository<T> where T : class
    {
        private readonly UserDbContext _context;
        private readonly DbSet<T> _set;

        public EfRepository(UserDbContext context)
        {
            _context = context;
            _set = _context.Set<T>();
        }

        public async Task<T> Add(T entity)
        {
            _set.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Delete(int id)
        {
            var entity = await _set.FindAsync(id);
            if (entity is null) return;
            _set.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            return await _set.AsNoTracking().ToListAsync();
        }

        public async Task<T?> GetById(int id)
        {
            return await _set.FindAsync(id);
        }

        public async Task<T> Update(T entity)
        {
            _set.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}
