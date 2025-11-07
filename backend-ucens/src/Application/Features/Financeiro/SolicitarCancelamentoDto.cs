using System.ComponentModel.DataAnnotations;

namespace Application.Features.Financeiro
{
    public class SolicitarCancelamentoDto
    {
        [Required(ErrorMessage = "O motivo do cancelamento é obrigatório.")]
        [MinLength(5, ErrorMessage = "O motivo deve ter no mínimo 5 caracteres.")]
        public string Motivo { get; set; } = "";
    }
}