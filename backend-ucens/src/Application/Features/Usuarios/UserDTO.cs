using System.ComponentModel.DataAnnotations; 

namespace Application.Features.Usuarios
{
    public class UserDTO
    {
        [Required] 
        [StringLength(50)] 
        public string Nome { get; set; } = string.Empty;

        [Required] 
        [EmailAddress] 
        [StringLength(150)] 
        public string Email { get; set; } = string.Empty;

        [Required] 
        [StringLength(255)] 
        public string Senha { get; set; } = string.Empty;
    }
}