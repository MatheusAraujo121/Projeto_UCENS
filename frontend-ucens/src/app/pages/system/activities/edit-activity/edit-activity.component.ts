import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Activity {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  imagem?: string;
  exigePiscina: boolean;
  exigeFisico: boolean;
  categoria: string;
  diasDisponiveis: string[];
  horarioSugerido: string;
  idadeMinima: number;
  idadeMaxima: number;
  limiteParticipantes: number;
  local: string[];
  professorResponsavel: string;
}

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss']
})
export class EditActivityComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  previewUrl: string | null = null;
  diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  categorias = ['Esportiva', 'Cultural', 'Recreativa', 'Educacional'];
  sedes = ['Sede Social', 'Sede Campestre I', 'Sede Campestre II'];

  activities: Activity[] = [
    // Esportivas
    { id: 1, codigo: 'ESP001', nome: 'Beisebol', descricao: 'Praticado por duas equipes, com posições de ataque e defesa usando taco, luva e bola.', imagem: 'assets/activities/baseball.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Esportiva', diasDisponiveis: ['Terça-feira', 'Quinta-feira'], horarioSugerido: '09:00', idadeMinima: 10, idadeMaxima: 60, limiteParticipantes: 18, local: ['Campo Externo'], professorResponsavel: 'Pedro Santos' },
    { id: 2, codigo: 'ESP002', nome: 'Futebol', descricao: 'Esporte nacional brasileiro, praticado em campo e quadra, com uso de bola.', imagem: 'assets/activities/futebol.jpg', exigePiscina: false, exigeFisico: true, categoria: 'Esportiva', diasDisponiveis: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'], horarioSugerido: '18:00', idadeMinima: 12, idadeMaxima: 50, limiteParticipantes: 22, local: ['Campo de Futebol'], professorResponsavel: 'Mariana Silva' },
    { id: 3, codigo: 'ESP003', nome: 'Gateball', descricao: 'Esporte coletivo de taco, parecido com críquete, chamado Gêto-bôru no Japão.', imagem: 'assets/activities/gateball.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Esportiva', diasDisponiveis: ['Quarta-feira'], horarioSugerido: '10:00', idadeMinima: 8, idadeMaxima: 70, limiteParticipantes: 12, local: ['Quadra Externa'], professorResponsavel: 'Ana Tanaka' },
    { id: 4, codigo: 'ESP004', nome: 'Judô', descricao: 'Arte marcial japonesa e esporte olímpico de combate e defesa pessoal.', imagem: 'assets/activities/judo.jpg', exigePiscina: false, exigeFisico: true, categoria: 'Esportiva', diasDisponiveis: ['Segunda-feira', 'Sexta-feira'], horarioSugerido: '19:00', idadeMinima: 6, idadeMaxima: 65, limiteParticipantes: 16, local: ['Dojo'], professorResponsavel: 'Carlos Pereira' },
    { id: 5, codigo: 'ESP005', nome: 'Mallet Golf', descricao: 'Semelhante ao golfe, mas com taco, bola e tamanho de campo distintos.', imagem: 'assets/activities/mallet-golf.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Esportiva', diasDisponiveis: ['Sábado'], horarioSugerido: '08:00', idadeMinima: 10, idadeMaxima: 70, limiteParticipantes: 20, local: ['Campo Mallet Golf'], professorResponsavel: 'Felipe Costa' },
    { id: 6, codigo: 'ESP006', nome: 'Tênis de Mesa', descricao: 'Esporte praticado em mesa dividida por rede, com bola rápida.', imagem: 'assets/activities/tenis-mesa.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Esportiva', diasDisponiveis: ['Terça-feira', 'Quinta-feira'], horarioSugerido: '17:00', idadeMinima: 8, idadeMaxima: 80, limiteParticipantes: 4, local: ['Ginásio'], professorResponsavel: 'Roberta Alves' },
    // Culturais
    { id: 7, codigo: 'CUL001', nome: 'Fujin-Bu', descricao: 'Departamento composto pelas senhoras casadas da comunidade, com várias faixas etárias.', imagem: 'assets/activities/fujin-bu.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Cultural', diasDisponiveis: ['Quarta-feira'], horarioSugerido: '14:00', idadeMinima: 30, idadeMaxima: 80, limiteParticipantes: 25, local: ['Salão Social'], professorResponsavel: 'Sra. Harumi' },
    { id: 8, codigo: 'CUL002', nome: 'Karaokê', descricao: 'Onde as pessoas cantam acompanhando versões instrumentais de músicas.', imagem: 'assets/activities/karaoke.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Cultural', diasDisponiveis: ['Sexta-feira'], horarioSugerido: '20:00', idadeMinima: 15, idadeMaxima: 80, limiteParticipantes: 30, local: ['Auditório'], professorResponsavel: 'Roberto Lima' },
    { id: 9, codigo: 'CUL003', nome: 'Nitigo Gakô', descricao: 'Escola de língua japonesa da UCENS para aprendizado do idioma.', imagem: 'assets/activities/nitigo-gako.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Cultural', diasDisponiveis: ['Segunda-feira', 'Quinta-feira'], horarioSugerido: '18:30', idadeMinima: 10, idadeMaxima: 60, limiteParticipantes: 20, local: ['Sala de Aula'], professorResponsavel: 'Profª Yumi' },
    { id: 10, codigo: 'CUL004', nome: 'Roojin-Bu', descricao: 'Departamento de senhoras e senhores na melhor idade.', imagem: 'assets/activities/roojin-bu.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Cultural', diasDisponiveis: ['Quarta-feira'], horarioSugerido: '10:00', idadeMinima: 60, idadeMaxima: 90, limiteParticipantes: 30, local: ['Salão de Festas'], professorResponsavel: 'Sr. Tanaka' },
    { id: 11, codigo: 'CUL005', nome: 'Seinen-Bu', descricao: 'Departamento de jovens da UCENS, também chamado de Seinen-Kai.', imagem: 'assets/activities/seinen-bu.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Cultural', diasDisponiveis: ['Sábado'], horarioSugerido: '16:00', idadeMinima: 18, idadeMaxima: 30, limiteParticipantes: 25, local: ['Centro Jovem'], professorResponsavel: 'Lucas Silva' },
    { id: 12, codigo: 'CUL006', nome: 'Taikô', descricao: 'Grupo Inazuma Taikô, usam instrumentos japoneses de percussão.', imagem: 'assets/activities/taiko.jpg', exigePiscina: false, exigeFisico: false, categoria: 'Cultural', diasDisponiveis: ['Domingo'], horarioSugerido: '15:00', idadeMinima: 12, idadeMaxima: 70, limiteParticipantes: 20, local: ['Palco Externo'], professorResponsavel: 'Marina Sato' }
];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const act = this.activities.find(a => a.id === this.id)!;
    this.previewUrl = act.imagem || null;
    this.buildForm(act);
  }

  private buildForm(act: Activity): void {
    this.form = this.fb.group({
      codigo: [act.codigo, Validators.required],
      nome: [act.nome, Validators.required],
      descricao: [act.descricao],
      exigePiscina: [act.exigePiscina],
      exigeFisico: [act.exigeFisico],
      categoria: [act.categoria],
      diasDisponiveis: [act.diasDisponiveis],
      horarioSugerido: [act.horarioSugerido],
      idadeMinima: [act.idadeMinima],
      idadeMaxima: [act.idadeMaxima],
      limiteParticipantes: [act.limiteParticipantes],
      local: [act.local],
      professorResponsavel: [act.professorResponsavel]
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  atualizar(): void {
    if (this.form.valid) {
      const updated = { ...this.form.value, imagem: this.previewUrl };
      console.log('Atividade atualizada:', updated);
      this.router.navigate(['/view-activity', this.id]);
    } else {
      this.form.markAllAsTouched();
    }
  }
}