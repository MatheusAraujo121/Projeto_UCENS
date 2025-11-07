using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain
{
    public class Dependente
    {
        public int Id { get; set; }

        [StringLength(150)]
        public string Nome { get; set; } = string.Empty;

        [StringLength(30)]
        public string? Rg { get; set; }

        public DateTime DataNascimento { get; set; }

        [StringLength(10)]
        public string? Sexo { get; set; }

        [StringLength(150)]
        public string? NomePai { get; set; }

        [StringLength(150)]
        public string? NomeMae { get; set; }

        [StringLength(30)]
        public string? Situacao { get; set; }

        [StringLength(50)]
        public string? GrauParentesco { get; set; }

        public DateTime? DataLimite { get; set; }

        [StringLength(100)]
        public string? Cognome { get; set; }

        [StringLength(20)]
        public string? NumeroCarteirinha { get; set; }

        [StringLength(50)]
        public string? Categoria { get; set; }

        public DateTime? ValidadeCarteirinha { get; set; }

        [StringLength(14)]
        public string? Cpf { get; set; }

        [StringLength(100)]
        public string? LocalNascimento { get; set; }

        [StringLength(100)]
        public string? Nacionalidade { get; set; }

        [StringLength(30)]
        public string? EstadoCivil { get; set; }

        [StringLength(100)]
        public string? GrauInstrucao { get; set; }

        [StringLength(100)]
        public string? Profissao { get; set; }

        [StringLength(500)]
        public string? Exames { get; set; }

        [StringLength(500)]
        public string? AtividadesProibidas { get; set; }

        public int AssociadoId { get; set; }

        [JsonIgnore]
        public Associado Associado { get; set; } = null!;
        
        public ICollection<MatriculaDependente> Matriculas { get; set; } = new List<MatriculaDependente>();
    }
}