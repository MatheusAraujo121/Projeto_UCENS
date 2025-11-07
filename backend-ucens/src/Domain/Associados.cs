using System.ComponentModel.DataAnnotations;

namespace Domain;

public class Associado
{
    public int Id { get; set; }

    [StringLength(150)]
    public string Nome { get; set; } = string.Empty;

    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [StringLength(100)]
    public string Cognome { get; set; } = string.Empty;

    [StringLength(14)]
    public string CPF { get; set; } = string.Empty;

    [StringLength(30)]
    public string Rg { get; set; } = string.Empty;

    public DateTime DataNascimento { get; set; }

    [StringLength(10)]
    public string Sexo { get; set; } = string.Empty;

    [StringLength(30)]
    public string EstadoCivil { get; set; } = string.Empty;

    [StringLength(150)]
    public string NomePai { get; set; } = string.Empty;

    [StringLength(150)]
    public string NomeMae { get; set; } = string.Empty;

    [StringLength(10)]
    public string Cep { get; set; } = string.Empty;

    [StringLength(200)]
    public string Endereco { get; set; } = string.Empty;

    [StringLength(100)]
    public string Bairro { get; set; } = "";

    [StringLength(100)]
    public string Cidade { get; set; } = "";

    [StringLength(2)]
    public string UF { get; set; } = "";

    [StringLength(10)] 
    public string Numero { get; set; } = string.Empty;

    [StringLength(50)]
    public string Complemento { get; set; } = string.Empty;

    [StringLength(20)]
    public string Telefone { get; set; } = string.Empty;

    [StringLength(100)]
    public string LocalNascimento { get; set; } = string.Empty;

    [StringLength(100)]
    public string Nacionalidade { get; set; } = string.Empty;

    [StringLength(100)]
    public string Profissao { get; set; } = string.Empty;

    [StringLength(30)]
    public string Situacao { get; set; } = string.Empty;

    [StringLength(100)]
    public string GrauInstrucao { get; set; } = string.Empty;

    public ICollection<Dependente> Dependentes { get; set; } = new List<Dependente>();
    public ICollection<MatriculaAssociado> Matriculas { get; set; } = new List<MatriculaAssociado>();
}