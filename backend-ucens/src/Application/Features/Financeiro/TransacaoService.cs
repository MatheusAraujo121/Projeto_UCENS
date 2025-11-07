using Application.Common.Interfaces;
using Domain;

namespace Application.Features.Financeiro
{
    public class TransacaoService
    {
        private readonly ITransacaoRepository _transacaoRepo;

        public TransacaoService(ITransacaoRepository transacaoRepo)
        {
            _transacaoRepo = transacaoRepo;
        }

        public async Task<Transacao> AddTransacaoAsync(TransacaoManualDTO dto)
        {
            if (dto.Tipo != "Entrada" && dto.Tipo != "Saida")
            {
                throw new ArgumentException("O tipo da transação deve ser 'Entrada' ou 'Saida'.");
            }

            var transacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Data = dto.Data,
                Tipo = dto.Tipo,
                Categoria = dto.Categoria
            };

            await _transacaoRepo.Add(transacao);
            // O SaveChanges é chamado pelo UnitOfWork ou pelo próprio Add/Update dependendo da implementação do IRepository
            // Se o seu IRepository.Add não salva, você precisaria injetar e usar IUnitOfWork aqui.
            // Assumindo que Add salva:
            return transacao;
        }

        public async Task<Transacao?> GetTransacaoByIdAsync(int id)
        {
            return await _transacaoRepo.GetById(id);
        }

        public async Task<bool> DeleteTransacaoAsync(int id)
        {
            var transacao = await _transacaoRepo.GetById(id);
            if (transacao == null)
            {
                return false; // Ou lançar uma exceção
            }

            await _transacaoRepo.Delete(transacao.Id); // Assumindo que Delete por ID existe e salva
            return true;
        }
    }
}