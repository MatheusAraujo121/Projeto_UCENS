using Application.Common.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class TurmaRepository : EfRepository<Turma>, ITurmaRepository
    {
        private readonly AppDbContext _context;

        public TurmaRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Turma?> GetByIdWithMatriculados(int turmaId)
        {
            return await _context.Turmas
                .Include(t => t.MatriculasAssociados)
                    .ThenInclude(ma => ma.Associado)
                .Include(t => t.MatriculasDependentes)
                    .ThenInclude(md => md.Dependente)
                .FirstOrDefaultAsync(t => t.Id == turmaId);
        }

        public async Task<List<Turma>> GetAllWithMatriculados()
        {
            return await _context.Turmas
                .Include(t => t.MatriculasAssociados)
                    .ThenInclude(ma => ma.Associado)
                .Include(t => t.MatriculasDependentes)
                    .ThenInclude(md => md.Dependente)
                .ToListAsync();
        }

        public async Task<List<Turma>> GetByAtividadeId(int atividadeId)
        {
            return await _context.Turmas
                .Where(t => t.AtividadeId == atividadeId)
                .Include(t => t.MatriculasAssociados)
                    .ThenInclude(ma => ma.Associado) 
                .Include(t => t.MatriculasDependentes)
                    .ThenInclude(md => md.Dependente) 
                .ToListAsync();
        }
    }
}