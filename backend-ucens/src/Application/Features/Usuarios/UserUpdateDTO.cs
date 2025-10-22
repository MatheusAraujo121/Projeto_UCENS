using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Usuarios
{
    public class UserUpdateDTO
    {
        [Required] // Adicionado
        [StringLength(50)] // Adicionado
        public string UserName { get; set; } = string.Empty;

        [Required] // Adicionado
        [EmailAddress] // Adicionado
        [StringLength(150)] // Adicionado
        public string Email { get; set; } = string.Empty;
        
        // A senha é opcional, mas se for fornecida, deve ter no mínimo 6 caracteres.
        [StringLength(255, MinimumLength = 8)] // Adicionado
        public string? Senha { get; set; } 
    }
}