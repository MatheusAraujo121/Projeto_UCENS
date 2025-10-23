using System;
using System.Collections.Generic;

namespace Application.Features.Relatorios
{
    public class RelatorioFinanceiroDTO
    {
        public decimal TotalEntradas { get; set; }
        public decimal TotalSaidas { get; set; }
        public decimal Saldo { get; set; }
        public List<TransacaoItemDTO> Transacoes { get; set; } = new();
    }

    public class TransacaoItemDTO
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty; // "Entrada" ou "Saida"
        public decimal Valor { get; set; }
        public string Origem { get; set; } = string.Empty; // "Boleto", "Despesa", "Manual"
    }
}