using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Application.Features.Turmas
{
    public class AlunoMatriculadoDTO
    {
        public int Id { get; set; }
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;
        [StringLength(100)]
        public string Tipo { get; set; } = string.Empty; 
    }
    public class TurmaDTO
    {
        public int Id { get; set; }

        [StringLength(100)] // Adicionado
        public string Nome { get; set; } = string.Empty;

        [StringLength(150)] // Adicionado
        public string? Professor { get; set; }

        [StringLength(100)] // Adicionado
        public string? DiasHorarios { get; set; }

        public int Vagas { get; set; }
        public int AtividadeId { get; set; }

        public List<AlunoMatriculadoDTO> AlunosMatriculados { get; set; } = new();
    }
}