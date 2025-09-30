using System.ComponentModel.DataAnnotations;

namespace Domain;

public class Associado
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Cognome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;
    [MaxLength(30)]
    public string Rg { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }
    [MaxLength(10)]
    public string Sexo { get; set; } = string.Empty;
    [MaxLength(30)]
    public string EstadoCivil { get; set; } = string.Empty;
    [MaxLength(100)]
    public string NomePai { get; set; } = string.Empty;
    [MaxLength(100)]
    public string NomeMae { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Endereco { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Numero { get; set; } = string.Empty;
    [MaxLength(50)]
    public string Complemento { get; set; } = string.Empty;
    [MaxLength(150)]
    public string Telefone { get; set; } = string.Empty;
    [MaxLength(100)]
    public string LocalNascimento { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Nacionalidade { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Profissao { get; set; } = string.Empty;
    [MaxLength(30)]
    public string Situacao { get; set; } = string.Empty;

    [MaxLength(100)]
    public string GrauInstrucao { get; set; } = string.Empty;

    public ICollection<Dependente> Dependentes { get; set; } = new List<Dependente>();
    public ICollection<MatriculaAssociado> Matriculas { get; set; } = new List<MatriculaAssociado>();
}