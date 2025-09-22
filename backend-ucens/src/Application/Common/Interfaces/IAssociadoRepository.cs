using Domain;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IAssociadoRepository : IRepository<Associado>
    {
        Task<Associado?> GetByCPF(string cpf);
        Task<List<Associado>> GetAllWithDependentes(); 
    }
}