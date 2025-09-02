using userApi.Domain.Entities;
using userApi.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using userApi.API.DTOs;


namespace userApi.Application.Services
{
    public class UserService
    {
        private readonly IUserRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly PasswordService _passwordService;
        public UserService(IUserRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
            _passwordService = new PasswordService();
        }

        public async Task<IEnumerable<User>> GetAllUsers() => await _repository.GetAllAsync();
        public async Task<User?> GetUser(int id) => await _repository.GetByIdAsync(id);
        public async Task<User> AddUser(User user)
        {
            user.senia = _passwordService.HashPassword(user, user.senia);
            return await _repository.AddAsync(user);
        }
        public async Task<User> UpdateUser(User user) => await _repository.UpdateAsync(user);
        public async Task DeleteUser(int id) => await _repository.DeleteAsync(id);
        public async Task<string?> Login(LoginDTO dto)
        {
            var user = await _repository.GetByEmailAsync(dto.Email);

            if (user == null || !_passwordService.VerificarSenha(user, dto.Password, user.senia))
                return null;

            return GenerateJwtToken(user.Email);
        }


        private string GenerateJwtToken(string email)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
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
