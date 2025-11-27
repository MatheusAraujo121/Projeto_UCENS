import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/services/user/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'userName', 'email', 'acoes']; 
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  currentUserId: string | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.currentUserId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.dataSource.data = users;
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.snackBar.open('Falha ao carregar usuários.', 'Fechar', { duration: 5000, panelClass: ['snackbar-error'] });
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator) {
      this.paginatorIntl.itemsPerPageLabel = 'Itens por página';
      this.paginatorIntl.nextPageLabel = 'Próxima página';
      this.paginatorIntl.previousPageLabel = 'Página anterior';
      this.paginatorIntl.firstPageLabel = 'Primeira página';
      this.paginatorIntl.lastPageLabel = 'Última página';
      this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 de ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginatorIntl.changes.next();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isCurrentUser(userId: number): boolean {
    return this.currentUserId === userId.toString();
  }

  deleteUser(id: number, userName: string): void {
    if (this.isCurrentUser(id)) {
      this.snackBar.open('Você não pode excluir seu próprio usuário.', 'Fechar', { duration: 5000, panelClass: ['snackbar-warn'] });
      return;
    }

    const confirmation = confirm(`Tem certeza que deseja excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`);

    if (confirmation) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
          this.loadUsers();
        },
        (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.snackBar.open('Falha ao excluir usuário.', 'Fechar', { duration: 5000, panelClass: ['snackbar-error'] });
        }
      );
    }
  }
}