using Application.Common.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class AssociadoRepository : EfRepository<Associado>, IAssociadoRepository
    {
        private readonly AppDbContext _context;

        public AssociadoRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Associado?> GetByCPF(string cpf)
        {
            return await _context.Associados
                .Include(a => a.Dependentes)
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.CPF == cpf);
        }

        public async Task<List<Associado>> GetAllWithDependentes()
        {
            return await _context.Associados
                .Include(a => a.Dependentes)
                .AsNoTracking()
                .ToListAsync();
        }
        
        public async Task<List<Associado>> GetAssociadosByIds(int[] associadoIds)
        {
            return await _context.Associados
                                 .Where(a => associadoIds.Contains(a.Id))
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Associado>> GetAssociadosAtivosAsync()
        {
            return await _dbContext.Associados
                .Where(a => a.Situacao == "Regular")
                .ToListAsync();
        }
    }
}