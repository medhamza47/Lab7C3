import { Routes } from '@angular/router';
import { StudentFormComponent } from './student-form.component';
import { StudentListComponent } from './student-list.component';

export const routes: Routes = [
  { path: 'students', component: StudentListComponent },
  { path: 'students/new', component: StudentFormComponent },
  { path: 'students/:id/edit', component: StudentFormComponent },
  { path: '', pathMatch: 'full', redirectTo: 'students' },
  { path: '**', redirectTo: 'students' },
];
