using System.ComponentModel.DataAnnotations; 

namespace Application.Features.Usuarios
{
    public class UserUpdateDTO
    {
        [Required]
        [StringLength(50)] 
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress] 
        [StringLength(150)] 
        public string Email { get; set; } = string.Empty;
        
        [StringLength(255, MinimumLength = 8)] 
        public string? Senha { get; set; } 
    }
}