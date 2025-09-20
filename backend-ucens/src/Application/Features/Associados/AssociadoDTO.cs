using System;
using System.Collections.Generic;

namespace Application.Features.Associados
{
    public class AssociadoDto
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Cognome { get; set; } = string.Empty;

        public string CPF { get; set; } = string.Empty;

        public string Rg { get; set; } = string.Empty;

        public DateTime DataNascimento { get; set; }

        public string Sexo { get; set; } = string.Empty;

        public string EstadoCivil { get; set; } = string.Empty;

        public string NomePai { get; set; } = string.Empty;

        public string NomeMae { get; set; } = string.Empty;

        public string Endereco { get; set; } = string.Empty;

        public string Numero { get; set; } = string.Empty;

        public string Complemento { get; set; } = string.Empty;

        public string Telefone { get; set; } = string.Empty;

        public string LocalNascimento { get; set; } = string.Empty;

        public string Nacionalidade { get; set; } = string.Empty;

        public string Profissao { get; set; } = string.Empty;

        public string StatusQuo { get; set; } = string.Empty;

        public List<DependentesDTO> Dependentes { get; set; } = new();
    }

}