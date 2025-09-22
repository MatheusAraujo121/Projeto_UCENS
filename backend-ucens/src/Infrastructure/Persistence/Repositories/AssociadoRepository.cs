using Application.Common.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Persistence;

namespace Infrastructure.Persistence.Repositories
{
    public class AssociadoRepository : IAssociadoRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Associado> _set;

        public AssociadoRepository(AppDbContext context)
        {
            _context = context;
            _set = context.Set<Associado>();
        }

        public async Task<IEnumerable<Associado>> GetAll()
        {
            return await _set
                .Include(a => a.Dependentes)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Associado?> GetById(int id)
        {
            return await _set
                .Include(a => a.Dependentes)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Associado?> GetByCPF(string cpf)
        {
            return await _set
                .Include(a => a.Dependentes)
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.CPF == cpf);
        }

        public async Task<Associado> Add(Associado entity)
        {
            await _set.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Associado> Update(Associado entity)
        {
            _set.Update(entity);
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
        public async Task<List<Associado>> GetAllWithDependentes()
        {
            return await _context.Associados
                .Include(a => a.Dependentes) 
                .AsNoTracking()
                .ToListAsync();
        }
    }
}