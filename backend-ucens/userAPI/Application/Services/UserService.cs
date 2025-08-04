using userApi.Domain.Entities;
using userApi.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;


namespace userApi.Application.Services
{
    public class UserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<User>> GetAllUsers() => await _repository.GetAllAsync();
        public async Task<User?> GetUser(int id) => await _repository.GetByIdAsync(id);
        public async Task<User> AddUser(User user) => await _repository.AddAsync(user);
        public async Task<User> UpdateUser(User user) => await _repository.UpdateAsync(user);
        public async Task DeleteUser(int id) => await _repository.DeleteAsync(id);
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
