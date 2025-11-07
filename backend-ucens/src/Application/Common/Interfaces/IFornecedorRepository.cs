using Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IFornecedorRepository : IRepository<Fornecedor>
    {
        Task<Fornecedor?> GetByIdWithDespesasAsync(int id);
        Task<List<Fornecedor>> GetAllWithDespesasAsync();
    }
}