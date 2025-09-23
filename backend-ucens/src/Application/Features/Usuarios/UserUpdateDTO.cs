namespace Application.Features.Usuarios
{
    public class UserUpdateDTO
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        public string? Senha { get; set; } 
    }
}