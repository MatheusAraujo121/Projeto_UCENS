using System.ComponentModel.DataAnnotations; 
namespace Application.Features.Usuarios
{
    public class UserCreateDTO
    {
        [Required(ErrorMessage = "O nome de usuário é obrigatório.")]
        [StringLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [StringLength(150)]
        [EmailAddress(ErrorMessage = "O formato do e-mail é inválido.")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MinLength(8, ErrorMessage = "A senha deve ter no mínimo 8 caracteres.")]
        [StringLength(100, MinimumLength = 8)]
        public string Senha { get; set; } = string.Empty;
    }
}