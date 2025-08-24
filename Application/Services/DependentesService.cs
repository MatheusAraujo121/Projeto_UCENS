using userApi.Domain.Entities;
using userApi.Domain.Interfaces;

namespace userApi.Application.Services
{
    public class DependentesService
    {
        private readonly IRepository<Dependentes> _repo;

        public DependentesService(IRepository<Dependentes> repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<Dependentes>> GetAll() => _repo.GetAll();
        public Task<Dependentes?> GetById(int id) => _repo.GetById(id);
        public Task<Dependentes> Add(Dependentes d) => _repo.Add(d);
        public Task<Dependentes> Update(Dependentes d) => _repo.Update(d);
        public Task Delete(int id) => _repo.Delete(id);
    }
}
