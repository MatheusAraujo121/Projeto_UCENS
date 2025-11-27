using Application.Common.Interfaces;
using Domain;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class DependenteRepository : EfRepository<Dependente>, IDependenteRepository
    {
        private readonly AppDbContext _context;

        public DependenteRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Dependente[]> GetByAssociadoIdAsync(int associadoId)
        {
            return await _context.Dependentes
                                 .Where(d => d.AssociadoId == associadoId)
                                 .ToArrayAsync(); 
        }

    }
}

