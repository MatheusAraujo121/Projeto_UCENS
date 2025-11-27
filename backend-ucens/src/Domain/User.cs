using System.ComponentModel.DataAnnotations;

namespace Domain;

public class User
{
    public int Id { get; set; }

    [StringLength(50)] 
    public string UserName { get; set; } = string.Empty;

    [StringLength(150)] 
    public string Email { get; set; } = string.Empty;

    [StringLength(255)] 
    public string Senha { get; set; } = string.Empty;
}