import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TurmaService } from 'src/app/services/classes/turma.service';
import { Atividade } from 'src/app/services/activities/activity.interface';
import { AtividadeService } from 'src/app/services/activities/activity.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  atividadeId!: number;
  activity: Atividade | undefined;

  diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  constructor(
    private fb: FormBuilder,
    private turmaService: TurmaService,
    private atividadeService: AtividadeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      professor: ['', [Validators.maxLength(150), Validators.required]],
      diasDisponiveis: [[], Validators.required],
      horarioSugerido: ['', Validators.required],
      vagas: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.atividadeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.atividadeId > 0) {
      this.loadActivityDetails();
    } else {
      this.snackBar.open('ID da atividade inválido.', 'Fechar', { duration: 5000 });
      this.router.navigate(['/list-activities']);
    }
  }

  loadActivityDetails(): void {
    this.atividadeService.getById(this.atividadeId).subscribe(activity => {
      this.activity = activity;
    });
  }

  efetuarCadastro(): void {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }
    this.isLoading = true;

    const dias = this.form.value.diasDisponiveis.join(', ');
    const horario = this.form.value.horarioSugerido;
    const diasHorariosString = `${dias} às ${horario}`;

    const turmaData = {
      nome: this.form.value.nome,
      professor: this.form.value.professor,
      vagas: this.form.value.vagas,
      diasHorarios: diasHorariosString,
      atividadeId: this.atividadeId
    };

    this.turmaService.createTurma(turmaData).subscribe({
      next: () => {
        this.snackBar.open('Turma cadastrada com sucesso!', 'Fechar', { duration: 3000 });
        this.isLoading = false;
        this.goBack();
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open('Erro ao cadastrar turma.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/view-activity', this.atividadeId]);
  }
}