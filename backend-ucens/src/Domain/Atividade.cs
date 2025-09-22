using System;
using System.Collections.Generic;

namespace Domain
{
    public class Atividade
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? ImagemUrl { get; set; }
        public bool ExigePiscina { get; set; }
        public bool ExigeFisico { get; set; }
        public string? Categoria { get; set; }
        public string? DiasDisponiveis { get; set; } 
        public TimeSpan? HorarioSugerido { get; set; }
        public int? IdadeMinima { get; set; }
        public int? IdadeMaxima { get; set; }
        public int? LimiteParticipantes { get; set; }
        public string? Local { get; set; } 
        public string? ProfessorResponsavel { get; set; }

        public string? Acontecimentos { get; set; }
    }
}