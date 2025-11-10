using System;
using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Eventos
{
    public class EventoDTO
    {
        public int Id { get; set; }

        [StringLength(150)] // Adicionado
        public string Nome { get; set; } = string.Empty;

        [StringLength(1000)] // Adicionado
        public string? Descricao { get; set; }

        [StringLength(150)] // Adicionado
        public string Local { get; set; } = string.Empty;

        public DateTime Inicio { get; set; }
        public DateTime Fim { get; set; }

        [StringLength(2048)] // Adicionado
        public string? ImagemUrl { get; set; }
        public string? ImagemFileId { get; set; }
    }
}