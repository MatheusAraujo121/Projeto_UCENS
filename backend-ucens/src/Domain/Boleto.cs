using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain;

public enum BoletoStatus
{
    Gerado,
    Enviado, 
    Pago,
    Vencido,
    Rejeitado
}

public class Boleto
{
    public int Id { get; set; }

    [Required]
    public int AssociadoId { get; set; }

    [ForeignKey("AssociadoId")]
    public Associado Associado { get; set; } = null!;

    [Required]
    public decimal Valor { get; set; }

    [Required]
    public DateTime DataVencimento { get; set; }

    public DateTime DataEmissao { get; set; }
    public DateTime? DataPagamento { get; set; }
    public decimal? ValorPago { get; set; }

    [Required]
    public string NossoNumero { get; set; } = string.Empty; 

    [Required]
    public BoletoStatus Status { get; set; }

    public bool Aceite { get; set; } = true;
    public string EspecieDocumento { get; set; } = "A";

    public decimal? JurosMora { get; set; } 
    public decimal? PercentualMulta { get; set; }
    public int? DiasParaProtesto { get; set; }
}