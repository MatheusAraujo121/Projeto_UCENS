using Domain;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IBoletoRepository : IRepository<Boleto>
    {
        Task AddRangeAsync(IEnumerable<Boleto> boletos);
    }
}