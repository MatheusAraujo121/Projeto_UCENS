using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Usuarios
{
    public class UserDTO
    {
        [Required] // Adicionado
        [StringLength(50)] // Adicionado
        public string Nome { get; set; } = string.Empty;

        [Required] // Adicionado
        [EmailAddress] // Adicionado
        [StringLength(150)] // Adicionado
        public string Email { get; set; } = string.Empty;

        [Required] // Adicionado
        [StringLength(255)] // Adicionado
        public string Senha { get; set; } = string.Empty;
    }
}