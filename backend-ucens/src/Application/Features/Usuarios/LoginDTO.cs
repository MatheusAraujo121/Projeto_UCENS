using System.ComponentModel.DataAnnotations;

namespace Application.Features.Usuarios
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        [StringLength(150)] 
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)] 
        public string Senha { get; set; } = string.Empty;
    }
}