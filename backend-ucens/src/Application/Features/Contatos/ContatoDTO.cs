using System.ComponentModel.DataAnnotations; 
namespace Application.Features.Contato
{
    public class ContatoDTO
    {
        [Required] 
        [StringLength(100)] 
        public string Nome { get; set; } = string.Empty;

        [Required]
        [EmailAddress] 
        [StringLength(150)] 
        public string Email { get; set; } = string.Empty;

        [Required] 
        [StringLength(2000)] 
        public string Mensagem { get; set; } = string.Empty;
    }
}