using Application.Common.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class MatriculaDependenteRepository : EfRepository<MatriculaDependente>, IMatriculaDependenteRepository
    {
        private readonly AppDbContext _context;

        public MatriculaDependenteRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<MatriculaDependente?> Find(int dependenteId, int turmaId)
        {
            return await _context.MatriculasDependentes
                .FirstOrDefaultAsync(m => m.DependenteId == dependenteId && m.TurmaId == turmaId);
        }

        public async Task Remove(MatriculaDependente matricula)
        {
            _context.MatriculasDependentes.Remove(matricula);
            await _context.SaveChangesAsync();
        }
    }
}