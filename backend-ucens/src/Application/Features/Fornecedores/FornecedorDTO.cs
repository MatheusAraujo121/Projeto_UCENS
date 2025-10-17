using System;
using System.Collections.Generic;

namespace Application.Features.Fornecedores
{
    public class FornecedorDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Responsavel { get; set; } = string.Empty;
        public bool Ativo { get; set; }
        public decimal? LimiteCredito { get; set; }
        public string? Observacoes { get; set; }
        public List<DespesaDTO> Despesas { get; set; } = new List<DespesaDTO>();
    }
}