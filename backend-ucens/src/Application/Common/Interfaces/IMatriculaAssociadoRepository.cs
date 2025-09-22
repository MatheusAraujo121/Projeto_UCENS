using Domain;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IMatriculaAssociadoRepository : IRepository<MatriculaAssociado>
    {
        Task<MatriculaAssociado?> Find(int associadoId, int turmaId);
        Task Remove(MatriculaAssociado matricula);
    }
}