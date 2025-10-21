using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Contato
{
    public class ContatoDTO
    {
        [Required] // Adicionado
        [StringLength(100)] // Adicionado
        public string Nome { get; set; } = string.Empty;

        [Required] // Adicionado
        [EmailAddress] // Adicionado para validar o formato do e-mail
        [StringLength(150)] // Adicionado
        public string Email { get; set; } = string.Empty;

        [Required] // Adicionado
        [StringLength(2000)] // Adicionado (um limite generoso para a mensagem)
        public string Mensagem { get; set; } = string.Empty;
    }
}