using Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface ITurmaRepository : IRepository<Turma>
    {
        Task<Turma?> GetByIdWithMatriculados(int turmaId);
        Task<List<Turma>> GetAllWithMatriculados();
        Task<List<Turma>> GetByAtividadeId(int atividadeId); 
    }
}