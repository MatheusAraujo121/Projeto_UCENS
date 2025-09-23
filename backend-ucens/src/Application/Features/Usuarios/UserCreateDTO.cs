using System.ComponentModel.DataAnnotations; // Adicione este using

namespace Application.Features.Usuarios
{
    public class UserCreateDTO
    {
        [Required(ErrorMessage = "O nome de usuário é obrigatório.")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O formato do e-mail é inválido.")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MinLength(8, ErrorMessage = "A senha deve ter no mínimo 8 caracteres.")]
        public string Senha { get; set; } = string.Empty;
    }
}