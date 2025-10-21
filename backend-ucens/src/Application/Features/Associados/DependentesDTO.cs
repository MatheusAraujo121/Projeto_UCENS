using System;
using System.ComponentModel.DataAnnotations; // Adicionado
using System.Text.Json.Serialization;

namespace Application.Features.Associados
{
    public class DependentesDTO
    {
        public int Id { get; set; }

        [JsonPropertyName("nome")]
        [StringLength(150)]
        public string Nome { get; set; } = string.Empty;

        [JsonPropertyName("rg")]
        [StringLength(30)]
        public string? Rg { get; set; }

        [JsonPropertyName("dataNascimento")]
        public DateTime DataNascimento { get; set; }

        [JsonPropertyName("sexo")]
        [StringLength(10)]
        public string? Sexo { get; set; }

        [JsonPropertyName("nomePai")]
        [StringLength(150)]
        public string? NomePai { get; set; }

        [JsonPropertyName("nomeMae")]
        [StringLength(150)]
        public string? NomeMae { get; set; }
        
        [JsonPropertyName("situacao")]
        [StringLength(30)]
        public string? Situacao { get; set; }

        [JsonPropertyName("grauParentesco")]
        [StringLength(50)]
        public string? GrauParentesco { get; set; }

        [JsonPropertyName("cognome")]
        [StringLength(100)]
        public string? Cognome { get; set; }

        [JsonPropertyName("numeroCarteirinha")]
        [StringLength(20)]
        public string? NumeroCarteirinha { get; set; }

        [JsonPropertyName("categoria")]
        [StringLength(50)]
        public string? Categoria { get; set; }

        [JsonPropertyName("validadeCarteirinha")]
        public DateTime? ValidadeCarteirinha { get; set; } 

        [JsonPropertyName("cpf")]
        [StringLength(14)]
        public string? Cpf { get; set; }

        [JsonPropertyName("localNascimento")]
        [StringLength(100)]
        public string? LocalNascimento { get; set; }

        [JsonPropertyName("nacionalidade")]
        [StringLength(100)]
        public string? Nacionalidade { get; set; }

        [JsonPropertyName("estadoCivil")]
        [StringLength(30)]
        public string? EstadoCivil { get; set; }

        [JsonPropertyName("grauInstrucao")]
        [StringLength(100)]
        public string? GrauInstrucao { get; set; }

        [JsonPropertyName("profissao")]
        [StringLength(100)]
        public string? Profissao { get; set; }

        [JsonPropertyName("exames")]
        [StringLength(500)]
        public string? Exames { get; set; }

        [JsonPropertyName("atividadesProibidas")]
        [StringLength(500)]
        public string? AtividadesProibidas { get; set; }
        
        [JsonPropertyName("associadoId")]
        public int AssociadoId { get; set; }
    }
}