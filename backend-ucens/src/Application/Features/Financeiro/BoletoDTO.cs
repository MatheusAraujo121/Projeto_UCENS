// backend-ucens/src/Application/Features/Financeiro/BoletoDto.cs
namespace Application.Features.Financeiro
{
    public class BoletoDTO
    {
        public int Id { get; set; }
        public int AssociadoId { get; set; }
        public decimal Valor { get; set; }
        public DateTime Vencimento { get; set; }
        public string Status { get; set; } = string.Empty; // Inicializado
        public AssociadoBoletoDto Associado { get; set; } = new(); // Inicializado

        // CAMPOS ADICIONADOS PARA O DETALHE
        public DateTime DataEmissao { get; set; }
        public string NossoNumero { get; set; } = string.Empty;
        public string? MotivoCancelamento { get; set; }
        public DateTime? DataPagamento { get; set; }
        public decimal? ValorPago { get; set; }
    }

    public class AssociadoBoletoDto
    {
        public string Nome { get; set; } = string.Empty; // Inicializado
    }
}