using Application.Features.Relatorios;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatorioController : ControllerBase
    {
        private readonly RelatorioService _service;

        public RelatorioController(RelatorioService service)
        {
            _service = service;
        }

        [HttpGet("associados-com-dependentes")]
        public async Task<IActionResult> GetRelatorioAssociadosComDependentes()
        {
            var relatorio = await _service.GerarRelatorioAssociadosComDependentes();
            return Ok(relatorio);
        }
    }
}