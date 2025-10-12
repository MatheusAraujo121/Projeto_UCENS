using System;
using System.Collections.Generic;
using System.Text.Json.Serialization; // 1. ADICIONE ESTE USING

namespace Application.Features.Associados
{
    public class AssociadoDto
    {
        public int Id { get; set; }

        [JsonPropertyName("nome")] // Mapeia "nome" do JSON para a propriedade Nome
        public string Nome { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("cognome")]
        public string Cognome { get; set; } = string.Empty;

        [JsonPropertyName("cpf")] // Mapeia "cpf" (minúsculo) para CPF (maiúsculo)
        public string CPF { get; set; } = string.Empty;

        [JsonPropertyName("rg")]
        public string Rg { get; set; } = string.Empty;

        [JsonPropertyName("dataNascimento")]
        public DateTime DataNascimento { get; set; }

        [JsonPropertyName("sexo")]
        public string Sexo { get; set; } = string.Empty;

        [JsonPropertyName("estadoCivil")]
        public string EstadoCivil { get; set; } = string.Empty;

        [JsonPropertyName("nomePai")]
        public string NomePai { get; set; } = string.Empty;

        [JsonPropertyName("nomeMae")]
        public string NomeMae { get; set; } = string.Empty;

        [JsonPropertyName("cep")]
        public string Cep { get; set; } = string.Empty;

        [JsonPropertyName("endereco")]
        public string Endereco { get; set; } = string.Empty;

        [JsonPropertyName("bairro")]
        public string Bairro { get; set; } = "";

        [JsonPropertyName("cidade")]
        public string Cidade { get; set; } = "";

        [JsonPropertyName("uf")]
        public string UF { get; set; } = ""; 

        [JsonPropertyName("numero")]
        public string Numero { get; set; } = string.Empty;

        [JsonPropertyName("complemento")]
        public string Complemento { get; set; } = string.Empty;

        [JsonPropertyName("telefone")]
        public string Telefone { get; set; } = string.Empty;

        [JsonPropertyName("localNascimento")]
        public string LocalNascimento { get; set; } = string.Empty;

        [JsonPropertyName("nacionalidade")]
        public string Nacionalidade { get; set; } = string.Empty;

        [JsonPropertyName("profissao")]
        public string Profissao { get; set; } = string.Empty;

        [JsonPropertyName("situacao")] // Mapeia "situacao" do JSON para a propriedade StatusQuo
        public string Situacao { get; set; } = string.Empty;

        // 2. ADICIONE A PROPRIEDADE QUE FALTAVA
        [JsonPropertyName("grauInstrucao")]
        public string GrauInstrucao { get; set; } = string.Empty;

        public List<DependentesDTO> Dependentes { get; set; } = new();
    }
}