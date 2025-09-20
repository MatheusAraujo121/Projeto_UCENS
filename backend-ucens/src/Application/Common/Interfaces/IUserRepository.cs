using Domain;

namespace Application.Common.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmail(string email);
    }
}