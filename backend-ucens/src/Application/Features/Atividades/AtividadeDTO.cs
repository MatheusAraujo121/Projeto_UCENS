using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Atividades
{
    public class AtividadeDTO
    {
        public int Id { get; set; }

        [StringLength(20)]
        public string Codigo { get; set; } = string.Empty;

        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Descricao { get; set; }

        [StringLength(2048)]
        public string? ImagemUrl { get; set; }

        public bool ExigePiscina { get; set; }
        public bool ExigeFisico { get; set; }

        [StringLength(50)]
        public string? Categoria { get; set; }

        public List<string> DiasDisponiveis { get; set; } = new(); 

        [StringLength(50)]
        public string? HorarioSugerido { get; set; } 

        public int? IdadeMinima { get; set; }
        public int? IdadeMaxima { get; set; }
        public int? LimiteParticipantes { get; set; }

        public List<string> Local { get; set; } = new(); 

        [StringLength(150)]
        public string? ProfessorResponsavel { get; set; }

        [StringLength(1000)]
        public string? Acontecimentos { get; set; }
    }
}