using System;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Evento
    {
        public int Id { get; set; }

        [StringLength(150)] 
        public string Nome { get; set; } = string.Empty;

        [StringLength(1000)] 
        public string? Descricao { get; set; }

        [StringLength(150)] 
        public string Local { get; set; } = string.Empty;
        
        public DateTime Inicio { get; set; }
        public DateTime Fim { get; set; }

        [StringLength(2048)] 
        public string? ImagemUrl { get; set; }

        public string? ImagemFileId { get; set; }
    }
}