using userApi.Domain.Entities;
using userApi.Domain.Interfaces;

namespace userApi.Application.Services
{
    public class AssociadosService
    {
        private readonly IRepository<Associados> _repo;

        public AssociadosService(IRepository<Associados> repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<Associados>> GetAll() => _repo.GetAll();
        public Task<Associados?> GetById(int id) => _repo.GetById(id);
        public Task<Associados> Add(Associados a) => _repo.Add(a);
        public Task<Associados> Update(Associados a) => _repo.Update(a);
        public Task Delete(int id) => _repo.Delete(id);
    }
}
