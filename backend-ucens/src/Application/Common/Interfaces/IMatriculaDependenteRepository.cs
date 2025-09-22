using Domain;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IMatriculaDependenteRepository : IRepository<MatriculaDependente>
    {
        Task<MatriculaDependente?> Find(int dependenteId, int turmaId);
        Task Remove(MatriculaDependente matricula);
    }
}