using Application.Common.Interfaces;
using Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class BoletoRepository : EfRepository<Boleto>, IBoletoRepository
    {
        private readonly AppDbContext _context;

        public BoletoRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task AddRangeAsync(IEnumerable<Boleto> boletos)
        {
            await _context.Boletos.AddRangeAsync(boletos);
        }
        public IQueryable<Boleto> GetQueryable()
        {
            return _context.Boletos.AsQueryable();
        }
    }
}