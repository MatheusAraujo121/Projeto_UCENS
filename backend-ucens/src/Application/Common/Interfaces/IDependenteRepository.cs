using Domain;

namespace Application.Common.Interfaces
{
    public interface IDependenteRepository : IRepository<Dependente>
    {
        Task<Dependente[]> GetByAssociadoIdAsync(int associadoId);
    }
}