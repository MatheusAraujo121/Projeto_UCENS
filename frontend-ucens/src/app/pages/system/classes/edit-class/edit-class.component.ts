import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TurmaService } from 'src/app/services/classes/turma.service';
import { Turma } from 'src/app/services/classes/class.interface';

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.scss']
})
export class EditClassComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  turmaId: number | null = null;
  atividadeId: number | null = null;
  diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  constructor(
    private fb: FormBuilder,
    private turmaService: TurmaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      id: [null],
      atividadeId: [null],
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      professor: ['', [Validators.maxLength(150), Validators.required]],
      diasDisponiveis: [[], Validators.required],
      horarioSugerido: ['', Validators.required],
      vagas: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.turmaId = +idParam;
      this.loadTurmaData(this.turmaId);
    } else {
        this.snackBar.open('ID da turma não fornecido.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-activities']);
    }
  }

  loadTurmaData(id: number): void {
    this.isLoading = true;
    this.turmaService.getTurmaById(id).subscribe({
      next: (data: Turma) => {
        this.atividadeId = data.atividadeId;
        let dias: string[] = [];
        let horario = '';
        if (data.diasHorarios && data.diasHorarios.includes(' às ')) {
          const parts = data.diasHorarios.split(' às ');
          dias = parts[0].split(', ');
          horario = parts[1];
        }

        this.form.patchValue({
            id: data.id,
            atividadeId: data.atividadeId,
            nome: data.nome,
            professor: data.professor,
            vagas: data.vagas,
            diasDisponiveis: dias,
            horarioSugerido: horario
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar dados da turma.', 'Fechar', { duration: 3000 });
        this.goBack();
      }
    });
  }

  efetuarAtualizacao(): void {
    if (this.form.invalid || !this.turmaId) {
      this.snackBar.open('Por favor, preencha os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const dias = this.form.value.diasDisponiveis.join(', ');
    const horario = this.form.value.horarioSugerido;
    const diasHorariosString = `${dias} às ${horario}`;
    const turmaData: Turma = {
        id: this.turmaId,
        atividadeId: this.form.value.atividadeId,
        nome: this.form.value.nome,
        professor: this.form.value.professor,
        vagas: this.form.value.vagas,
        diasHorarios: diasHorariosString,
        alunosMatriculados: []
    };

    this.turmaService.updateTurma(this.turmaId, turmaData).subscribe({
      next: () => {
        this.snackBar.open('Turma atualizada com sucesso!', 'Fechar', { duration: 3000 });
        this.goBack();
      },
      error: (error) => {
        this.snackBar.open('Erro ao atualizar. Verifique os dados e tente novamente.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  goBack() {
    if (this.atividadeId) {
        this.router.navigate(['/view-activity', this.atividadeId]);
    } else {
        this.router.navigate(['/list-activities']);
    }
  }
}