using Application.Common.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class MatriculaAssociadoRepository : EfRepository<MatriculaAssociado>, IMatriculaAssociadoRepository
    {
        private readonly AppDbContext _context;

        public MatriculaAssociadoRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<MatriculaAssociado?> Find(int associadoId, int turmaId)
        {
            return await _context.MatriculasAssociados
                .FirstOrDefaultAsync(m => m.AssociadoId == associadoId && m.TurmaId == turmaId);
        }

        public async Task Remove(MatriculaAssociado matricula)
        {
            _context.MatriculasAssociados.Remove(matricula);
            await _context.SaveChangesAsync();
        }
    }
}