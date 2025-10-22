using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Adicionado
using System.Text.Json.Serialization;

namespace Application.Features.Associados
{
    public class AssociadoDto
    {
        public int Id { get; set; }

        [JsonPropertyName("nome")]
        [StringLength(150)]
        public string Nome { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("cognome")]
        [StringLength(100)]
        public string Cognome { get; set; } = string.Empty;

        [JsonPropertyName("cpf")]
        [StringLength(14)]
        public string CPF { get; set; } = string.Empty;

        [JsonPropertyName("rg")]
        [StringLength(30)]
        public string Rg { get; set; } = string.Empty;

        [JsonPropertyName("dataNascimento")]
        public DateTime DataNascimento { get; set; }

        [JsonPropertyName("sexo")]
        [StringLength(10)]
        public string Sexo { get; set; } = string.Empty;

        [JsonPropertyName("estadoCivil")]
        [StringLength(30)]
        public string EstadoCivil { get; set; } = string.Empty;

        [JsonPropertyName("nomePai")]
        [StringLength(150)]
        public string NomePai { get; set; } = string.Empty;

        [JsonPropertyName("nomeMae")]
        [StringLength(150)]
        public string NomeMae { get; set; } = string.Empty;

        [JsonPropertyName("cep")]
        [StringLength(10)]
        public string Cep { get; set; } = string.Empty;

        [JsonPropertyName("endereco")]
        [StringLength(200)]
        public string Endereco { get; set; } = string.Empty;

        [JsonPropertyName("bairro")]
        [StringLength(100)]
        public string Bairro { get; set; } = "";

        [JsonPropertyName("cidade")]
        [StringLength(100)]
        public string Cidade { get; set; } = "";

        [JsonPropertyName("uf")]
        [StringLength(2)]
        public string UF { get; set; } = ""; 

        [JsonPropertyName("numero")]
        [StringLength(10)]
        public string Numero { get; set; } = string.Empty;

        [JsonPropertyName("complemento")]
        [StringLength(50)]
        public string Complemento { get; set; } = string.Empty;

        [JsonPropertyName("telefone")]
        [StringLength(20)]
        public string Telefone { get; set; } = string.Empty;

        [JsonPropertyName("localNascimento")]
        [StringLength(100)]
        public string LocalNascimento { get; set; } = string.Empty;

        [JsonPropertyName("nacionalidade")]
        [StringLength(100)]
        public string Nacionalidade { get; set; } = string.Empty;

        [JsonPropertyName("profissao")]
        [StringLength(100)]
        public string Profissao { get; set; } = string.Empty;

        [JsonPropertyName("situacao")]
        [StringLength(30)]
        public string Situacao { get; set; } = string.Empty;

        [JsonPropertyName("grauInstrucao")]
        [StringLength(100)]
        public string GrauInstrucao { get; set; } = string.Empty;

        public List<DependentesDTO> Dependentes { get; set; } = new();
    }
}