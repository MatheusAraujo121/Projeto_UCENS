using System.Collections.Generic;

namespace Application.Features.Turmas
{
    public class AlunoMatriculadoDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty; 
    }
    public class TurmaDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Professor { get; set; }
        public string? DiasHorarios { get; set; }
        public int Vagas { get; set; }
        public int AtividadeId { get; set; }

        public List<AlunoMatriculadoDTO> AlunosMatriculados { get; set; } = new();
    }
}