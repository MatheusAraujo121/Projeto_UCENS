using Domain;
using System.Threading.Tasks;
using System.Collections.Generic; // Adicionar

namespace Application.Common.Interfaces
{
    public interface IAssociadoRepository : IRepository<Associado>
    {
        Task<Associado?> GetByCPF(string cpf);
        Task<List<Associado>> GetAllWithDependentes(); 
                Task<List<Associado>> GetAssociadosByIds(int[] associadoIds); 
    }
}