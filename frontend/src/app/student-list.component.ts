import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { StudentService } from './student.service';

@Component({
  imports: [RouterLink, AsyncPipe],
  template: `<h2>Étudiants</h2><a routerLink="/students/new">Ajouter un étudiant</a>
    @if (error(); as message) { <p role="alert">{{ message }}</p> }
    @else if (students$ | async; as students) {
      <ul class="grid">
        @for (student of students; track student.id) {
          <li class="card">{{ student.firstName }} {{ student.lastName }} · {{ student.major }}
            <a [routerLink]="['/students', student.id, 'edit']">Modifier</a>
          </li>
        } @empty { <li>Aucun étudiant inscrit.</li> }
      </ul>
    } @else { <p role="status">Chargement…</p> }`,
})
export class StudentListComponent {
  readonly error = signal('');
  readonly students$ = inject(StudentService).getStudents().pipe(catchError((error: Error) => {
    this.error.set(error.message);
    return of([]);
  }));
}
