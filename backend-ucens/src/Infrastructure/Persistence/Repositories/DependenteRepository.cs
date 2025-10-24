using Application.Common.Interfaces;
using Domain;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class DependenteRepository : EfRepository<Dependente>, IDependenteRepository
    {
        // --- CAMPO _context ADICIONADO ---
        private readonly AppDbContext _context;

        // --- CONSTRUTOR ATUALIZADO ---
        public DependenteRepository(AppDbContext context) : base(context)
        {
            // Atribui o contexto local
            _context = context;
        }

        // --- MÉTODO ATUALIZADO ---
        // Retorno ajustado para Task<Dependente[]> e usando ToArrayAsync()
        public async Task<Dependente[]> GetByAssociadoIdAsync(int associadoId)
        {
            // Usa o _context local
            return await _context.Dependentes
                                 .Where(d => d.AssociadoId == associadoId)
                                 .ToArrayAsync(); // Modificado de ToListAsync para ToArrayAsync
        }
        // --- FIM DA ATUALIZAÇÃO ---

        // Se você adicionar outros métodos personalizados em IDependenteRepository,
        // implemente-os aqui.
    }
}

