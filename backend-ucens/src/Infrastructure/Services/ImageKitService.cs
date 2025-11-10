using Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class ImageKitService : IImageKitService
    {
        private readonly HttpClient _httpClient;
        private readonly string _privateKey;
        private readonly string _uploadUrl = "https://upload.imagekit.io/api/v1/files/upload";
        private readonly string _deleteApiUrl = "https://api.imagekit.io/v1/files/";

        public ImageKitService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _privateKey = config["ImageKit:PrivateKey"] ?? throw new ArgumentNullException("ImageKit:PrivateKey não configurada.");

            // Configura a autenticação básica (Basic Auth)
            var authValue = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_privateKey}:"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
        }

        public async Task<(string Url, string FileId)> UploadAsync(IFormFile file, string fileName, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Arquivo não fornecido.");

            using var content = new MultipartFormDataContent();
            using var stream = file.OpenReadStream();

            var fileContent = new StreamContent(stream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

            content.Add(fileContent, "file", fileName);
            content.Add(new StringContent(fileName), "fileName");
            content.Add(new StringContent(folder), "folder");
            content.Add(new StringContent("true"), "useUniqueFileName");

            var response = await _httpClient.PostAsync(_uploadUrl, content);

            // Lança uma exceção se o upload falhar
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"Falha no upload para ImageKit. Status: {response.StatusCode}. Resposta: {errorBody}");
            }

            var json = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (root.TryGetProperty("url", out var urlElement) &&
                root.TryGetProperty("fileId", out var fileIdElement))
            {
                return (urlElement.GetString()!, fileIdElement.GetString()!);
            }

            throw new Exception("Falha ao parsear a resposta do ImageKit. URL ou FileId não encontrados.");
        }

        public async Task DeleteAsync(string fileId)
        {
            if (string.IsNullOrEmpty(fileId))
                return; // Nada para deletar

            try
            {
                var response = await _httpClient.DeleteAsync($"{_deleteApiUrl}{fileId}");

                // Se a resposta for Sucesso (200 OK ou 204 No Content), está OK.
                if (response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.NoContent)
                    return;

                // Se for 404 (Not Found), o arquivo já foi deletado. Não é um erro.
                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    Console.WriteLine($"Arquivo {fileId} não encontrado no ImageKit. Já foi deletado.");
                    return;
                }

                // Se chegou aqui, é um erro real (401, 403, 500, etc.)
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"Falha ao deletar arquivo do ImageKit (FileId: {fileId}). Status: {response.StatusCode}. Resposta da API: {errorBody}");
            }
            catch (Exception ex)
            {
                throw new Exception("Exceção no ImageKitService.DeleteAsync.", ex);
            }
        }
    }
}
