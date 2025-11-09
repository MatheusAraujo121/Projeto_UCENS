using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Adicionado

namespace Domain
{
    public class Atividade
    {
        public int Id { get; set; }

        [StringLength(20)] // Adicionado
        public string Codigo { get; set; } = string.Empty;

        [StringLength(100)] // Adicionado
        public string Nome { get; set; } = string.Empty;

        [StringLength(1000)] // Adicionado
        public string? Descricao { get; set; }

        [StringLength(2048)] // Adicionado
        public string? ImagemUrl { get; set; }

        //Id retornado pelo imagekit
        public string? ImagemFileId { get; set; }

        public bool ExigePiscina { get; set; }
        public bool ExigeFisico { get; set; }

        [StringLength(50)] // Adicionado
        public string? Categoria { get; set; }

        [StringLength(100)] // Adicionado
        public string? DiasDisponiveis { get; set; }

        public TimeSpan? HorarioSugerido { get; set; }
        public int? IdadeMinima { get; set; }
        public int? IdadeMaxima { get; set; }
        public int? LimiteParticipantes { get; set; }

        [StringLength(100)] // Adicionado
        public string? Local { get; set; }

        [StringLength(150)] // Adicionado
        public string? ProfessorResponsavel { get; set; }

        [StringLength(1000)] // Adicionado
        public string? Acontecimentos { get; set; }
        
        public ICollection<Turma> Turmas { get; set; } = new List<Turma>();
    }
}