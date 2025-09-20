using System;

namespace Application.Features.Eventos
{
    public class EventoDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string Local { get; set; } = string.Empty;
        public DateTime Inicio { get; set; }
        public DateTime Fim { get; set; }
        public string? ImagemUrl { get; set; }
    }
}