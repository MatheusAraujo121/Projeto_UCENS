using Application.Features.Cnab;
using System.IO;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface ICnab400SicrediParser
    {
        Task<CnabParseResultDto> ParseAsync(Stream stream, bool abortOnError = false);
    }
}