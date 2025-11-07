using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // Adicionado

namespace Application.Features.Fornecedores
{
    public class FornecedorDTO
    {
        public int Id { get; set; }

        [StringLength(150)] // Adicionado
        public string Nome { get; set; } = string.Empty;

        [StringLength(18)] // Tamanho para CNPJ formatado (ex: 00.000.000/0001-00) ou CPF
        public string Cnpj { get; set; } = string.Empty;

        [StringLength(20)] // Adicionado
        public string Telefone { get; set; } = string.Empty;

        [StringLength(150)] // Adicionado
        public string Email { get; set; } = string.Empty;

        [StringLength(150)] // Adicionado
        public string Responsavel { get; set; } = string.Empty;

        public bool Ativo { get; set; } = true;
        public decimal? LimiteCredito { get; set; }

        [StringLength(500)] // Adicionado
        public string? Observacoes { get; set; }

        public List<DespesaDTO> Despesas { get; set; } = new();
    }
}