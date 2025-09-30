using System;
using System.Text.Json.Serialization;

namespace Application.Features.Associados
{
    public class DependentesDTO
    {
        public int Id { get; set; }

        [JsonPropertyName("nome")]
        public string Nome { get; set; } = string.Empty;

        [JsonPropertyName("rg")]
        public string? Rg { get; set; }

        [JsonPropertyName("dataNascimento")]
        public DateTime DataNascimento { get; set; }

        [JsonPropertyName("sexo")]
        public string? Sexo { get; set; }

        [JsonPropertyName("nomePai")]
        public string? NomePai { get; set; }

        [JsonPropertyName("nomeMae")]
        public string? NomeMae { get; set; }
        
        [JsonPropertyName("situacao")]
        public string? Situacao { get; set; }

        [JsonPropertyName("grauParentesco")]
        public string? GrauParentesco { get; set; }

        [JsonPropertyName("cognome")]
        public string? Cognome { get; set; }

        [JsonPropertyName("numeroCarteirinha")]
        public string? NumeroCarteirinha { get; set; }

        [JsonPropertyName("categoria")]
        public string? Categoria { get; set; }

        [JsonPropertyName("validadeCarteirinha")]
        public DateTime? ValidadeCarteirinha { get; set; } 

        [JsonPropertyName("cpf")]
        public string? Cpf { get; set; }

        [JsonPropertyName("localNascimento")]
        public string? LocalNascimento { get; set; }

        [JsonPropertyName("nacionalidade")]
        public string? Nacionalidade { get; set; }

        [JsonPropertyName("estadoCivil")]
        public string? EstadoCivil { get; set; }

        [JsonPropertyName("grauInstrucao")]
        public string? GrauInstrucao { get; set; }

        [JsonPropertyName("profissao")]
        public string? Profissao { get; set; }

        [JsonPropertyName("exames")]
        public string? Exames { get; set; }

        [JsonPropertyName("atividadesProibidas")]
        public string? AtividadesProibidas { get; set; }
        
        [JsonPropertyName("associadoId")]
        public int AssociadoId { get; set; }
    }
}
