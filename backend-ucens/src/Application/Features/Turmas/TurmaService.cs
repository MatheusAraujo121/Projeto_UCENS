using Application.Common.Interfaces;
using Domain;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Turmas
{
    public class TurmaService
    {
        private readonly ITurmaRepository _turmaRepo;
        private readonly IRepository<Atividade> _atividadeRepo;
        private readonly IMatriculaAssociadoRepository _matriculaAssociadoRepo;
        private readonly IMatriculaDependenteRepository _matriculaDependenteRepo;

        public TurmaService(
            ITurmaRepository turmaRepo,
            IRepository<Atividade> atividadeRepo,
            IMatriculaAssociadoRepository matriculaAssociadoRepo,
            IMatriculaDependenteRepository matriculaDependenteRepo)
        {
            _turmaRepo = turmaRepo;
            _atividadeRepo = atividadeRepo;
            _matriculaAssociadoRepo = matriculaAssociadoRepo;
            _matriculaDependenteRepo = matriculaDependenteRepo;
        }

        public async Task<List<TurmaDTO>> GetAll()
        {
            var turmas = await _turmaRepo.GetAllWithMatriculados();
            return turmas.Select(t => MapToDto(t)).ToList();
        }

        public async Task<TurmaDTO?> GetById(int id)
        {
            var turma = await _turmaRepo.GetByIdWithMatriculados(id);
            return turma == null ? null : MapToDto(turma);
        }

        public async Task<Turma> Add(TurmaDTO dto)
        {
            var atividade = await _atividadeRepo.GetById(dto.AtividadeId);
            if (atividade == null)
            {
                throw new System.Exception($"Atividade com ID {dto.AtividadeId} não encontrada. Não é possível criar a turma.");
            }

            var turma = new Turma
            {
                Nome = dto.Nome,
                Professor = dto.Professor,
                DiasHorarios = dto.DiasHorarios,
                Vagas = dto.Vagas,
                AtividadeId = dto.AtividadeId
            };
            return await _turmaRepo.Add(turma);
        }
        public async Task Delete(int id)
        {
            var turma = await _turmaRepo.GetById(id);
            if (turma == null)
            {
                throw new System.Exception($"Turma com ID {id} não encontrada.");
            }
            await _turmaRepo.Delete(id);
        }

        public async Task MatricularAssociado(MatriculaDTO dto)
        {
            var matricula = new MatriculaAssociado { TurmaId = dto.TurmaId, AssociadoId = dto.AlunoId };
            await _matriculaAssociadoRepo.Add(matricula);
        }
        
        public async Task DesmatricularAssociado(MatriculaDTO dto)
        {
            var matricula = await _matriculaAssociadoRepo.Find(dto.AlunoId, dto.TurmaId);
            if (matricula == null)
            {
                throw new System.Exception("Matrícula de associado não encontrada.");
            }
            await _matriculaAssociadoRepo.Remove(matricula);
        }

        public async Task MatricularDependente(MatriculaDTO dto)
        {
            var matricula = new MatriculaDependente { TurmaId = dto.TurmaId, DependenteId = dto.AlunoId };
            await _matriculaDependenteRepo.Add(matricula);
        }

        public async Task DesmatricularDependente(MatriculaDTO dto)
        {
            var matricula = await _matriculaDependenteRepo.Find(dto.AlunoId, dto.TurmaId);
             if (matricula == null)
            {
                throw new System.Exception("Matrícula de dependente não encontrada.");
            }
            await _matriculaDependenteRepo.Remove(matricula);
        }
        
        private static TurmaDTO MapToDto(Turma turma)
        {
            var alunos = new List<AlunoMatriculadoDTO>();
            
            if (turma.MatriculasAssociados != null)
            {
                alunos.AddRange(turma.MatriculasAssociados.Select(ma => new AlunoMatriculadoDTO
                {
                    Id = ma.Associado.Id,
                    Nome = ma.Associado.Nome,
                    Tipo = "Associado"
                }));
            }

            if (turma.MatriculasDependentes != null)
            {
                alunos.AddRange(turma.MatriculasDependentes.Select(md => new AlunoMatriculadoDTO
                {
                    Id = md.Dependente.Id,
                    Nome = md.Dependente.Nome,
                    Tipo = "Dependente"
                }));
            }

            return new TurmaDTO
            {
                Id = turma.Id,
                Nome = turma.Nome,
                Professor = turma.Professor,
                DiasHorarios = turma.DiasHorarios,
                Vagas = turma.Vagas,
                AtividadeId = turma.AtividadeId,
                AlunosMatriculados = alunos
            };
        }
    }
}