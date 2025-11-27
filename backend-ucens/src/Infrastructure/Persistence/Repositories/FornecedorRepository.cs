using Application.Common.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class FornecedorRepository : EfRepository<Fornecedor>, IFornecedorRepository
    {
        private readonly AppDbContext _context;

        public FornecedorRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Fornecedor?> GetByIdWithDespesasAsync(int id)
        {
            return await _context.Fornecedores
                .Include(f => f.Despesas)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<List<Fornecedor>> GetAllWithDespesasAsync()
        {
            return await _context.Fornecedores 
                .Include(f => f.Despesas)
                .ToListAsync();
        }
    }
}