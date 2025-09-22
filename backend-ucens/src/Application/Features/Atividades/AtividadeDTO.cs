using System;
using System.Collections.Generic;

namespace Application.Features.Atividades
{
    public class AtividadeDTO
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? ImagemUrl { get; set; }
        public bool ExigePiscina { get; set; }
        public bool ExigeFisico { get; set; }
        public string? Categoria { get; set; }
        public List<string> DiasDisponiveis { get; set; } = new(); 
        public string? HorarioSugerido { get; set; } 
        public int? IdadeMinima { get; set; }
        public int? IdadeMaxima { get; set; }
        public int? LimiteParticipantes { get; set; }
        public List<string> Local { get; set; } = new(); 
        public string? ProfessorResponsavel { get; set; }

        public string? Acontecimentos { get; set; }
    }
}