using System.Collections.Generic;

namespace Domain
{
    public class Fornecedor
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Responsavel { get; set; } = string.Empty;
        public bool Ativo { get; set; } = true;
        public decimal? LimiteCredito { get; set; }
        public string? Observacoes { get; set; }
        public ICollection<Despesa> Despesas { get; set; } = new List<Despesa>();
    }
}