using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IImageKitService
    {
        // Retorna (Url, FileId)
        Task<(string Url, string FileId)> UploadAsync(IFormFile file, string fileName, string folder);
        
        Task DeleteAsync(string fileId);
    }
}