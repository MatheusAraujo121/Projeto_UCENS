using Application.Common.Interfaces;
using Domain;

namespace Infrastructure.Persistence.Repositories
{
    public class TransacaoRepository : EfRepository<Transacao>, ITransacaoRepository
    {
        public TransacaoRepository(AppDbContext dbContext) : base(dbContext)
        {
        }
    }
}