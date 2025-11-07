using Application.Common.Interfaces;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Usuarios
{
    public class UserService
    {
        private readonly IUserRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly PasswordService _passwordService;
        private readonly IMemoryCache _cache; // <-- Adicione
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const int MaxLoginAttempts = 5;
        private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(10);

        public UserService(IUserRepository repository, IConfiguration configuration, IMemoryCache cache, // <-- Adicione
            IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _configuration = configuration;
            _passwordService = new PasswordService();
            _cache = cache; // <-- Adicione
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<User>> GetAllUsers() => await _repository.GetAll();
        public async Task<User?> GetUser(int id) => await _repository.GetById(id);

        public async Task<User> AddUser(UserCreateDTO dto)
        {
            // --- VERIFICAÇÃO ADICIONAL DE SEGURANÇA ---
            if (string.IsNullOrWhiteSpace(dto.Senha))
            {
                throw new ArgumentException("A senha não pode ser vazia.", nameof(dto.Senha));
            }

            var user = new User
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            user.Senha = _passwordService.HashPassword(user, dto.Senha);

            return await _repository.Add(user);
        }

        public async Task<User> UpdateUser(int id, UserUpdateDTO dto)
        {
            var user = await _repository.GetById(id);
            if (user == null)
            {
                throw new Exception($"Usuário com ID {id} não encontrado.");
            }

            user.UserName = dto.UserName;
            user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.Senha))
            {
                user.Senha = _passwordService.HashPassword(user, dto.Senha);
            }

            return await _repository.Update(user);
        }

        public async Task DeleteUser(int id) => await _repository.Delete(id);

        public async Task<(string? Token, int? RemainingAttempts)> Login(LoginDTO dto)
        {
            var ipAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
            if (string.IsNullOrEmpty(ipAddress))
            {
                // Não é possível fazer o login sem um endereço de IP para segurança
                return (null, null);
            }

            var cacheKey = $"login_attempts_{ipAddress}";

            // Verifica se o IP já está bloqueado
            if (_cache.TryGetValue(cacheKey, out int attempts) && attempts >= MaxLoginAttempts)
            {
                return (null, 0); // Retorna 0 tentativas restantes
            }

            var user = await _repository.GetByEmail(dto.Email);

            if (user == null || !_passwordService.VerificarSenha(user, dto.Senha, user.Senha))
            {
                // Incrementa a tentativa de falha
                attempts++;
                _cache.Set(cacheKey, attempts, LockoutDuration); // Armazena no cache com tempo de expiração

                var remaining = MaxLoginAttempts - attempts;
                return (null, remaining < 0 ? 0 : remaining);
            }

            // Se o login for bem-sucedido, remove a chave do cache
            _cache.Remove(cacheKey);

            var token = GenerateJwtToken(user);
            return (token, null);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email), // Email
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", user.Id.ToString()),
                new Claim("username", user.UserName),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class PasswordService
    {
        private readonly PasswordHasher<User> _passwordHasher = new();

        public string HashPassword(User user, string senha)
        {
            return _passwordHasher.HashPassword(user, senha);
        }

        public bool VerificarSenha(User user, string senha, string senhaHash)
        {
            var result = _passwordHasher.VerifyHashedPassword(user, senhaHash, senha);
            return result == PasswordVerificationResult.Success;
        }
    }
}