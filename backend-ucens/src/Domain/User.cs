using System.ComponentModel.DataAnnotations; // Adicionado

namespace Domain;

public class User
{
    public int Id { get; set; }

    [StringLength(50)] // Adicionado
    public string UserName { get; set; } = string.Empty;

    [StringLength(150)] // Adicionado
    public string Email { get; set; } = string.Empty;

    [StringLength(255)] // Adicionado (para armazenar o hash da senha)
    public string Senha { get; set; } = string.Empty;
}