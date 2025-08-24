using Microsoft.EntityFrameworkCore;
using userApi.Domain.Entities;
using userApi.Domain.Interfaces;
using userApi.Infrastructure.Data;

namespace userApi.Infrastructure.Repositories
{
    public class AssociadosRepository : IRepository<Associados>
    {
        private readonly UserDbContext _context;

        public AssociadosRepository(UserDbContext context)
        {
            _context = context;
        }

        public async Task<Associados> Add(Associados entity)
        {
            _context.Associados.Add(entity); // <- aqui precisa reconhecer _context.Associados
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Delete(int id)
        {
            var associado = await _context.Associados.FindAsync(id);
            if (associado != null)
            {
                _context.Associados.Remove(associado);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Associados>> GetAll()
        {
            return await _context.Associados.ToListAsync();
        }

        public async Task<Associados?> GetById(int id)
        {
            return await _context.Associados.FindAsync(id);
        }

        public async Task<Associados> Update(Associados entity)
        {
            _context.Associados.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}
