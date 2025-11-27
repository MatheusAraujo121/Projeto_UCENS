using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; 

namespace Application.Features.Fornecedores
{
    public class FornecedorDTO
    {
        public int Id { get; set; }

        [StringLength(150)] 
        public string Nome { get; set; } = string.Empty;

        [StringLength(18)] 
        public string Cnpj { get; set; } = string.Empty;

        [StringLength(20)] 
        public string Telefone { get; set; } = string.Empty;

        [StringLength(150)] 
        public string Email { get; set; } = string.Empty;

        [StringLength(150)] 
        public string Responsavel { get; set; } = string.Empty;

        public bool Ativo { get; set; } = true;
        public decimal? LimiteCredito { get; set; }

        [StringLength(500)] 
        public string? Observacoes { get; set; }

        public List<DespesaDTO> Despesas { get; set; } = new();
    }
}